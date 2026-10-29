# Motika Services Ultra Fast — Full-stack Next.js starter

A responsive Next.js App Router website for Motika's university, document and school-errand services, extended with persistent bookings, Flutterwave checkout initialization/verification, webhook processing, and a protected admin dashboard.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS + Framer Motion + Lucide
- Neon PostgreSQL + Prisma ORM
- Flutterwave hosted checkout (server-side secret)
- Gmail SMTP contact form (server-side app password)
- Zod validation + signed, HTTP-only admin session cookie

## Run locally on Windows

Requirements: Node.js 20.9+ and Docker Desktop with Docker Compose.

1. Copy `.env.example` to `.env`. Its database URL is configured for the local Docker database.
2. Start PostgreSQL and install the project dependencies:

   ```powershell
   docker compose up -d
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run db:seed
   npm run dev
   ```

3. Open `http://localhost:3000`. To stop the local database, run `docker compose down`. The named volume preserves its data.

## Set up admin credentials

The admin email defaults to `admin@example.com`. There is no default admin password: choose one locally and generate its bcrypt hash from PowerShell after installing dependencies:

```powershell
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1], 12).then(console.log)" "Choose-a-long-unique-password"
```

Put the output in `ADMIN_PASSWORD_HASH` in `.env`, and set a cryptographically random `ADMIN_SESSION_SECRET` of at least 32 characters. Do not commit `.env`.

Visit `/admin/login`.

The Docker PostgreSQL username, password and database in `docker-compose.yml` are for local development only. The container listens on port `5433` on your computer to avoid clashing with a local PostgreSQL install. Do not reuse these credentials in production.

## Configure the contact form

The homepage contact form sends messages to `CONTACT_EMAIL` and does not create a booking. For Gmail delivery, enable 2-Step Verification on the sending Google account and create an App Password in your Google Account security settings. Set `GMAIL_USER` to the sending Gmail address, `GMAIL_APP_PASSWORD` to that App Password, and `CONTACT_EMAIL` to the inbox that should receive messages. Keep the App Password private and only in `.env` or your hosting provider's secret settings. The contact section also includes a direct email link.

## Set real service prices before enabling payments

Seeded services have `priceXaf: 0` deliberately because the supplied advertisement did not list prices. The checkout API refuses to initialize payment when the service price is zero. Set each actual price in the `Service` table only after the client confirms pricing. Never take a price from the browser as authoritative.

## Flutterwave configuration

1. Obtain a Flutterwave secret key from the merchant dashboard and set `FLW_SECRET_KEY` on the server. These credentials are not required to run the local database or access the admin dashboard.
2. Set `APP_URL` to the exact HTTPS production URL.
3. Add a webhook in Flutterwave Dashboard > Settings > Webhooks:
   `https://YOUR-DOMAIN/api/payments/webhook`
4. Set a strong random webhook secret hash in the dashboard and the same value in `FLW_SECRET_HASH`.
5. Test in Flutterwave test mode before production.

The app creates a hosted payment checkout using the v3 `/payments` endpoint and verifies the transaction on the server against transaction reference, successful status, currency and expected amount. The webhook validates the `verif-hash` header and re-queries Flutterwave before marking a booking paid. The redirect page is not trusted as proof of payment.

## API endpoints

- `POST /api/bookings` — create a booking; price is taken from the database.
- `POST /api/payments/initialize` — initialize hosted checkout for a booking reference.
- `POST /api/payments/verify` — server-side transaction verification.
- `POST /api/payments/webhook` — Flutterwave webhook.
- `POST /api/contact` — send a message to the configured contact inbox.
- `POST /api/admin/login` and `POST /api/admin/logout` — admin session.
- `GET /api/admin/bookings` — protected booking list.
- `PATCH /api/admin/bookings/:id` — protected status/notes update.

## Important production checklist

This is an implementation starter and must be tested with your actual Flutterwave merchant account before accepting real money. Add request rate limiting (at the hosting edge or with a shared store), CAPTCHA/honeypot and abuse monitoring, transactional email/SMS, automated tests, database backups, a privacy policy and terms, and appropriate data retention controls. Configure security headers and monitor webhook failures.

For live systems, ensure webhook event handling is idempotent and that transient verification failures can be retried. Do not treat a customer redirect as a payment receipt. Confirm that Flutterwave has enabled the required XAF/mobile-money payment methods for the merchant account. Do not collect national ID/passport scans in this basic form; if documents must be uploaded later, use private object storage with restricted access and a retention policy.

The booking UI in the original landing page still needs to be wired to `POST /api/bookings` and `/api/payments/initialize`; the API is provided here, but the existing modal remains a frontend demo until that form integration is completed.
"# motika_services" 
