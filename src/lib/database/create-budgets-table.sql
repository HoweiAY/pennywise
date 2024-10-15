-- Create a table for budget plans
create table
  public.budgets (
    budget_id uuid not null default gen_random_uuid (),
    name text not null,
    category_id smallint not null,
    currency character varying not null,
    amount bigint not null,
    user_id uuid not null default gen_random_uuid (),
    description text null,
    created_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    constraint budgets_pkey primary key (budget_id),
    constraint budgets_user_id_fkey foreign key (user_id) references users (user_id) on delete cascade
  ) tablespace pg_default;