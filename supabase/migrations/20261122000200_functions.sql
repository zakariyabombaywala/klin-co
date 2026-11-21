-- Helper functions, triggers and read models.

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
-- Full admin: can change the catalogue, orders and settings.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Admin or the read-only demo admin: can view the dashboard but not write.
create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'demo_admin'));
$$;

-- ---------------------------------------------------------------------------
-- Profiles follow auth.users
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = coalesce(new.email, '') where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- ---------------------------------------------------------------------------
-- Products: stamp published_at the first time a product goes live
-- ---------------------------------------------------------------------------
create function public.stamp_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger products_published_at
  before insert or update of status on public.products
  for each row execute function public.stamp_published_at();

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
-- True when the signed-in customer has a paid order containing the product.
create function public.has_purchased(p_product_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where o.user_id = auth.uid()
      and oi.product_id = p_product_id
      and o.status in ('paid', 'processing', 'shipped', 'delivered')
  );
$$;

-- Customer-written reviews are always verified (only buyers may write them) and
-- start in moderation. Rows inserted by the service role (seed, imports) keep
-- their own values.
create function public.prepare_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.user_id := auth.uid();
    new.verified := public.has_purchased(new.product_id);
    if tg_op = 'INSERT' then
      new.status := 'pending';
    else
      -- Editing a review sends it back to moderation; customers can't approve themselves.
      new.status := case when old.status = 'hidden' then 'hidden' else 'pending' end;
    end if;
  end if;
  return new;
end;
$$;

create trigger reviews_prepare
  before insert or update on public.reviews
  for each row execute function public.prepare_review();

create view public.product_review_stats
with (security_invoker = true)
as
select
  product_id,
  count(*)::integer as review_count,
  round(avg(rating)::numeric, 2)::float8 as average_rating,
  count(*) filter (where rating = 5)::integer as five_star,
  count(*) filter (where rating = 4)::integer as four_star,
  count(*) filter (where rating = 3)::integer as three_star,
  count(*) filter (where rating = 2)::integer as two_star,
  count(*) filter (where rating = 1)::integer as one_star
from public.reviews
where status = 'approved'
group by product_id;

-- ---------------------------------------------------------------------------
-- Listing read model: one row per product with price range, stock, first two
-- images, rating and filterable option values. security_invoker keeps RLS.
-- ---------------------------------------------------------------------------
create view public.product_cards
with (security_invoker = true)
as
select
  p.id,
  p.slug,
  p.title,
  p.subtitle,
  p.status,
  p.is_featured,
  p.category_id,
  c.slug as category_slug,
  c.name as category_name,
  coalesce(v.min_price, p.base_price) as price,
  coalesce(v.max_price, p.base_price) as max_price,
  coalesce(cheapest.compare_at_price, p.compare_at_price) as compare_at_price,
  (coalesce(v.any_on_sale, false) or p.compare_at_price is not null) as on_sale,
  coalesce(v.total_stock, 0) as total_stock,
  coalesce(v.variant_count, 0) as variant_count,
  coalesce(v.glazes, '{}') as glazes,
  coalesce(v.sizes, '{}') as sizes,
  img.url as image_url,
  img.alt as image_alt,
  img2.url as hover_image_url,
  img2.alt as hover_image_alt,
  coalesce(s.average_rating, 0)::float8 as average_rating,
  coalesce(s.review_count, 0) as review_count,
  p.search,
  p.published_at,
  p.created_at
from public.products p
left join public.categories c on c.id = p.category_id
left join lateral (
  select
    min(pv.price)::integer as min_price,
    max(pv.price)::integer as max_price,
    sum(pv.stock)::integer as total_stock,
    count(*)::integer as variant_count,
    bool_or(pv.compare_at_price is not null) as any_on_sale,
    array_remove(array_agg(distinct pv.options ->> 'glaze'), null) as glazes,
    array_remove(array_agg(distinct pv.options ->> 'size'), null) as sizes
  from public.product_variants pv
  where pv.product_id = p.id
) v on true
left join lateral (
  select pv.compare_at_price
  from public.product_variants pv
  where pv.product_id = p.id
  order by pv.price, pv.position
  limit 1
) cheapest on true
left join lateral (
  select pi.url, pi.alt from public.product_images pi
  where pi.product_id = p.id order by pi.position limit 1
) img on true
left join lateral (
  select pi.url, pi.alt from public.product_images pi
  where pi.product_id = p.id order by pi.position offset 1 limit 1
) img2 on true
left join public.product_review_stats s on s.product_id = p.id;

-- ---------------------------------------------------------------------------
-- Discount codes: validate without exposing the table to the public.
-- Amounts are calculated in the app's pricing module from these fields.
-- ---------------------------------------------------------------------------
create function public.validate_discount_code(p_code text, p_subtotal integer)
returns table (
  code text,
  type public.discount_type,
  value integer,
  min_order_cents integer,
  valid boolean,
  reason text
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  d public.discount_codes;
  v_code text := upper(trim(coalesce(p_code, '')));
begin
  select * into d from public.discount_codes dc where dc.code = v_code;

  if not found or not d.active then
    return query select v_code, null::public.discount_type, 0, 0, false, 'not_found'::text;
    return;
  end if;
  if d.starts_at is not null and d.starts_at > now() then
    return query select d.code, d.type, d.value, d.min_order_cents, false, 'not_started'::text;
    return;
  end if;
  if d.expires_at is not null and d.expires_at <= now() then
    return query select d.code, d.type, d.value, d.min_order_cents, false, 'expired'::text;
    return;
  end if;
  if d.usage_limit is not null and d.times_used >= d.usage_limit then
    return query select d.code, d.type, d.value, d.min_order_cents, false, 'used_up'::text;
    return;
  end if;
  if coalesce(p_subtotal, 0) < d.min_order_cents then
    return query select d.code, d.type, d.value, d.min_order_cents, false, 'below_minimum'::text;
    return;
  end if;

  return query select d.code, d.type, d.value, d.min_order_cents, true, null::text;
end;
$$;

-- ---------------------------------------------------------------------------
-- Orders: status timeline
-- ---------------------------------------------------------------------------
-- Every insert and status change writes a timeline row. A caller can attach a
-- note for the same transaction with set_config('kiln.status_note', ..., true).
create function public.record_order_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_note text := nullif(current_setting('kiln.status_note', true), '');
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.order_status_history (order_id, status, note, created_by)
    values (
      new.id,
      new.status,
      coalesce(v_note, case new.status
        when 'pending' then 'Order created.'
        when 'paid' then 'Payment received.'
        when 'processing' then 'Being packed in the studio.'
        when 'shipped' then 'Handed to the carrier.'
        when 'delivered' then 'Delivered.'
        when 'cancelled' then 'Order cancelled.'
        when 'refunded' then 'Payment refunded.'
      end),
      auth.uid()
    );
  end if;
  return new;
end;
$$;

create trigger orders_status_history
  after insert or update of status on public.orders
  for each row execute function public.record_order_status();

-- Allowed moves: forward through fulfilment, or out to cancelled/refunded.
create function public.order_status_can_change(p_from public.order_status, p_to public.order_status)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case p_from
    when 'pending' then p_to in ('paid', 'cancelled')
    when 'paid' then p_to in ('processing', 'shipped', 'cancelled', 'refunded')
    when 'processing' then p_to in ('shipped', 'cancelled', 'refunded')
    when 'shipped' then p_to in ('delivered', 'refunded')
    when 'delivered' then p_to in ('refunded')
    else false
  end;
$$;

-- Admin action: change status and/or tracking with an optional timeline note.
-- Runs as the caller, so RLS (admins only) still applies.
create function public.update_order_status(
  p_order_id uuid,
  p_status public.order_status,
  p_note text default null,
  p_tracking_number text default null,
  p_tracking_carrier text default null
)
returns public.orders
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order public.orders;
begin
  if not public.is_admin() then
    raise exception 'Only admins can change orders' using errcode = '42501';
  end if;

  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;

  if p_status <> v_order.status and not public.order_status_can_change(v_order.status, p_status) then
    raise exception 'Cannot move an order from % to %', v_order.status, p_status using errcode = '22023';
  end if;

  perform set_config('kiln.status_note', coalesce(p_note, ''), true);

  update public.orders
  set status = p_status,
      tracking_number = coalesce(nullif(trim(p_tracking_number), ''), tracking_number),
      tracking_carrier = coalesce(nullif(trim(p_tracking_carrier), ''), tracking_carrier)
  where id = p_order_id
  returning * into v_order;

  perform set_config('kiln.status_note', '', true);
  return v_order;
end;
$$;

-- ---------------------------------------------------------------------------
-- Checkout fulfilment (called by the Stripe webhook with the service role)
--
-- In one transaction: records the Stripe event (idempotency), creates the
-- order and its line snapshots, decrements stock without ever going below
-- zero, and counts the discount use. Re-delivered events return the existing
-- order instead of creating a second one.
--
-- p_order: {email, user_id?, stripe_session_id, stripe_payment_intent_id?,
--           subtotal, discount_total, shipping_total, tax_total, total,
--           currency?, discount_code?, shipping_method?, shipping_address?}
-- p_items: [{variant_id, quantity, unit_price, product_id?, product_title,
--            product_slug?, variant_title?, sku?, image_url?}]
-- ---------------------------------------------------------------------------
create function public.fulfil_checkout(
  p_event_id text,
  p_event_type text,
  p_order jsonb,
  p_items jsonb
)
returns table (order_id uuid, order_number text, already_processed boolean)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_order_id uuid;
  v_number text;
  v_item jsonb;
  v_qty integer;
  v_variant uuid;
  v_updated integer;
  v_shortfalls text[] := '{}';
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Checkout has no items' using errcode = '22023';
  end if;

  -- 1. Idempotency. Concurrent deliveries of the same event block on the
  --    primary key here; the loser sees the conflict and returns early.
  insert into public.stripe_events (id, type) values (p_event_id, p_event_type)
  on conflict (id) do nothing;
  if not found then
    return query
      select e.order_id, o.order_number, true
      from public.stripe_events e
      left join public.orders o on o.id = e.order_id
      where e.id = p_event_id;
    return;
  end if;

  -- The same Checkout Session can arrive under a second event type
  -- (e.g. completed, then async_payment_succeeded). One session, one order.
  select o.id, o.order_number into v_order_id, v_number
  from public.orders o
  where o.stripe_session_id = p_order ->> 'stripe_session_id';
  if found then
    update public.stripe_events set order_id = v_order_id where id = p_event_id;
    return query select v_order_id, v_number, true;
    return;
  end if;

  -- 2. Order
  insert into public.orders (
    user_id, email, status, subtotal, discount_total, shipping_total, tax_total, total,
    currency, discount_code, shipping_method, shipping_address,
    stripe_session_id, stripe_payment_intent_id, paid_at
  )
  values (
    nullif(p_order ->> 'user_id', '')::uuid,
    p_order ->> 'email',
    'paid',
    (p_order ->> 'subtotal')::integer,
    coalesce((p_order ->> 'discount_total')::integer, 0),
    coalesce((p_order ->> 'shipping_total')::integer, 0),
    coalesce((p_order ->> 'tax_total')::integer, 0),
    (p_order ->> 'total')::integer,
    coalesce(p_order ->> 'currency', 'usd'),
    nullif(upper(p_order ->> 'discount_code'), ''),
    coalesce(p_order ->> 'shipping_method', 'standard')::public.shipping_method,
    p_order -> 'shipping_address',
    p_order ->> 'stripe_session_id',
    p_order ->> 'stripe_payment_intent_id',
    now()
  )
  returning id, orders.order_number into v_order_id, v_number;

  -- 3. Line items and stock
  for v_item in select value from jsonb_array_elements(p_items) loop
    v_qty := (v_item ->> 'quantity')::integer;
    v_variant := nullif(v_item ->> 'variant_id', '')::uuid;

    insert into public.order_items (
      order_id, product_id, variant_id, product_title, product_slug, variant_title,
      sku, image_url, unit_price, quantity, line_total
    )
    values (
      v_order_id,
      nullif(v_item ->> 'product_id', '')::uuid,
      v_variant,
      v_item ->> 'product_title',
      v_item ->> 'product_slug',
      v_item ->> 'variant_title',
      v_item ->> 'sku',
      v_item ->> 'image_url',
      (v_item ->> 'unit_price')::integer,
      v_qty,
      (v_item ->> 'unit_price')::integer * v_qty
    );

    if v_variant is not null then
      -- Atomic conditional decrement: the row lock serialises concurrent buyers.
      update public.product_variants
      set stock = stock - v_qty
      where id = v_variant and stock >= v_qty;
      get diagnostics v_updated = row_count;

      if v_updated = 0 then
        -- Someone else bought the last pieces between checkout and payment.
        -- Take what is left (never below zero) and flag it for the studio.
        update public.product_variants set stock = 0 where id = v_variant;
        v_shortfalls := v_shortfalls || coalesce(v_item ->> 'sku', v_variant::text);
      end if;
    end if;
  end loop;

  -- 4. Discount usage
  if nullif(p_order ->> 'discount_code', '') is not null then
    update public.discount_codes
    set times_used = times_used + 1
    where code = upper(p_order ->> 'discount_code');
  end if;

  if cardinality(v_shortfalls) > 0 then
    insert into public.order_status_history (order_id, status, note)
    values (
      v_order_id,
      'paid',
      'Stock shortfall on ' || array_to_string(v_shortfalls, ', ') || '. Check the shelf before packing.'
    );
  end if;

  update public.stripe_events set order_id = v_order_id where id = p_event_id;
  return query select v_order_id, v_number, false;
end;
$$;

-- ---------------------------------------------------------------------------
-- Rate limiting (fixed window). Server-only.
-- ---------------------------------------------------------------------------
create function public.check_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits integer;
begin
  insert into public.rate_limits as rl (key, window_start, hits)
  values (p_key, v_window, 1)
  on conflict (key, window_start) do update set hits = rl.hits + 1
  returning rl.hits into v_hits;

  -- Opportunistic cleanup keeps the table tiny without a cron job.
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_hits <= p_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- Function privileges: Postgres grants EXECUTE to PUBLIC by default.
-- ---------------------------------------------------------------------------
revoke execute on function public.fulfil_checkout(text, text, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.fulfil_checkout(text, text, jsonb, jsonb) to service_role;

revoke execute on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;

revoke execute on function public.update_order_status(uuid, public.order_status, text, text, text) from public, anon;
grant execute on function public.update_order_status(uuid, public.order_status, text, text, text) to authenticated, service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_user_email_change() from public, anon, authenticated;
