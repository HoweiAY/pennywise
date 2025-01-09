create table
  public.notifications (
    notification_id uuid not null default gen_random_uuid (),
    type character varying not null,
    title text not null,
    description text not null,
    status character varying not null default 'unread'::character varying,
    from_user_id uuid null default gen_random_uuid (),
    target_user_id uuid not null default gen_random_uuid (),
    friendship_invitee_id uuid null default gen_random_uuid (),
    friendship_inviter_id uuid null default gen_random_uuid (),
    transaction_id uuid null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    constraint notifications_pkey primary key (notification_id),
    constraint notifications_friendship_invitee_id_friendship_inviter_id_fkey foreign key (friendship_invitee_id, friendship_inviter_id) references friendships (invitee_id, inviter_id) on delete set null,
    constraint notifications_from_user_id_fkey foreign key (from_user_id) references users (user_id) on delete set null,
    constraint notifications_target_user_id_fkey foreign key (target_user_id) references users (user_id) on delete cascade,
    constraint notifications_transaction_id_fkey foreign key (transaction_id) references transactions (transaction_id) on delete set null
  ) tablespace pg_default;