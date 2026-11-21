-- Kiln & Co. schema: catalogue, customers, carts, orders, reviews and studio inbox.
-- Money is stored as integer cents. Timestamps are timestamptz (UTC).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'admin', 'demo_admin');
create type public.product_status as enum ('draft', 'published', 'archived');
create type public.order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.review_status as enum ('pending', 'approved', 'hidden');
create type public.discount_type as enum ('percentage', 'fixed', 'free_shipping');
create type public.shipping_method as enum ('standard', 'express');
create type public.message_status as enum ('new', 'read', 'archived');

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at current
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text check (char_length(full_name) <= 120),
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_role_idx on public.profiles (role) where role <> 'customer';
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  line1 text not null check (char_length(line1) between 1 and 200),
  line2 text check (char_length(line2) <= 200),
  city text not null check (char_length(city) between 1 and 100),
  region text check (char_length(region) <= 100),
  postal_code text not null check (char_length(postal_code) between 1 and 20),
  country char(2) not null default 'US' check (country ~ '^[A-Z]{2}$'),
  phone text check (char_length(phone) <= 30),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index addresses_user_idx on public.addresses (user_id);
-- At most one default address per customer.
create unique index addresses_one_default_idx on public.addresses (user_id) where is_default;
create trigger addresses_updated_at before update on public.addresses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  description text,
  image_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  tagline text,
  description text,
  image_url text,
  image_alt text,
  position integer not null default 0,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger collections_updated_at before update on public.collections
  for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  subtitle text check (char_length(subtitle) <= 160),
  description text not null default '',
  materials text not null default '',
  care text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  -- Starting price; each variant carries its own price.
  base_price integer not null check (base_price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price > 0),
  status public.product_status not null default 'draft',
  is_featured boolean not null default false,
  seo_title text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Weighted full-text search: title > subtitle > description/materials.
  search tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(subtitle, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(materials, '')), 'D')
  ) stored
);
create index products_status_idx on public.products (status, created_at desc);
create index products_category_idx on public.products (category_id);
create index products_search_idx on public.products using gin (search);
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  -- Path inside the product-images bucket, so files can be deleted with the row.
  storage_path text,
  alt text not null default '',
  position integer not null default 0,
  width integer check (width > 0),
  height integer check (height > 0),
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images (product_id, position);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  sku text not null unique check (char_length(sku) between 1 and 64),
  title text not null,
  -- e.g. {"glaze": "Speckled oat", "size": "12 oz"}
  options jsonb not null default '{}'::jsonb check (jsonb_typeof(options) = 'object'),
  price integer not null check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price > price),
  stock integer not null default 0 check (stock >= 0),
  image_id uuid references public.product_images (id) on delete set null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants (product_id, position);
create index product_variants_options_idx on public.product_variants using gin (options);
create trigger product_variants_updated_at before update on public.product_variants
  for each row execute function public.set_updated_at();

create table public.collection_products (
  collection_id uuid not null references public.collections (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  position integer not null default 0,
  primary key (collection_id, product_id)
);
create index collection_products_product_idx on public.collection_products (product_id);

-- ---------------------------------------------------------------------------
-- Carts and wishlists (signed-in customers; guests keep theirs in localStorage)
-- ---------------------------------------------------------------------------
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  discount_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger carts_updated_at before update on public.carts
  for each row execute function public.set_updated_at();

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity integer not null check (quantity between 1 and 99),
  saved_for_later boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);
create trigger cart_items_updated_at before update on public.cart_items
  for each row execute function public.set_updated_at();

create table public.wishlists (
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- Discounts
-- ---------------------------------------------------------------------------
create table public.discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code) and code ~ '^[A-Z0-9_-]{3,32}$'),
  description text,
  type public.discount_type not null,
  -- Percent (1-100) for percentage codes, cents for fixed codes, ignored for free shipping.
  value integer not null default 0 check (value >= 0),
  min_order_cents integer not null default 0 check (min_order_cents >= 0),
  starts_at timestamptz,
  expires_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  times_used integer not null default 0 check (times_used >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (type <> 'percentage' or value between 1 and 100),
  check (expires_at is null or starts_at is null or expires_at > starts_at)
);
create trigger discount_codes_updated_at before update on public.discount_codes
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create sequence public.order_number_seq start with 10001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('KC-' || nextval('public.order_number_seq')::text),
  user_id uuid references public.profiles (id) on delete set null,
  email text not null,
  status public.order_status not null default 'pending',
  subtotal integer not null check (subtotal >= 0),
  discount_total integer not null default 0 check (discount_total >= 0),
  shipping_total integer not null default 0 check (shipping_total >= 0),
  tax_total integer not null default 0 check (tax_total >= 0),
  total integer not null check (total >= 0),
  currency char(3) not null default 'usd',
  discount_code text,
  shipping_method public.shipping_method not null default 'standard',
  -- Snapshot: {name, line1, line2, city, region, postal_code, country, phone}
  shipping_address jsonb,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  tracking_number text,
  tracking_carrier text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_idx on public.orders (user_id, created_at desc);
create index orders_status_idx on public.orders (status, created_at desc);
create index orders_created_idx on public.orders (created_at desc);
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  variant_id uuid references public.product_variants (id) on delete set null,
  -- Snapshot of what was bought, so later catalogue edits don't rewrite history.
  product_title text not null,
  product_slug text,
  variant_title text,
  sku text,
  image_url text,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0)
);
create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  note text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index order_status_history_order_idx on public.order_status_history (order_id, created_at);

-- Stripe webhook idempotency: one row per processed event.
create table public.stripe_events (
  id text primary key,
  type text not null,
  order_id uuid references public.orders (id) on delete set null,
  processed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  author_name text not null check (char_length(author_name) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 1 and 120),
  body text not null check (char_length(body) between 1 and 2000),
  verified boolean not null default false,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_product_idx on public.reviews (product_id, status, created_at desc);
create unique index reviews_one_per_customer_idx on public.reviews (product_id, user_id) where user_id is not null;
create trigger reviews_updated_at before update on public.reviews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Studio inbox: newsletter, contact form, back-in-stock requests
-- ---------------------------------------------------------------------------
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source text not null default 'footer',
  created_at timestamptz not null default now()
);
create unique index newsletter_email_idx on public.newsletter_subscribers (lower(email));

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject text not null check (char_length(subject) between 1 and 160),
  message text not null check (char_length(message) between 1 and 5000),
  status public.message_status not null default 'new',
  created_at timestamptz not null default now()
);
create index contact_messages_status_idx on public.contact_messages (status, created_at desc);

create table public.stock_notifications (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  notified_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index stock_notifications_unique_idx on public.stock_notifications (variant_id, lower(email));

-- Fixed-window rate limiting for public endpoints (auth, contact, newsletter).
create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (key, window_start)
);
