# AI Stylist Landing

Landing page built with Next.js. It collects leads and quiz answers, writes server events to Supabase and Yandex Metrica and sends Telegram notifications.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env` and fill in values for Supabase, Yandex Metrica and Telegram.
3. Apply database schema to your Supabase project:
   ```bash
   pnpm supabase < scripts/supabase.sql
   ```

## Development

Run the dev server:
```bash
pnpm dev
```

Run linter and tests:
```bash
pnpm lint
pnpm test
```

## Deployment

The app is designed to run on [Vercel](https://vercel.com). Set the environment variables in the Vercel project settings. Push to main or open a Pull Request to trigger build and deploy.

## Environment variables

See `.env.example` for the full list:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `YANDEX_METRICA_ID`
- `NEXT_PUBLIC_YANDEX_METRICA_ID`

## Tests

Simple API tests use [Vitest](https://vitest.dev). They mock external services and check the basic happy paths.
