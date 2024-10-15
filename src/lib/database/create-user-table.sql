-- Create a table for user profiles
create table
  public.users (
    user_id uuid not null,
    username character varying(100) null,
    email character varying(100) not null,
    first_name character varying(100) null,
    last_name character varying(100) null,
    country character varying null,
    currency character varying(3) not null,
    balance bigint not null,
    spending_limit bigint null,
    avatar_url text null,
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    constraint users_pkey primary key (user_id),
    constraint users_email_key unique (email),
    constraint users_username_key unique (username),
    constraint users_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint username_length check ((char_length((username)::text) >= 6))
  ) tablespace pg_default;

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table users
  enable row level security;

create policy "User profiles are viewable by everyone." on users
  for select using (true);

create policy "Users can create their own profile." on users
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update own profile." on users
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own profile" on users
  for delete using ((select auth.uid()) = user_id);
