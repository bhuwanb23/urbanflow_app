# API Keys Reference

Required API keys for full UrbanFlow functionality. All have **free tiers** — no paid account needed for development.

---

## 1. Delhi GTFS-RT (DIMTS / Open Transit Data)

| Field | Value |
|---|---|
| **Env vars** | `DELHI_API_URL`, `DELHI_API_KEY` |
| **Sign-up** | <https://otd.delhi.gov.in> |
| **Free tier** | Yes — request access via the portal |
| **Usage** | Real-time bus positions, trip updates, and service alerts for Delhi |
| **Notes** | Approval may take 1–2 business days. A `DELHI_API_KEY` of `""` disables real-time data gracefully (static data still works) |

---

## 2. Bengaluru DULT (Directorate of Urban Land Transport)

| Field | Value |
|---|---|
| **Env vars** | `DULT_VEHICLE_POSITIONS_URL`, `DULT_TRIP_UPDATES_URL`, `DULT_ALERTS_URL`, `DULT_API_KEY` |
| **Sign-up** | <https://dult.in> (portal may not be publicly open — check <https://data.gov.in>) |
| **Free tier** | Unknown — endpoints may be closed/private |
| **Usage** | Real-time bus/BMTC vehicle positions and trip updates for Bengaluru |
| **Notes** | If endpoints are unavailable, Bengaluru runs on static GTFS only. Fallback: set all to `""` |

---

## 3. Chennai MTC

| Field | Value |
|---|---|
| **Env vars** | `CHENNAI_API_URL`, `CHENNAI_API_KEY` |
| **Sign-up** | N/A — not yet available from MTC |
| **Free tier** | N/A |
| **Usage** | Future real-time data for Chennai MTC buses |
| **Notes** | City is currently a 5-stop/3-route **stub** for testing the multi-city architecture. Set both to `""` |

---

## 4. TomTom Traffic API

| Field | Value |
|---|---|
| **Env vars** | `TOMTOM_API_KEY` |
| **Sign-up** | <https://developer.tomtom.com> |
| **Free tier** | **2,500 API calls/day** — 2,500 free transactions/day for up to a year |
| **Usage** | Traffic flow data (congestion, incidents) displayed on the dashboard |
| **Notes** | Required only for the Traffic section of the dashboard. Without it, traffic loads show as "N/A" |

---

## 5. CPCB AQI (via data.gov.in)

| Field | Value |
|---|---|
| **Env vars** | `CPCB_API_KEY` |
| **Sign-up** | <https://data.gov.in> → create account → API tab → request key |
| **Free tier** | Yes — **unlimited calls** (subject to fair-use policy) |
| **Usage** | Real-time Air Quality Index from Central Pollution Control Board stations |
| **Notes** | No throttling in dev. Without it, AQI shows as "N/A" on the dashboard |

---

## 6. OpenTripPlanner (OTP)

| Field | Value |
|---|---|
| **Env var** | `OTP_API_URL` |
| **Obtain** | Self-hosted — run your own OTP instance (Java, ~4 GB RAM) |
| **Free tier** | Full — it's your own instance |
| **Usage** | Multi-modal trip planning (bus + metro + walking) |
| **Notes** | Default: `http://localhost:8080/otp/routers/default`. For dev you can skip this — the app falls back to pre-computed routes from GTFS |

---

## Quick Setup

```bash
# Copy example env
cp .env.example .env

# Fill in keys you have (leave empty to gracefully disable features)
# Then start the server:
npm start
```

---

## Which Keys Are Strictly Required?

| Key | Required for | Free? |
|---|---|---|
| (none) | Static GTFS data (stops/routes/shapes/schedule) | ✅ |
| `DELHI_API_KEY` | Delhi real-time bus tracking | ✅ Free |
| `TOMTOM_API_KEY` | Traffic dashboard widget | ✅ 2,500/day |
| `CPCB_API_KEY` | AQI dashboard widget | ✅ Unlimited |
| `DULT_*` | Bengaluru real-time bus tracking | ❓ Unknown |
| `CHENNAI_*` | Chennai real-time (stub city) | ❌ N/A |
| `OTP_API_URL` | Multi-modal trip planning | ✅ Self-host |
