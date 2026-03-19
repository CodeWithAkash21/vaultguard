# VaultGuard 🛡️
### AI-Powered OAuth Permission Auditor

Built for the **Auth0 "Authorized to Act" Hackathon**.

VaultGuard audits your connected OAuth apps, rates permission risks with AI, and lets you revoke dangerous access — protected by Auth0 Token Vault and step-up authentication.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.local` and fill in your keys:

```bash
# Generate a secure secret:
openssl rand -base64 32
```

Fill in `.env.local`:
```
AUTH0_SECRET='your-generated-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://vaultguard-dev.us.auth0.com'
AUTH0_CLIENT_ID='q3RQ3qTKmhlrlo9iY0M8Qt7xwnrtYLrr'
AUTH0_CLIENT_SECRET='your-client-secret-from-auth0-dashboard'
ANTHROPIC_API_KEY='sk-ant-your-key-from-console.anthropic.com'
```

### 3. Auth0 Dashboard Setup
In your Auth0 dashboard (vaultguard-dev.us.auth0.com):

- **Application Type:** Regular Web Application
- **Allowed Callback URLs:** `http://localhost:3000/api/auth/callback`
- **Allowed Logout URLs:** `http://localhost:3000`
- **Allowed Web Origins:** `http://localhost:3000`

Enable Google Social Connection:
- Authentication → Social → Google / Gmail
- Toggle "Use Auth0 dev keys" ON (for development)

### 4. Get your Anthropic API key
- Go to [console.anthropic.com](https://console.anthropic.com)
- Create an API key
- Paste it into `ANTHROPIC_API_KEY` in `.env.local`

### 5. Run the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How it works

1. **Login** with Google via Auth0 Universal Login
2. **Scan** — Auth0 Token Vault fetches your connected apps securely
3. **AI Analysis** — Claude rates each app Low / Medium / High risk with plain-English explanations
4. **Revoke** — Step-up authentication (CIBA pattern) protects every revocation action

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Auth:** Auth0 (`@auth0/nextjs-auth0`) + Token Vault + CIBA
- **AI:** Anthropic Claude (claude-sonnet-4)
- **Hosting:** Vercel

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add all environment variables in the Vercel dashboard, updating `AUTH0_BASE_URL` to your Vercel URL.
