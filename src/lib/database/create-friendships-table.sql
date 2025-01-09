create table
  public.friendships (
    inviter_id uuid not null default gen_random_uuid (),
    invitee_id uuid not null default gen_random_uuid (),
    blocked_id uuid null default gen_random_uuid (),
    status character varying not null default 'pending'::character varying,
    created_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    constraint friendships_pkey primary key (inviter_id, invitee_id),
    constraint friendships_blocked_id_fkey foreign key (blocked_id) references users (user_id) on delete cascade,
    constraint friendships_invitee_id_fkey foreign key (invitee_id) references users (user_id) on delete cascade,
    constraint friendships_inviter_id_fkey foreign key (inviter_id) references users (user_id) on delete cascade
  ) tablespace pg_default;