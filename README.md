# AdminBoard Pro — AI-Powered Admin Dashboard

An intelligent, full-stack admin dashboard built with **React**, **Material UI**, **Nivo Charts**, and the **Blink SDK**. Features six AI-powered modules that transform a standard data dashboard into a smart command center.

---

## Live Demo

**[https://admin-dashboard-app-o3nqai8g.sites.blink.new](https://admin-dashboard-app-o3nqai8g.sites.blink.new)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **UI Library** | Material UI v5, Nivo Charts |
| **Routing** | React Router v6 |
| **Forms** | Formik + Yup validation |
| **Calendar** | FullCalendar v5 |
| **Backend / Auth / DB** | Blink SDK (`@blinkdotnew/sdk`) |
| **AI** | Blink AI (text generation, structured objects, agents) |
| **Sidebar** | react-pro-sidebar v0.7 |

---

## AI Features

### 1. AI Pulse Insight
- **Location**: Dashboard (top card)
- **What it does**: Automatically analyzes team size, revenue, invoice count, and transaction history to generate a concise business briefing.
- **Tech**: `blink.ai.generateText()` with a system prompt tuned for business analysis.

### 2. Natural Language Data Query (AI Assistant)
- **Location**: Floating chat icon (bottom-right, all pages)
- **What it does**: Users can ask questions in plain English like *"Show me all admin users"* or *"What's my total revenue?"*. The AI agent queries the live database and returns answers.
- **Tech**: `useAgent` hook with `dbTools` from `@blinkdotnew/react`. Uses `google/gemini-3-flash` model with multi-step reasoning.

### 3. Smart Label Analysis
- **Location**: Profile Form page (`/form`)
- **What it does**: Before creating a user, click **"Smart Label Analysis"** to have AI suggest a priority level (High/Medium/Low) and persona tag (VIP, Standard, Partner) based on the entered profile data.
- **Tech**: `blink.ai.generateObject()` with a JSON schema for structured output.

### 4. AI Executive Report Generator
- **Location**: Dashboard header button
- **What it does**: Generates a professional Markdown report with executive summary, key findings, and strategic recommendations. Downloads as a `.md` file.
- **Tech**: `blink.ai.generateText()` with dashboard data context.

### 5. Predictive Revenue Forecasting
- **Location**: Line Chart page (`/line`) and Dashboard revenue chart
- **What it does**: Click **"Predict Future Revenue"** to have AI analyze historical transaction data and project the next 3 data points. Displayed as a red forecast line overlaying the real data.
- **Tech**: `blink.ai.generateObject()` returning an array of `{ x, y }` forecast points.

### 6. Team Sentiment & Anomaly Detection
- **Location**: Integrated into AI Pulse and the AI Assistant
- **What it does**: Flags anomalies like sudden drops in activity, unusually large expenses, or overdue invoices as part of the AI briefing and chat responses.

### 7. Kanban Board (Real-Time)
- **Location**: Kanban Board page (`/kanban`)
- **What it does**: A drag-and-drop task board for project management.
- **Tech**: `@hello-pangea/dnd` for drag-and-drop, synced in real-time across users via `blink.realtime`.

### 8. Global Search
- **Location**: Topbar search input
- **What it does**: Instantly searches across Team, Contacts, and Invoices. Displays results in a popover with quick navigation.
- **Tech**: Parallel database queries using `blink.db`.

### 9. AI Chat History
- **Location**: Floating AI Assistant
- **What it does**: Persists your conversations with the AI Assistant to the database, so your history is available even after page reloads.
- **Tech**: Persistent `chat_messages` table.

### 10. Pro Upgrade Flow
- **Location**: Upgrade page (`/upgrade`)
- **What it does**: A professional pricing page showcasing Basic and Pro features. 
- **Tech**: Integrated with `blink.notifications` for alert triggers.

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | KPI cards, revenue chart, transactions, AI Pulse, AI Report |
| `/team` | Team Management | DataGrid of team members with access-level badges |
| `/contacts` | Contacts | Searchable/filterable contact directory with GridToolbar |
| `/invoices` | Invoices | Invoice list with cost highlighting and checkbox selection |
| `/form` | Profile Form | Create new users with Formik validation + AI Smart Labeling |
| `/calendar` | Calendar | Interactive FullCalendar with event CRUD (persisted to DB) |
| `/faq` | FAQ | Accordion-style FAQ pulled from the database |
| `/bar` | Bar Chart | Nivo bar chart visualization |
| `/pie` | Pie Chart | Nivo pie chart visualization |
| `/line` | Line Chart | Nivo line chart with AI revenue forecasting |
| `/geography` | Geography | Nivo choropleth map visualization |

---

## Database Schema

All tables include a `user_id` column for row-level security (each user sees only their own data).

| Table | Key Columns |
|---|---|
| `teams` | id, name, email, age, phone, access |
| `contacts` | id, name, email, age, phone, address, city, zip_code, registrar_id |
| `invoices` | id, name, email, cost, phone, date |
| `transactions` | id, tx_id, user_name, date, cost |
| `calendar_events` | id, title, start, end, all_day |
| `faqs` | id, question, answer |

On first login, the `useDashboardData` hook automatically seeds the database with sample data so the dashboard is immediately populated.

---

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── AIAgentChat.jsx    # Floating AI assistant (NLQ)
│   ├── AIPulse.jsx        # Dashboard AI briefing card
│   ├── BarChart.jsx       # Nivo bar chart wrapper
│   ├── GeographyChart.jsx # Nivo choropleth wrapper
│   ├── Header.jsx         # Page header component
│   ├── LineChart.jsx       # Nivo line chart + AI forecasting
│   ├── PieChart.jsx       # Nivo pie chart wrapper
│   ├── ProgressCircle.jsx # Circular progress indicator
│   └── StatBox.jsx        # KPI stat card
├── data/                # Static data for charts
│   ├── mockData.jsx       # Sample datasets (used for DB seeding)
│   └── mockGeoFeatures.jsx # GeoJSON for geography chart
├── hooks/
│   └── useDashboardData.jsx # Central data hook (fetch + seed)
├── lib/
│   └── blink.ts           # Blink SDK client initialization
├── scenes/              # Page-level components
│   ├── bar/               # Bar chart page
│   ├── calendar/          # Calendar page (event CRUD)
│   ├── contacts/          # Contacts data grid
│   ├── dashboard/         # Main dashboard with AI features
│   ├── faq/               # FAQ accordion
│   ├── form/              # User creation form + AI labeling
│   ├── geography/         # Geography chart page
│   ├── global/            # Sidebar + Topbar (layout)
│   ├── invoices/          # Invoices data grid
│   ├── line/              # Line chart page
│   ├── pie/               # Pie chart page
│   └── team/              # Team data grid
├── App.jsx              # Root component (auth gate + routing)
├── index.jsx            # Entry point (BlinkProvider + BrowserRouter)
├── index.css            # Global styles + scrollbar customization
└── theme.jsx            # MUI theme + dark/light mode + color tokens
```

---

## Authentication

- **Mode**: Blink Managed Auth (redirects to `blink.new/auth`)
- **Gate**: Unauthenticated users see a branded sign-in page
- **Sign Out**: Logout button in the top navigation bar
- **User Info**: Sidebar displays the authenticated user's display name

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- A [Blink](https://blink.new) account (for SDK features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ron-Web-Dotcom/react-admindashboard.git
cd react-admindashboard

# Install dependencies
bun install   # or npm install

# Start development server
bun dev       # or npm run dev
```

### Environment Variables

The following are auto-injected by Blink's sandbox. For local development, create a `.env.local`:

```env
VITE_BLINK_PROJECT_ID=admin-dashboard-app-o3nqai8g
VITE_BLINK_PUBLISHABLE_KEY=your_publishable_key
```

---

## Available Scripts

```bash
bun dev        # Start Vite dev server on port 3000
bun run build  # Production build to /dist
bun run preview # Preview production build locally
```

---

## License

MIT
