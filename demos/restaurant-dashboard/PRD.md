# Demo PRD: Restaurant Campaign Dashboard

**Slug:** restaurant-dashboard  
**Job:** Build a Replicable WhatsApp QR Menu, Review Reminder and Marketing Dashboard MVP for Restaurants  
**Job URL:** https://www.upwork.com/jobs/Build-Replicable-WhatsApp-Menu-Review-Reminder-and-Marketing-Dashboard-MVP-for-Restaurants_~022045250928387686938/  
**Type:** SaaS Dashboard UI  
**Target build time:** ≤ 28 min

## What to Build

A sleek, data-dense restaurant owner dashboard showing real-time customer interactions from the WhatsApp QR flow. The dashboard surfaces key metrics (consent rates, pending reminders), a filterable contact list, and a lightweight campaign sender—demonstrating how easily restaurants can manage multi-location campaigns and GDPR-compliant opt-out workflows.

## Route

`/demo/restaurant-dashboard` — implemented in `src/app/demo/restaurant-dashboard/page.tsx`

## Features

1. **Contacts Table** — searchable/filterable list with phone, consent date, consent type (menu only vs. marketing), reminder status, and last interaction
2. **Quick Stats Cards** — total contacts, opt-in rate %, pending reminders, campaigns sent this week
3. **Campaign Sender Panel** — select restaurant location, draft message, preview WhatsApp message, send button (simulated)
4. **Reminder Queue** — shows which customers are due for review reminders in the next hour, with status badges (pending/sent/failed)
5. **Consent Audit Log** — last 5 interactions showing timestamp, action (consent given, reminder sent, opt-out), user phone, consent type

## Design Direction

Clean, modern SaaS dashboard with a dark left sidebar (restaurant branding), light main content area. Data-dense but scannable—use cards for metrics, tables for lists, subtle color coding (green for opted-in, gray for consent-pending, red for opted-out). WhatsApp green accent color for CTAs. Target: Stripe / Linear-like polish.

## Tech

- Next.js App Router + Tailwind CSS v4 + shadcn/ui
- Stateless with mock JSON data (customers, campaigns, audit log)
- Icons: lucide-react for dashboard controls
- No API integration, no auth

## Key Screens / States

- **Main Dashboard** — overview + stats + contacts table in one view
- **Campaign Sender Expanded** — message builder with WhatsApp preview pane
- **Contact Detail Row** — on click, expand to show full consent history + opt-out toggle (demo only)

## Out of Scope

- Authentication / login
- Real API / database
- WhatsApp message sending (button is visual only)
- Multi-tenancy (single restaurant hardcoded)
- Advanced filtering / export
