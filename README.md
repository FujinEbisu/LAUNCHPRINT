This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Copy `.env.example` to `.env.local` (preferred for Next.js) and fill in the values:

```
cp .env.example .env.local
```

Add your real secrets (do not commit them). New variables added for mailing via Lettermint:

- `LETTERMINT_API_KEY` (secret) – Your Lettermint API key
- `LETTERMINT_FROM_EMAIL` – Verified sender address you configured in DNS
- `LETTERMINT_FROM_NAME` – (Optional) Friendly from name (e.g. "LaunchPrint")
- `LETTERMINT_DEFAULT_LIST_ID` – (Optional) Default audience/list identifier

These are now available server-side via `process.env.LETTERMINT_API_KEY` etc. (Do not expose them to the client unless prefixed with `NEXT_PUBLIC_`).

## Mailing & Drip Sequence

Tables required (run manually in Neon):

```sql
CREATE TABLE IF NOT EXISTS email_events (
	id serial PRIMARY KEY,
	user_id text REFERENCES users(id) ON DELETE SET NULL,
	email text NOT NULL,
	template text NOT NULL,
	key text NOT NULL UNIQUE,
	meta jsonb,
	created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS drip_schedule (
	id serial PRIMARY KEY,
	user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	day_index integer NOT NULL,
	template text NOT NULL,
	scheduled_for timestamptz NOT NULL,
	sent_at timestamptz,
	created_at timestamptz DEFAULT now() NOT NULL
);
```

Admin endpoints (header: `x-admin-key: <ADMIN_INTERNAL_KEY>`):
1. POST `/api/mailing/send-test` → send generic test
2. POST `/api/mailing/bulk` body: `{ "audience":"all|free|starter|pro", "template":"genericTest" }`
3. POST `/api/cron/drip` → process due drip emails

Upgrade link pattern (auto-creates Stripe session):
`/api/mailing/upgrade-link?tier=starter|pro&priceId=PRICE_ID&email=user@example.com`

Stripe webhook-driven emails: success, failure, cancellation, plan changes.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
