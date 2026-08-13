# 🚀 SalesScout AI

> **AI-Powered B2B Sales Intelligence Platform**  
> *Capstone Project for BITSoM (BITS School of Management)*
> 

Access the working project at [Link](https://aistudio.google.com/apps/351f85f7-c231-4adc-b794-7dfa2c8b2266?showAssistant=true&project=gen-lang-client-0938672128&showPreview=true)

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.2-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-orange?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Overview

**SalesScout AI** is an enterprise-grade sales intelligence platform designed to empower B2B sales representatives, account executives, and sales leaders. It transforms raw company data, financial filings, news, and executive profiles into **actionable, executive-ready pre-meeting briefings** in seconds.

By leveraging **Google Gemini 3.6 Flash**, SalesScout AI prepares sales teams with deep account insights, financial health trends, buyer persona analyses, tailored talking points, objection handling strategies, and competitive positioning before every sales interaction.

---

## ✨ Key Features

### 🏢 1. Pre-Meeting Briefing Generator
- **Company Snapshot**: Key industry trends, company size, headquarters, funding/revenue data, recent headlines, and *"Why It Matters Now"*.
- **3-Year Financial Overview**: Multi-year revenue trends, growth margins, and key financial health indicators.
- **Current Affairs & News**: Real-time news sentiment and strategic market impact analysis.
- **Stakeholder Intelligence**: Role overview, top KPIs, communication preferences, perceived pain points, and recent public activity.
- **Strategic Talking Points & Call Openers**: Personalized conversation starters backed by current company context.
- **Objection Radar**: Risk-assessed objections (High/Medium/Low) paired with tactical response strategies.
- **Competitive Context**: Incumbent advantages, key differentiators, and silver-bullet trap questions.
- **Discovery Questions**: High-impact questions to drive meaningful discovery calls.

### 🎯 2. Dynamic AI Briefing Refinement
- Fine-tune any briefing with custom natural language prompts (e.g., *"Focus on CFO financial metrics"*, *"Emphasize cloud security objections"*, or *"Highlight competitors in EMEA"*).

### 💬 3. AI Sales Chat Assistant
- Interactive sales copilot context-aware of generated briefings, target accounts, and conversation history.
- Ask on-the-fly questions like *"What are 3 silver-bullet questions for a skeptical CTO?"* or *"Summarize their latest Q2 earnings."*

### 🎙️ 4. Live Meeting Assistant (Copilot)
- Real-time speech transcript analyzer offering live suggestions during sales calls:
  - Talking Point triggers
  - Objection Re-frames
  - Financial insights
  - Competitive advantages & trap questions

### 📅 5. Google Calendar & CRM Integrations
- **Google Calendar Sync**: Automatic meeting detection with 1-click briefing generation.
- **CRM Connectors**: Built-in integrations for **Salesforce, HubSpot, Pipedrive, and Zoho CRM**.
- **Meeting Platforms**: Compatible with Google Meet, Zoom, and Microsoft Teams.

### 📄 6. Executive PDF Export & Scheduled Reminders
- **PDF Report Generation**: Instant export of structured executive briefings powered by `jsPDF` and `html2canvas`.
- **Automated Email Reminders**: Schedule automated briefing delivery (15 mins, 1 hour, or 24 hours prior to calls).

### 👥 7. Team Activity & Enterprise Mode
- **Individual Rep vs. Enterprise Supervisor** modes.
- Supervisor dashboards for tracking team research logs, active briefings, and account coverage analytics.

### 🎨 8. Customizable UI & Dark Mode
- Full support for **Light**, **Dark**, and **System** themes with custom accent colors (Teal, Indigo, Emerald, Amber).

---

## 🛠️ Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + [Motion](https://motion.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **AI Engine** | [Google Gemini 3.6 Flash](https://ai.google.dev/) via `@google/genai` |
| **Backend Server** | [Express](https://expressjs.com/) + Node.js / Bun (`tsx`) |
| **PDF Processing** | `jsPDF` + `html2canvas` |
| **Auth & APIs** | Google Identity Services, Google Calendar API, Gmail API |
| **Deployment** | GitHub Actions + GitHub Pages / Node.js Server |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher (or [Bun](https://bun.sh/))
- **npm**: `v10.x` or higher
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

---

### Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/SaiYasaswiGurajada/Sales-Scout-AI.git
   cd "Sales Scout AI"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the Express backend server with Vite SPA dev middleware |
| `npm run build` | Builds static frontend assets to `dist/` and bundles `server.ts` |
| `npm start` | Runs the compiled production server (`dist/server.cjs`) |
| `npm run clean` | Removes the `dist` build directory |
| `npm run lint` | Runs TypeScript type checking without emitting files |

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning engine status |
| `POST` | `/api/generate-briefing` | Generates a structured JSON sales briefing using Gemini 3.6 Flash |
| `POST` | `/api/refine-briefing` | Refines an existing briefing based on custom user prompts |
| `POST` | `/api/chat` | AI Sales Chat Assistant endpoint for contextual Q&A |

---

## 🚢 Continuous Integration & Deployment

This project includes a **GitHub Actions** workflow (`.github/workflows/deploy.yml`) for automated deployment to **GitHub Pages**.

### Workflow Steps:
1. Triggered automatically on push to the `main` branch.
2. Sets up Node.js 20 environment.
3. Installs dependencies using `npm ci`.
4. Builds production static assets using `npx vite build`.
5. Uploads `./dist` and deploys automatically to GitHub Pages.

---

## 📁 Directory Structure

```
Sales Scout AI/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── assets/                     # Static assets and images
├── src/
│   ├── components/             # React UI Components
│   │   ├── AIChatView.tsx      # AI Sales Chat View
│   │   ├── AuthScreen.tsx      # User Login & Onboarding
│   │   ├── BriefingView.tsx    # Comprehensive Briefing Dashboard
│   │   ├── CalendarMeetingsView.tsx # Google Calendar Sync
│   │   ├── ConnectToolsView.tsx# CRM & Tool Connector Manager
│   │   ├── DashboardView.tsx   # Core Sales Scout Dashboard
│   │   ├── Header.tsx          # Navigation Header
│   │   ├── HistorySidebar.tsx  # Search & Briefing History
│   │   ├── LoadingSequence.tsx # AI Processing Animation
│   │   ├── MeetingAssistantView.tsx # Live Meeting Copilot
│   │   ├── TeamActivityView.tsx# Enterprise Team Tracker
│   │   └── ...
│   ├── data/                   # Sample data & presets
│   ├── lib/                    # API integrations (Google Auth, Calendar, Gmail, PDF)
│   ├── App.tsx                 # Main Application Container
│   ├── main.tsx                # Entry Point
│   ├── types.ts                # TypeScript Interfaces & Types
│   └── index.css               # Design System & Tailwind CSS
├── server.ts                   # Express Backend & Gemini 3.6 Flash API Engine
├── vite.config.ts              # Vite Configuration
├── tsconfig.json               # TypeScript Configuration
├── package.json                # Project Dependencies & Scripts
└── README.md                   # Project Documentation
```

---

## 🎓 Acknowledgments & Credits

Developed as a **Capstone Project** at **BITSoM (BITS School of Management)**.

Special thanks to the Google Gemini API team for providing structured JSON output capabilities powered by **Gemini 3.6 Flash**.
