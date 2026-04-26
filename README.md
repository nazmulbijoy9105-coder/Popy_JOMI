# POPY — Bangladesh Property Intelligence Platform

> Full-stack AI-powered property intelligence, lead generation & legal verification for Bangladesh real estate.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nazmulbijoy9105-coder/Popy_JOMI)

---

## 🚀 Deploy to Vercel (Free — 10 min setup)

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "feat: full POPY platform with real backend"
git push origin main
```

### Step 2 — Setup Database (Free)
Go to [neon.tech](https://neon.tech) → Create project → Copy connection string

OR [render.com](https://render.com) → New PostgreSQL → Free tier

### Step 3 — Deploy to Vercel
1. [vercel.com](https://vercel.com) → Add New Project → Import `Popy_JOMI`
2. Add environment variables (see `.env.example`)
3. Click **Deploy**

### Step 4 — Setup Database Schema
After deploy, run in Vercel dashboard terminal:
```bash
npx prisma db push
npx prisma db seed
```

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local — add your DATABASE_URL and JWT_SECRET

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo accounts:**
- Agent: `demo@popy.bd` / `demo1234`
- Admin: `admin@popy.bd` / `admin1234`

---

## 🏗 Architecture

```
POPY Full-Stack Architecture
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────┐
│                   VERCEL (Free)                      │
│  ┌─────────────────────────────────────────────┐   │
│  │           Next.js 16 App Router              │   │
│  │  ┌──────────────┐  ┌─────────────────────┐  │   │
│  │  │   Frontend   │  │    API Routes        │  │   │
│  │  │  React + TS  │  │  /api/auth/*        │  │   │
│  │  │  Tailwind v4 │  │  /api/properties/*  │  │   │
│  │  │  7 Dashboards│  │  /api/leads/*       │  │   │
│  │  │  Landing page│  │  /api/analytics/*   │  │   │
│  │  │  Auth flow   │  │  /api/legal/check   │  │   │
│  │  └──────────────┘  │  /api/scraper/*     │  │   │
│  │                    │  /api/export/*      │  │   │
│  │                    └─────────────────────┘  │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│  PostgreSQL DB  │  │   Neon / Render  │
│  Prisma ORM     │  │   Free Tier      │
│  15 Tables      │  │   PostGIS ready  │
└─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│            BACKEND ENGINES              │
│  🕷️ Scraper: Axios + Cheerio            │
│  🤖 AI: OpenAI GPT-4o-mini extraction  │
│  ⚖️ Legal: Rule-based risk engine       │
│  📧 Email: Nodemailer (Gmail SMTP)      │
│  🔔 Alerts: DB + Email notifications   │
│  📊 Analytics: Real-time DB queries    │
│  ⏰ Cron: node-cron scheduler          │
└─────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
popy/
├── app/
│   ├── page.tsx                    # Main router: landing → auth → dashboard
│   ├── layout.tsx                  # Root layout + Google Fonts
│   ├── globals.css                 # Full design system (CSS variables)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # POST — login, returns JWT
│       │   ├── register/route.ts   # POST — register new user
│       │   └── me/route.ts         # GET — current user profile
│       ├── properties/
│       │   ├── route.ts            # GET (filter/sort/page) | POST
│       │   └── [id]/route.ts       # GET | PATCH single property
│       ├── leads/
│       │   └── route.ts            # GET (filter) | POST (AI scored)
│       ├── legal/
│       │   └── check/route.ts      # POST — run legal assessment
│       ├── alerts/
│       │   └── route.ts            # GET | PATCH (mark read)
│       ├── scraper/
│       │   ├── run/route.ts        # POST — trigger scrape job (admin)
│       │   └── status/route.ts     # GET — job status
│       ├── analytics/
│       │   ├── kpis/route.ts       # GET — dashboard KPIs
│       │   └── areas/route.ts      # GET — area stats
│       └── export/
│           └── sheets/route.ts     # POST — Google Sheets export
│
├── components/
│   ├── auth/
│   │   └── AuthPage.tsx            # Login + Register UI
│   ├── LandingPage.tsx             # Marketing page
│   ├── Sidebar.tsx                 # Navigation + user chip
│   ├── Topbar.tsx                  # Search + alerts + user menu
│   ├── Dashboard.tsx               # KPIs, ticker, trends, leads
│   ├── PropertiesPage.tsx          # Search + filter + detail modal
│   ├── LeadsPage.tsx               # Lead cards + pipeline
│   ├── AnalyticsPage.tsx           # Charts + Dhaka heatmap
│   ├── AlertsPage.tsx              # Alert center + rule config
│   ├── LegalPage.tsx               # Legal check UI + results
│   ├── ReportsPage.tsx             # Reports + Sheets export
│   ├── PropertyCard.tsx            # Reusable property card
│   └── MiniChart.tsx               # SVG sparkline chart
│
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── auth.ts                     # JWT + bcrypt + session utils
│   ├── middleware.ts               # Auth middleware for API routes
│   ├── scraper.ts                  # Bproperty + Lamudi scrapers
│   ├── ai.ts                       # OpenAI extraction + legal AI
│   ├── analytics.ts                # DB analytics queries
│   ├── notifications.ts            # Email + DB alert system
│   ├── api-client.ts               # Typed fetch client (frontend)
│   ├── hooks.ts                    # React hooks (useData, useAuth...)
│   └── data.ts                     # Mock/fallback data + types
│
├── prisma/
│   ├── schema.prisma               # Full DB schema (15 models)
│   └── seed.ts                     # Database seeder
│
├── scripts/
│   ├── run-scraper.ts              # Manual scraper runner
│   └── scheduler.ts               # Cron scheduler (6h auto-scrape)
│
├── db/
│   └── schema.sql                  # Raw SQL (alternative to Prisma)
│
├── vercel.json                     # Vercel deploy config
├── .env.example                    # Environment variable guide
└── README.md                       # This file
```

---

## 🗄️ Database Models (15 Tables)

| Model | Purpose |
|-------|---------|
| `users` | Auth, roles, plans |
| `sessions` | JWT session tracking |
| `properties` | Core property listings |
| `price_history` | Price change tracking |
| `leads` | AI-scored buyer/seller leads |
| `alert_rules` | Per-user notification config |
| `alerts` | Triggered notification log |
| `legal_checks` | Legal assessment results |
| `saved_properties` | User watchlist |
| `area_stats` | Aggregated area metrics |
| `scraper_jobs` | Scrape job log & status |
| `api_usage` | API key usage tracking |

---

## 🔌 API Reference

### Auth
```
POST /api/auth/register  { email, password, name, role, phone }
POST /api/auth/login     { email, password }
GET  /api/auth/me        → current user (requires Bearer token)
```

### Properties
```
GET  /api/properties?area=Gulshan&type=apartment&status=urgent&sort=score&page=1
GET  /api/properties/:id → with price history + legal checks
```

### Leads
```
GET  /api/leads?urgency=hot&type=seller
POST /api/leads  { name, phone, type, area, budget, notes }
```

### Legal Check
```
POST /api/legal/check  { propertyId?, location, price, area }
→ Returns: riskScore, riskLevel, checksPassed, warnings
```

### Analytics
```
GET /api/analytics/kpis    → dashboard KPIs
GET /api/analytics/areas   → area performance breakdown
```

### Export
```
POST /api/export/sheets  { sheetUrl? }
→ Returns all properties as JSON rows, optionally posts to Google Sheets webhook
```

---

## 💰 Pricing Tiers

| Plan | Monthly | Key Features |
|------|---------|-------------|
| Free | ৳0 | 20 listings/day, basic search |
| Agent | ৳3,000 | Unlimited listings, lead alerts, Sheets export |
| Investor | ৳8,000 | AI deal scoring, price trends, ROI tools |
| Developer | ৳20,000 | Market heatmaps, competitor tracking, API access |
| Lead Gen | Per lead | ৳500–৳5,000 per qualified lead |
| Legal Check | Per case | ৳3,000–৳25,000 |

---

## 🗺️ Roadmap

**Phase 1 (Current) — Foundation ✅**
- [x] Full Next.js frontend with 7 dashboards
- [x] PostgreSQL + Prisma ORM
- [x] JWT authentication system
- [x] Property API with filtering/sorting
- [x] Lead management + AI scoring
- [x] Legal risk assessment engine
- [x] Real scrapers (Bproperty + Lamudi)
- [x] Email notification system
- [x] Cron scheduler for auto-scraping
- [x] Google Sheets export

**Phase 2 — Scale**
- [ ] Facebook Group scraper (Playwright)
- [ ] Redis queue for scraper jobs
- [ ] Real-time WebSocket alerts
- [ ] Google Maps integration
- [ ] Mobile app (React Native)
- [ ] Payment gateway (SSLCommerz / bKash)

**Phase 3 — AI & Microservices**
- [ ] OpenAI GPT-4o property extraction
- [ ] Court dispute detection (AI)
- [ ] Price prediction model
- [ ] Investor ROI calculator
- [ ] Land registry API integration
- [ ] Separate microservices

---

## 🇧🇩 Built for Bangladesh

Made with ❤️ for the Bangladesh real estate market.

**Contact:** GitHub [@nazmulbijoy9105-coder](https://github.com/nazmulbijoy9105-coder)
# Popy_JOMI
