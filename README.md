# CVPoa — AI Resume Builder for East Africa

Build ATS-optimized CVs and cover letters in minutes. Pay via M-Pesa. Built for East Africa. 🇰🇪

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

### 2. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | dashboard.paystack.com |
| `PAYSTACK_SECRET_KEY` | Paystack dashboard |

### 3. Database

Run `supabase-schema.sql` in your Supabase SQL editor.

### 4. Run

```bash
npm run dev
```

---

## Features

| Feature | Status |
|---|---|
| Landing page | ✅ |
| Auth (email + Google OAuth) | ✅ |
| Route protection middleware | ✅ |
| 4-step resume builder | ✅ |
| AI resume generation (Claude) | ✅ |
| PDF export | ✅ |
| Word (.docx) export | ✅ |
| Cover letter generator | ✅ |
| Job description analyzer | ✅ |
| AI CV review & scoring | ✅ |
| Paystack payment integration | ✅ |
| Time-based access gating | ✅ |
| Dashboard with CV management | ✅ |
| Supabase database + RLS | ✅ |

## Pricing

| Plan | Price | Duration |
|---|---|---|
| Quick | KES 30 | 1 hour |
| Standard | KES 60 | 3 hours |
| Business | KES 150 | 24 hours |

---

Made in Nairobi 🇰🇪
