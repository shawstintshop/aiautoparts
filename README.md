# ⚙️ AutoGenius

### AI-Powered Auto Intelligence Platform

**Built by [1522 Inc](https://github.com/1522inc)**

-----

> *The only automotive app a US driver will ever need — from diagnosis to doorstep delivery.*

AutoGenius is a full-stack AI platform that identifies your exact vehicle, finds the right part at the lowest price, connects you with top-rated local mechanics, and walks you through every repair from start to finish. One app. Every car. End to end.

-----

## What It Does

**AutoGenius eliminates every friction point between a car problem and a solution:**

- 🔍 **AI Parts Search** — Finds the exact part for your year/make/model/trim/engine with verified fitment confidence scores and live price comparison across RockAuto, Amazon, AutoZone, NAPA, and O’Reilly
- 🚗 **Vehicle DNA ID** — Identifies your exact vehicle 3 ways: Bluetooth OBD scanner, VIN decode, or a smart guided funnel that narrows engine, trim, and drivetrain so there’s no guessing
- ⚠️ **Common Problems Database** — AI-researched issues, symptoms, fixes, and upgrade paths for the top 500 most popular US vehicles
- 🔬 **OBD Diagnostics** — Enter a fault code or describe a symptom and get an instant AI diagnosis with repair cost range, parts list, and a step-by-step fix guide
- ▶️ **How-To Library** — 125,000+ vehicle-specific repair guides with AI-generated steps, torque specs, curated videos, tools needed, and “since you’re already there” companion jobs
- 🔧 **Mechanic Directory** — AI-ranked, verified local mechanics with specialty matching, real-time availability, and tool rental for Pro members
- ⚡ **Parts Delivery** — 1-hour local delivery, overnight priority, free 2-day, or same-day store pickup — choose at checkout

-----

## The Hardware

**AutoGenius Pro members receive a free Bluetooth OBD-II scanner** — plug it into your car’s diagnostic port (under the dash, 1996+ vehicles), open the app, and in 8 seconds you get:

- Exact vehicle identification (VIN decoded, year/make/model/trim/engine confirmed)
- Live vehicle health report (engine, transmission, brakes, battery, emissions)
- All active and pending fault codes in plain English
- Mileage and sensor telemetry

No scanner? No problem — VIN decode and guided manual ID cover every case.

-----

## Tech Stack

|Layer       |Technology                                                    |
|------------|--------------------------------------------------------------|
|Frontend    |Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS|
|Animations  |Framer Motion                                                 |
|Components  |shadcn/ui                                                     |
|Backend     |Firebase (Auth · Firestore · Storage · Functions)             |
|AI Engine   |Anthropic Claude API (`claude-sonnet-4-20250514`)             |
|OBD Hardware|Web Bluetooth API · ELM327 BLE protocol                       |
|Billing     |Stripe (subscriptions · webhooks)                             |
|Email       |SendGrid                                                      |
|Delivery    |DoorDash Drive · EasyPost · Shipbob                           |
|Maps        |Google Maps Platform · Google Places API                      |
|Parts Data  |RockAuto · AutoZone · Amazon PA API · NAPA                    |
|Vehicle Data|NHTSA vPIC API · NHTSA Recalls API · CarMD                    |

-----

## Project Structure

```
autogenius/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth routes
│   ├── (dashboard)/            # Authenticated app shell
│   │   ├── home/               # Vehicle-aware home screen
│   │   ├── search/             # Parts search + results
│   │   ├── diagnose/           # OBD code + symptom diagnosis
│   │   ├── guides/             # How-to repair library
│   │   ├── mechanics/          # Mechanic directory + booking
│   │   └── profile/            # Vehicle profiles + order history
│   └── api/                    # Next.js API routes
│       ├── ai/                 # Claude AI endpoints
│       ├── parts/              # Parts search + fitment
│       ├── delivery/           # Order + fulfillment
│       ├── obd/                # OBD scan processing
│       └── webhooks/           # Stripe + delivery webhooks
├── components/
│   ├── vehicle/                # Vehicle ID flow (OBD, VIN, manual)
│   ├── parts/                  # Search results, part cards, delivery modal
│   ├── mechanics/              # Mechanic cards, booking calendar
│   ├── guides/                 # Step viewer, video embeds, tool list
│   ├── diagnostics/            # Code lookup, symptom input, AI results
│   └── ui/                     # Shared design system components
├── lib/
│   ├── firebase/               # Firebase admin + client config
│   ├── anthropic/              # Claude API helpers + prompt templates
│   ├── obd/                    # Web Bluetooth + ELM327 protocol
│   ├── stripe/                 # Billing helpers
│   └── apis/                   # Parts, delivery, maps integrations
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript interfaces
├── data/                       # Static vehicle seed data
└── scripts/
    └── seed-vehicles.ts        # Seeds top 500 vehicles via Claude API
```

-----

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project (Blaze plan for Cloud Functions)
- Anthropic API key
- Stripe account

### Installation

```bash
git clone https://github.com/1522inc/autogenius.git
cd autogenius
npm install
```

### Environment Setup

Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

# Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
YOUTUBE_DATA_API_KEY=

# Email / Delivery / Parts
SENDGRID_API_KEY=
DOORDASH_DRIVE_API_KEY=
EASYPOST_API_KEY=
SHIPBOB_API_KEY=
AMAZON_PA_ACCESS_KEY=
AMAZON_PA_SECRET_KEY=
AMAZON_PA_ASSOCIATE_TAG=
```

### Development

```bash
npm run dev
```

### Seed Vehicle Database

Seeds the top 500 US vehicles with AI-generated common problems, upgrades, and service data:

```bash
npm run seed:vehicles
```

### Deploy

```bash
npm run build
firebase deploy
```

-----

## Membership — AutoGenius Pro

**$9.99 / month · 30-day free trial · Cancel anytime**

|Feature                              |Free   |Pro          |
|-------------------------------------|-------|-------------|
|Vehicle identification (VIN + manual)|✓      |✓            |
|Parts search + fitment verification  |✓      |✓            |
|OBD Bluetooth scanner                |—      |✓ Free device|
|Vehicle health monitoring            |—      |✓            |
|1-Hour local delivery                |—      |✓            |
|Priority mechanic booking            |—      |✓            |
|Free tool rentals at partner centers |—      |✓            |
|Full how-to library                  |Limited|✓ Unlimited  |
|AI diagnostic hotline                |—      |✓            |
|Price drop alerts                    |—      |✓            |

-----

## AI Architecture

All AI features route through Anthropic’s Claude API server-side (never client-side). Key AI functions:

|Function                                      |Prompt Strategy                                                          |
|----------------------------------------------|-------------------------------------------------------------------------|
|Parts fitment verification                    |Vehicle spec + part spec → `{ fits, confidence, notes }`                 |
|Common problems generation                    |Year/make/model → structured issues + fixes JSON                         |
|Symptom-to-code diagnosis                     |Symptom + vehicle → `{ probableCodes, rootCauses, steps, urgency }`      |
|Step-by-step repair guide                     |Job + vehicle → `{ steps, tools, torqueSpecs, warnings, commonMistakes }`|
|Mechanic ranking                              |Aggregated review data → weighted score                                  |
|Companion parts (“since you’re already there”)|Job type + vehicle → related part list                                   |

All AI responses are cached in Firestore after first generation to minimize API calls.

-----

## OBD Integration

AutoGenius uses the **Web Bluetooth API** (Chrome/Edge on desktop and Android) to connect to the OBD scanner directly from the browser — no native app required on desktop.

For iOS, a companion **React Native app** uses Core Bluetooth to communicate with the device.

The scanner uses standard **ELM327 AT command protocol** over BLE:

```
ATZ        → Reset device
AT SP 0    → Auto-select OBD protocol
0902       → Request VIN (Mode 9, PID 02)
03         → Request stored DTCs (Mode 03)
0104       → Engine load
010C       → RPM
010D       → Vehicle speed
0105       → Coolant temperature
```

-----

## Delivery Partners

|Tier           |Partner                   |Time           |Cost  |
|---------------|--------------------------|---------------|------|
|1-Hour Local   |DoorDash Drive            |~60 min        |$12.99|
|Overnight      |EasyPost (FedEx/UPS)      |By 10:30 AM    |$19.99|
|2-Day          |Carrier routing           |2 business days|Free  |
|Same-Day Pickup|AutoZone / O’Reilly / NAPA|~2 hours       |Free  |

-----

## Roadmap

- [ ] React Native mobile app (iOS + Android)
- [ ] Core Bluetooth OBD integration for iOS
- [ ] Live mechanic GPS tracking for in-progress repairs
- [ ] AI-powered maintenance schedule (“Your Camry is due for X in ~800 miles”)
- [ ] Community Q&A forum (vehicle-specific threads)
- [ ] Wholesale parts warehouse direct integrations
- [ ] Fleet management dashboard for small businesses
- [ ] AutoGenius-branded OBD Pro device (custom firmware)

-----

## Contributing

AutoGenius is a private project by **1522 Inc**. Contribution inquiries welcome — reach out before submitting PRs.

-----

## License

Copyright © 2025 **1522 Inc**. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, in whole or in part, is strictly prohibited without express written permission from 1522 Inc.

-----

<div align="center">

**Built in Tacoma, WA**

[1522 Inc](https://github.com/1522inc) · AutoGenius · SprinterSociety · PicZFlip · Wake & Wander

</div>