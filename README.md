# PennyWise

A personal finance web application for managing transactions, creating budgets and paying friends, built with Next.js and Supabase.

![Screenshot of the PennyWise Dashboard page](https://pmufsutbwgyfbtdnjvdq.supabase.co/storage/v1/object/public/docs/screenshots/dashboard.png)

## Technologies

### Frontend
- TypeScript
- Next.js
- Tailwind CSS
- shadcn/ui
- React Query

### Backend
- Supabase (PostgreSQL + Auth)
- Vercel

## Run Locally

This project uses pnpm for managing packages and dependencies:

```bash
npm install -g pnpm
```

Start the development server:
```bash
# Install dependencies
pnpm install
# Run the development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the webpage locally.

## Features

- Create, edit and remove transaction records to track deposits and expenses
- Add and manage monthly budgets to keep track of expenditures in different categories
- Comprehensive overview of transaction history and analysis with dynamic charts
- Add friends and create payment transfers between friends with automatic exchange rate conversion
