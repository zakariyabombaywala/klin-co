-- Row Level Security.
--   * Customers read and write only their own rows.
--   * The public reads published catalogue data and approved reviews.
--   * Admins write the catalogue and orders; the demo admin (is_staff) can read
--     everything an admin can but write nothing.
--   * Tables with no policy for a role are closed to it; the service role
--     (server code, webhook, seed) bypasses RLS.

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.discount_codes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.stripe_events enable row level security;
alter table public.reviews enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.stock_notifications enable row level security;
alter table public.rate_limits enable row level security;

-- ---------------------------------------------------------------------------
-- Profiles: read/update own; staff read all; admins update all.
-- Customers may only change their name and avatar (column privileges below),
-- so nobody can promote themselves to admin.
-- ---------------------------------------------------------------------------
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy "profiles: staff read all" on public.profiles
  for select to authenticated using ((select public.is_staff()));
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "profiles: admin update" on public.profiles
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Addresses: owner only; staff read for order support.
-- ---------------------------------------------------------------------------
create policy "addresses: owner all" on public.addresses
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "addresses: staff read" on public.addresses
  for select to authenticated using ((select public.is_staff()));

-- ---------------------------------------------------------------------------
-- Catalogue: public read of published data, admin write.
-- ---------------------------------------------------------------------------
create policy "categories: public read" on public.categories
  for select to anon, authenticated using (true);
create policy "categories: admin write" on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "collections: public read" on public.collections
  for select to anon, authenticated using (true);
create policy "collections: admin write" on public.collections
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "collection_products: public read" on public.collection_products
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
    or (select public.is_staff())
  );
create policy "collection_products: admin write" on public.collection_products
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "products: public read published" on public.products
  for select to anon, authenticated using (status = 'published');
create policy "products: staff read all" on public.products
  for select to authenticated using ((select public.is_staff()));
create policy "products: admin write" on public.products
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "product_images: public read" on public.product_images
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
    or (select public.is_staff())
  );
create policy "product_images: admin write" on public.product_images
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "product_variants: public read" on public.product_variants
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
    or (select public.is_staff())
  );
create policy "product_variants: admin write" on public.product_variants
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Carts and wishlists: owner only.
-- ---------------------------------------------------------------------------
create policy "carts: owner all" on public.carts
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "cart_items: owner all" on public.cart_items
  for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())));

create policy "wishlists: owner all" on public.wishlists
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "wishlists: staff read" on public.wishlists
  for select to authenticated using ((select public.is_staff()));

-- ---------------------------------------------------------------------------
-- Discount codes: validated through validate_discount_code(); staff read,
-- admin write. Not readable by the public, so codes can't be listed.
-- ---------------------------------------------------------------------------
create policy "discount_codes: staff read" on public.discount_codes
  for select to authenticated using ((select public.is_staff()));
create policy "discount_codes: admin write" on public.discount_codes
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Orders: customers read their own; staff read all; admins update.
-- Orders are only ever created by fulfil_checkout() (service role).
-- ---------------------------------------------------------------------------
create policy "orders: owner read" on public.orders
  for select to authenticated using (user_id = (select auth.uid()));
create policy "orders: staff read" on public.orders
  for select to authenticated using ((select public.is_staff()));
create policy "orders: admin update" on public.orders
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

revoke insert, delete on public.orders from anon, authenticated;

create policy "order_items: read with order" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
    or (select public.is_staff())
  );
revoke insert, update, delete on public.order_items from anon, authenticated;

create policy "order_status_history: read with order" on public.order_status_history
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
    or (select public.is_staff())
  );
create policy "order_status_history: admin insert" on public.order_status_history
  for insert to authenticated with check ((select public.is_admin()));

-- stripe_events and rate_limits: no policies, service role only.
revoke all on public.stripe_events from anon, authenticated;
revoke all on public.rate_limits from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Reviews: public reads approved; authors read and edit their own; only
-- customers who bought the product may write one; admins moderate.
-- ---------------------------------------------------------------------------
create policy "reviews: public read approved" on public.reviews
  for select to anon, authenticated using (status = 'approved');
create policy "reviews: author read own" on public.reviews
  for select to authenticated using (user_id = (select auth.uid()));
create policy "reviews: staff read all" on public.reviews
  for select to authenticated using ((select public.is_staff()));
create policy "reviews: buyers create" on public.reviews
  for insert to authenticated
  with check (user_id = (select auth.uid()) and public.has_purchased(product_id));
create policy "reviews: author update own" on public.reviews
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy "reviews: author delete own" on public.reviews
  for delete to authenticated using (user_id = (select auth.uid()));
create policy "reviews: admin moderate" on public.reviews
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Studio inbox: written by rate-limited server actions (service role);
-- staff read, admins update or delete.
-- ---------------------------------------------------------------------------
create policy "newsletter: staff read" on public.newsletter_subscribers
  for select to authenticated using ((select public.is_staff()));
create policy "newsletter: admin delete" on public.newsletter_subscribers
  for delete to authenticated using ((select public.is_admin()));

create policy "contact_messages: staff read" on public.contact_messages
  for select to authenticated using ((select public.is_staff()));
create policy "contact_messages: admin update" on public.contact_messages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "contact_messages: admin delete" on public.contact_messages
  for delete to authenticated using ((select public.is_admin()));

create policy "stock_notifications: staff read" on public.stock_notifications
  for select to authenticated using ((select public.is_staff()));
create policy "stock_notifications: admin write" on public.stock_notifications
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
