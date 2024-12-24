### Supabase PostgreSQL database schema (tentative)

Users:
```bash
Table public.users (
    user_id uuid primary key not null,
    username character varying(100) null,
    email character varying(100) not null,
    first_name character varying(100) null,
    last_name character varying(100) null,
    currency character varying(3) not null,
    balance bigint not null,
    spending_limit bigint null,
    avatar_url text null,
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    country character varying null,

    constraint users_pkey primary key (user_id),
    constraint users_email_key unique (email),
    constraint users_username_key unique (username),
    constraint users_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint username_length check ((char_length((username)::text) >= 6))
)
```

Transactions:
```bash
Table public.transactions (
    transaction_id uuid not null default gen_random_uuid (),
    title text not null,
    transaction_type character varying not null,
    category_id smallint null,
    payer_currency character varying null,
    recipient_currency character varying null,
    exchange_rate double precision null,
    amount bigint not null,
    payer_id uuid null,
    recipient_id uuid null,
    budget_id uuid null,
    description text null,
    created_at timestamp with time zone not null default (now() at time zone 'utc'::text),
    updated_at timestamp with time zone null default (now() at time zone 'utc'::text),
    
    constraint transactions_pkey primary key (transaction_id),
    constraint transactions_payer_id_fkey foreign key (payer_id) references users (user_id) on delete set null,
    constraint transactions_recipient_id_fkey foreign key (recipient_id) references users (user_id) on delete set null,
    constraint transactions_budget_id_fkey foreign key (budget_id) references budgets (budget_id) on delete set null
)
```

Budgets:
```bash
Table public.budgets (
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
)
```

Friendships:
```bash
Table public.friendships (
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
)
```