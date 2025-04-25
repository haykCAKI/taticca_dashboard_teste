-- supabase/migrations/20250424120000_create_dashboard_tables.sql

-- Metrics (key/value)
CREATE TABLE dashboard_metrics (
  metric_key text PRIMARY KEY,
  metric_value integer NOT NULL
);

-- Sidebar nav items
CREATE TABLE nav_items (
  id serial PRIMARY KEY,
  label text NOT NULL,
  icon_name text NOT NULL
);

-- Account menu items
CREATE TABLE account_items (
  id serial PRIMARY KEY,
  label text NOT NULL,
  class_name text
);

-- Stats cards (you can read `count` from dashboard_metrics instead if you prefer)
CREATE TABLE stats (
  id serial PRIMARY KEY,
  label text NOT NULL,
  count integer NOT NULL,
  delta text NOT NULL,
  icon_name text NOT NULL,
  bg text NOT NULL
);

-- Recent files
CREATE TABLE recent_files (
  id serial PRIMARY KEY,
  name text NOT NULL,
  topic text NOT NULL,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('Accepted','Pending','Denied'))
);

-- Recent activity feed
CREATE TABLE activities (
  id serial PRIMARY KEY,
  text text NOT NULL,
  when_text text NOT NULL,
  icon_name text NOT NULL
);

-- Upcoming deadlines
CREATE TABLE deadlines (
  id serial PRIMARY KEY,
  label text NOT NULL,
  info text NOT NULL,
  delta text NOT NULL
);

CREATE TABLE categories (
  id     serial      PRIMARY KEY,
  title  text        NOT NULL
);

-- Subcategorias vinculadas a uma categoria
CREATE TABLE subcategories (
  id           serial      PRIMARY KEY,
  category_id  integer     NOT NULL
    REFERENCES categories(id)
    ON DELETE CASCADE,
  title        text        NOT NULL
);

-- Itens de arquivos: cada upload fica registrado aqui
CREATE TABLE file_items (
  id             serial      PRIMARY KEY,
  subcategory_id integer     NOT NULL
    REFERENCES subcategories(id)
    ON DELETE CASCADE,
  name           text        NOT NULL,
  url            text        NOT NULL,
  uploaded_at    timestamp   NOT NULL DEFAULT now()
);