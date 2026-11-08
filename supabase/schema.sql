-- Happy Touch Interiors
-- Apply in the Supabase SQL editor, then create three public storage buckets:
-- product-images, models, brand-assets.
-- The application uses the service role on the server only.

create table if not exists categories (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null default '',
  sort_order integer not null default 0
);

create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  category_id text not null references categories (id),
  description text not null default '',
  price_ngn numeric,
  international_amount numeric,
  international_currency text,
  stock_status text,
  dimensions text not null default '',
  material text not null default '',
  colour text not null default '',
  featured boolean not null default false,
  homepage_featured boolean not null default false,
  showroom_room text,
  showroom_anchor text,
  model_path text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  src text not null,
  alt text not null,
  sort_order integer not null default 0
);

create table if not exists enquiries (
  id text primary key,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  payload jsonb not null
);

create table if not exists site_settings (
  id integer primary key default 1,
  whatsapp_number text not null default '',
  instagram_url text not null default 'https://www.instagram.com/happytouchinteriors/',
  chair_model_path text not null default '',
  chair_scale numeric not null default 1,
  chair_rotation_y numeric not null default 0,
  hero_product_id text not null default '',
  logo_path text not null default '',
  constraint site_settings_single_row check (id = 1)
);

insert into site_settings (id)
values (1)
on conflict (id) do nothing;

alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table enquiries enable row level security;
alter table site_settings enable row level security;
