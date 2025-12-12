# BearOS Platform Plan

## 🎯 Vision
A unified "Operating System" for Bear Robotics that blends:
1.  **Enterprise Utility:** Real-time fleet operations, data telemetry, and AI orchestration (from `BearUniverse`).
2.  **Support & Knowledge:** Apple-style documentation, FAQs, and support workflows (from `BearEmeaSupport`).
3.  **Communication:** Slack-like channels for team and partner collaboration.
4.  **Security:** Role-Based Access Control (RBAC) ensuring strict data separation between Internal Teams, Field Engineers (RFEs), Partners (Qcom), and Customers.

---

## 🏗 Architecture

### Core Stack
-   **Framework:** Next.js 16 (App Router)
-   **Styling:** Tailwind CSS 4 + Framer Motion
-   **Icons:** Lucide React
-   **State Management:** React Context (for Roles & Chat)
-   **Data Layer:** Mock Data Generators (Faker.js) + Real-time Streaming Logic

### Role System (RBAC)
| Role | Access Level | Key Features |
| :--- | :--- | :--- |
| **Internal Admin** | God Mode | Full Fleet Ops, AI Models, All Channels, Partner Portal View |
| **Internal RFE** | Field Engineer | Fleet Ops (Region Locked), Tickets, Knowledge Base, Internal Channels |
| **Partner (Qcom)** | External Partner | Partner Portal (Assigned Sites only), Support Channels, Public Knowledge Base |
| **Customer** | End User | Basic Dashboard (My Robots), Public Knowledge Base, Ticket Creation |

---

## 🛠 Development Roadmap

### Phase 1: Foundation & Unification (✅ Completed)
- [x] Merge `BearUniverse` and `BearEmeaSupport` into `BearOsPlatform`.
- [x] Implement Global Sidebar Navigation.
- [x] Implement Role Context & Switcher.
- [x] Integrate `framer-motion` for animations.
- [x] Harmonize Design Systems (Bear Blue + Dark Mode Glassmorphism).

### Phase 2: Core Modules (✅ Completed)
- [x] **Dashboard:** Role-aware widgets and metrics.
- [x] **Knowledge Base:** Ported EMEA Support FAQ + AI Search Mode.
- [x] **Connect:** Slack-like channel interface with bot integration.
- [x] **Partner Portal:** Qcom-specific view for managing assigned sites.
- [x] **Fleet Ops:** Ported Maps & Telemetry from BearUniverse.

### Phase 3: Refinement & "Apple Polish" (Current Focus)
- [ ] **Styling Overhaul:** Apply `BearEmeaSupport` aesthetics (Bear Blue accents, rounded buttons) to the dark mode base.
- [ ] **Animations:** enhance transitions between roles and pages.
- [ ] **Mobile Responsiveness:** Ensure Sidebar transforms into a bottom nav or hamburger menu on mobile.

### Phase 4: Intelligence (Future)
- [ ] **Real AI Integration:** Connect `aiClient` to OpenAI/Anthropic API.
- [ ] **RAG Pipeline:** Feed Knowledge Base articles into the AI context window.
- [ ] **Predictive Maintenance:** Use fleet data to generate proactive alerts in `#robot-alerts`.

---

## 🎨 Design Principles
1.  **"Dark Mode First":** The OS lives in a dark, high-contrast environment (like a cockpit).
2.  **Glassmorphism:** Use semi-transparent layers (`bg-white/5`, `backdrop-blur`) to create depth.
3.  **Bear Blue Accents:** Use `#51A6D6` for primary actions and active states.
4.  **Motion:** Every interaction should have instant feedback (hover states, scale effects).

---

## 📝 Notes & Ideas
-   *Idea:* Add a "Command Palette" (Cmd+K) for quick navigation.
-   *Idea:* "Live Mode" toggle for the Dashboard to simulate real-time data flow.
-   *Idea:* Drag-and-drop file sharing in the Connect module.

