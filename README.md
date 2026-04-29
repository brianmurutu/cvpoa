# CVPoa — AI Resume Builder for East Africa

Build ATS-optimized CVs and cover letters in minutes. Pay via M-Pesa. Built for East Africa.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Anthropic Claude API
- **Database + Auth**: Supabase
- **Payments**: Paystack (M-Pesa, Airtel Money, Card)
- **Hosting**: Vercel

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/brianmurutu/cvpoa.git
cd cvpoa
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the values:

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | [dashboard.paystack.com](https://dashboard.paystack.com) |
| `PAYSTACK_SECRET_KEY` | Paystack dashboard |

### 3. Set up the database

Copy the contents of `supabase-schema.sql` and run it in your Supabase SQL editor.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── payments/verify/   # Paystack payment verification
│   │   ├── resume/generate/   # AI resume generation
│   │   ├── cover-letter/      # AI cover letter generation
│   │   └── analyzer/          # Job description analyzer
│   ├── dashboard/             # User dashboard (coming soon)
│   ├── builder/               # Resume builder UI (coming soon)
│   └── login/                 # Auth page (coming soon)
├── components/
│   ├── layout/                # Navbar, Hero, Features, Pricing, Footer
│   ├── resume/                # Resume display components
│   └── forms/                 # Form components
└── lib/
    ├── ai.ts                  # Claude API functions
    ├── paystack.ts            # Paystack utilities
    └── supabase/              # Supabase clients
```

## Pricing Plans

| Plan | Price | Duration |
|---|---|---|
| Quick | KES 30 | 1 hour |
| Standard | KES 60 | 3 hours |
| Business | KES 150 | 24 hours |

## Roadmap

- [x] Landing page
- [x] Supabase schema
- [x] AI resume generation API
- [x] AI cover letter generation API
- [x] Job description analyzer API
- [x] Paystack payment integration
- [ ] Auth (login/signup pages)
- [ ] Resume builder UI (multi-step form)
- [ ] Dashboard
- [ ] PDF & Word export
- [ ] AI review feature

## Deploy

```bash
vercel deploy
```

Make sure to add all environment variables in your Vercel project settings.

---

Made in Nairobi 🇰🇪
