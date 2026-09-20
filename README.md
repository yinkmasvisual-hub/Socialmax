# SMM Panel

A full SMM (social media marketing) reseller site: user accounts, wallet
balance, manual deposit approval, order placement, and order history — all
wired up to your SMM provider's API (starting with Sociout, built so you can
add more providers later).

No database server to install — data is stored in a local JSON file
(`data/db.json`), which is enough for a single-server deployment. Everything
runs on Node.js.

## 1. Install

```bash
npm install
```

## 2. Configure

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

- `PROVIDER_API_URL` / `PROVIDER_API_KEY` — your Sociout API key (already
  filled in with the key you gave me — **rotate it** in your Sociout
  dashboard once you're set up here, since it was shared in chat)
- `JWT_SECRET` — any long random string (`openssl rand -hex 32`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account created automatically
  the first time the app runs
- `SITE_NAME`, `CURRENCY_SYMBOL`, `NEXT_PUBLIC_CURRENCY_SYMBOL` — branding
- `DEFAULT_MARKUP` — multiplier applied to the provider's cost when you sync
  services (e.g. `1.4` = 40% markup). You can also edit each service's price
  individually in Admin afterward.

## 3. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`, then log in with your `ADMIN_EMAIL` /
`ADMIN_PASSWORD` from `.env`.

## 4. First-time setup in the app

1. Log in as admin → **Admin → Services**
2. Click **Sync services from provider** — this pulls Sociout's full
   service list into your catalog. New services are added **inactive** by
   default with price = provider cost × `DEFAULT_MARKUP`.
3. Review pricing for the services you want to sell, edit prices inline,
   and toggle them **Active**. Only active services show up for customers.
4. Done — customers can now register, request a deposit, and place orders.

## How wallets work

There's no payment gateway wired up (you chose manual/offline deposits).
Flow:

1. Customer submits a deposit request (amount + a note like a bank
   transfer reference) from **Add Funds**.
2. You see it under **Admin → Deposits** and confirm the money actually
   arrived through your own payment channel.
3. Click **Approve** — their wallet balance is credited immediately.
   **Reject** if the payment didn't come through.

## Adding more providers later

You mentioned wanting up to 5 providers. The code is already structured
for this — each service in your catalog is tagged with which provider it
belongs to, so orders and status checks are routed automatically. To add
provider #2:

1. Add its base URL + key to `.env`:
   ```
   PROVIDER2_API_URL=https://provider2.example.com/api/v2
   PROVIDER2_API_KEY=xxxxxxxx
   ```
2. Open `lib/providers.js` and uncomment/add an entry:
   ```js
   provider2: {
     label: "Provider 2 Name",
     apiUrl: process.env.PROVIDER2_API_URL,
     apiKey: process.env.PROVIDER2_API_KEY,
   },
   ```
3. Redeploy. It'll now show up in the provider dropdown on
   **Admin → Services**, ready to sync.

This assumes provider #2-5 use the same standard SMM panel API format
(`key` + `action` params) that Sociout uses — true for the large majority
of panels. If one of them is different, tell me its docs and I'll adjust
`lib/provider-client.js` to support it.

## Deploying

This is a standard Next.js app, so any Node hosting works:

- **Railway / Render / a VPS**: these keep a persistent filesystem, so
  `data/db.json` survives restarts — the simplest option given the
  file-based storage here.
- **Vercel**: works, but its filesystem is *not* persistent between
  deploys/instances — `data/db.json` would reset. If you want Vercel,
  tell me and I'll swap the storage layer for a hosted database (e.g.
  Postgres via Vercel Postgres or Supabase) instead of the JSON file.

Whichever host you pick, set all the `.env` variables in its dashboard
(never commit `.env` — it's already git-ignored).

## Security notes

- Your provider API key only ever lives in server-side `.env` — it's never
  sent to the browser.
- Passwords are hashed with bcrypt; sessions are signed JWTs in an
  httpOnly cookie.
- **Rotate the Sociout API key** you shared earlier from your Sociout
  dashboard, then put the new one in `.env`, since the old one was pasted
  in a chat.

## Project structure

```
app/
  api/            backend routes (auth, orders, deposits, admin)
  dashboard/      logged-in customer pages
  admin/          admin-only pages
lib/
  db.js           JSON-file storage helpers
  auth.js         password hashing + session cookies
  providers.js    provider registry (add more panels here)
  provider-client.js   calls to the SMM provider API
data/
  db.json         all app data (created automatically on first run)
```
