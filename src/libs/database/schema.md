### Supabase PostgreSQL database schema (tentative)

Users:
```bash
TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    currency VARCHAR(3) NOT NULL,
    balance INT NOT NULL,
    spending_limit INT,
    created_at TIMESTAMP NOT NULL,
)
```

Transactions:
```bash
TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    recipient_id INT REFERENCES users(user_id),
    merchant_name VARCHAR(255),
    currency VARCHAR(3) NOT NULL,
    exchange_rate DECIMAL(20,10),
    amount INT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
)
```