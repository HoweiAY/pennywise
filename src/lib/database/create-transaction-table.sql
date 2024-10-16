-- Create a table for transactions
create table
    public.transactions (
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
    ) tablespace pg_default;