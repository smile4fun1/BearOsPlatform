# Bear Universe — Bearrobotics.ai Data Constellation

An all-in-one mock automation cockpit for **Bear Robotics** (Bearrobotics.ai, a Korean-founded robotics company) that:

- Curates operational telemetry with fake-yet-realistic data to showcase **KPI panels and trendlines**.
- Describes two large-model training programs (70B data analyst + 120B knowledge core) with live milestone tracking.
- Streams context into ChatGPT so stakeholders can ask ad‑hoc questions while the in-house models are still training.

Everything runs locally, so you can mirror it across your laptop + phone while we prototype the “Bear Universe” layout.

---

## Feature Highlights

- **Mock data lake** powered by `@faker-js/faker` + `dayjs`, covering facilities from Seoul to Silicon Valley with shift-level stats.
- **Data curation utilities** compute KPIs, incident radar, demand/utilization heatmaps, and financial orbits.
- **Model orchestration blueprints** describing Ursa Major (70B KPI analyst) and Aurora Bear Lore (120B knowledge core) with milestone + eval telemetry.
- **ChatGPT bridge** (`/api/insights`) that merges the curated payload with your prompt and returns a narrative (or a local mock when `OPENAI_API_KEY` is missing).
- **Universe UI shell** composed of Tailwind 4 + Recharts cards, tuned for dark “space dock” visuals with responsive layouts.

---

## Project Layout

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Server component that assembles the entire Bear Universe layout and feeds props to the client widgets. |
| `src/app/layout.tsx` | Global HTML scaffolding, fonts, and metadata for the experience. |
| `src/app/globals.css` | Tailwind 4 entry plus base tokens. |
| `src/app/api/curation/route.ts` | REST endpoint returning the curated KPI payload (same data the UI consumes). |
| `src/app/api/insights/route.ts` | ChatGPT bridge; uses the curated payload as context. Returns a deterministic mock when no API key is set. |
| `src/components/universe/*` | Modular UI pieces (KPIs, trends, heatmap, alerts, knowledge cards, API catalog, training cards, chat console). |
| `src/lib/types.ts` | Shared TypeScript interfaces for ops data, KPIs, training plans, etc. |
| `src/lib/mockData.ts` | Fake-but-themed datasets (operations, financials, Bear knowledge base, API surfaces). |
| `src/lib/dataCurator.ts` | Pure functions that aggregate metrics, compute deltas, and assemble the dashboard payload. |
| `src/lib/modelOrchestrator.ts` | Placeholder training run logic for the 70B/120B models, including milestone tracking + eval scores. |

---

## Running the App Locally (laptop + phone)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Optional: connect ChatGPT**

   Create `.env.local` and add your key:

   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

   Without this variable the `/api/insights` route will return a helpful mock response that still references real KPIs.

3. **Start the dev server**

   ```bash
   # Desktop only
   npm run dev

   # Share with your phone on the same Wi‑Fi (binds to all interfaces)
   npm run dev -- --hostname 0.0.0.0 --port 3000
   ```

   Visit `http://<your-machine-ip>:3000` from the phone’s browser to walk the universe UI.

4. **Lint / sanity check**

   ```bash
   npm run lint
   ```

---

## Data & AI Architecture

- `operationsDataset` simulates 16 weeks of shift-level telemetry across Seoul HQ, Silicon Valley Command, Busan pilot clusters, and more.
- `dataCurator.ts` computes:
  - KPI cards (orders automated, uptime, NPS, incidents per 1k jobs) with automatic momentum deltas.
  - Weekly throughput trends visualized via `TrendPanel`.
  - Demand/utilization heatmaps and incident radar callouts.
  - Financial orbits (ARR, pipeline, deployments, margins).
- `modelOrchestrator.ts` defines:
  - **Ursa Major (70B)** – tuned for telemetry stats & diagnostics.
  - **Aurora Bear Lore (120B)** – encyclopedic knowledge + GTM storytelling.
  - Each plan tracks dataset scope, stages (curation → pretraining → alignment → evaluation), validation/hallucination scores, and deployment targets.
- `api/insights` merges the curated payload with user prompts and defers to ChatGPT (`gpt-4.1-mini`). When the API key is missing it still returns a structured narrative referencing the latest metrics, so demos never stall.

---

## Customization Notes

- **Data realism:** tweak `src/lib/mockData.ts` to add more facilities, partners, or finance notes. Curation logic will auto-ingest as long as you keep the types consistent.
- **Visual tweaks:** Tailwind 4 tokens live in `src/app/globals.css`. Add more gradients, fonts, or animations as needed.
- **Embedded APIs:** Add new cards/tables by extending the curated payload (e.g., add partner success data, compliance checklists) and wiring a new component inside `page.tsx`.
- **Future Bear agents:** When proprietary APIs are ready, swap the ChatGPT request inside `/api/insights` for your internal agent or aggregator.

---

## Reference

- Bear Robotics public site: [https://bearrobotics.ai](https://bearrobotics.ai)
- Products referenced: Servi, Servi Lift, Servi Plus, Servi Suite, Bear Cloud API, Spatial Vision Stream.

Let’s keep this README up to date as the universe expands (new data sources, auth, deployment scripts, etc.). Ping this doc whenever the architecture or workflows evolve.
