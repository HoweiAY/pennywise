-- Create a table for user profiles
create table users (
  user_id uuid references auth.users on delete cascade not null primary key,
  username varchar(100) unique,
  email varchar(100) unique not null,
  first_name varchar(100),
  last_name varchar(100),
  currency varchar(3) not null,
  balance int not null,
  spending_limit int,
  avatar_url text,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(username) >= 6)
);
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
