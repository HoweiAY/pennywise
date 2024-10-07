create function public.handle_new_user () returns trigger
set search_path = '' as $$
begin
  insert into public.users (user_id, username, email, currency, balance)
  values (
    new.id, 
    new.raw_app_meta_data ->> 'username', 
    new.email,
    'USD',
    0
  );
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user ();
