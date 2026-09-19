# Adzavi Republic — Clothing Store

A full-stack clothing e-commerce site: React frontend, Node/Express + MongoDB
backend, and **Paystack** payments (supports cards and Ghana Mobile Money —
MTN, Vodafone, AirtelTigo). Social links (WhatsApp, Instagram, Facebook) are
wired into the footer, a floating WhatsApp button, and the Contact page.

## Project structure

```
clothing-store/
  backend/     Express API, MongoDB models, Paystack integration
  frontend/    React app (Vite)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either installed locally, or a free cluster from
  MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- A Paystack account (https://paystack.com) — sign up, then switch to
  **Test mode** to get test API keys while developing

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` — from your Paystack dashboard
  (Settings → API Keys & Webhooks). Use the `sk_test_...` / `pk_test_...` keys
  first.

Load sample products and an admin account:

```bash
node seed.js
```

This creates an admin login: `admin@adzavirepublic.com` / `admin123` —
**change that password** once you log in for real.

Start the backend:

```bash
npm run dev
```

The API runs on `http://localhost:5000`.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
- `VITE_WHATSAPP_NUMBER` — your shop's WhatsApp number, digits only, with
  country code (e.g. `233241234567` for a Ghana number, no `+` or leading 0)
- `VITE_INSTAGRAM_URL` / `VITE_FACEBOOK_URL` — your real social page links

Start the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173`.

## 4. Testing a payment

1. Add an item to the cart and go to checkout.
2. Fill in shipping details and click **Pay**.
3. You'll be redirected to Paystack's checkout. In test mode, use one of
   Paystack's test cards or test Mobile Money numbers, listed here:
   https://paystack.com/docs/payments/test-payments
4. After payment, you're redirected back to the order confirmation page,
   which verifies the transaction and marks the order as paid.

## 5. Going live

- Switch your Paystack dashboard to **Live mode** and swap in the live
  `sk_live_...` / `pk_live_...` keys in the backend `.env`
- In the Paystack dashboard, register your webhook URL under
  Settings → API Keys & Webhooks:
  `https://yourdomain.com/api/payments/webhook`
  (the webhook is your source of truth for payment confirmation — it works
  even if a customer closes the tab before being redirected back)
- Deploy the backend (Render, Railway, or a VPS) and set `MONGO_URI` to a
  production database
- Deploy the frontend to Vercel or Netlify, and set `VITE_API_URL` to your
  deployed backend's URL
- Get a real SSL-secured domain — required for any payment flow
- Add your Privacy Policy and Terms of Service pages before accepting real
  payments

## 6. Managing products

There's no admin UI built yet — for now, manage products directly via the
API (all product write routes require an admin JWT):

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Shirt","description":"...","price":99,"category":"Men","images":["https://..."],"sizes":["M","L"],"colors":["Black"],"stock":10}'
```

Get an admin token by logging in as the seeded admin via
`POST /api/auth/login`. Building a proper admin dashboard page is the
natural next step once the storefront itself is running well.
