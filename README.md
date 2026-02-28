# AdminBoard Pro — AI-Powered Admin Dashboard

An intelligent, full-stack admin dashboard built with **React**, **Material UI**, **Nivo Charts**, and the **Blink SDK**. Features six AI-powered modules that transform a standard data dashboard into a smart command center.

---

## Live Demo

**[https://admin-dashboard-app-o3nqai8g.sites.blink.new](https://admin-dashboard-app-o3nqai8g.sites.blink.new)**

---

## 🚀 Features

- **📊 Modern Dashboard**: Real-time business overview with Material UI components and Nivo charts.
- **🤖 Admin AI Assistant**: Integrated AI chat that can analyze your dashboard data using the Blink AI SDK.
- **📅 Interactive Calendar**: Persist events to the database and manage schedules with real-time updates.
- **📋 Real-time Kanban**: Manage tasks with drag-and-drop, synced across all active users.
- **📈 Advanced Analytics**: AI-powered revenue forecasting and automated executive reports.
- **👥 Enterprise Team Management**: Role-based access control (Admin, Editor, Viewer) for secure team collaboration.
- **🔍 Global Smart Search**: Instantly find team members, contacts, or invoices across the entire CRM.
- **🧠 AI Smart Labeling**: Context-aware categorization and priority labeling for new leads and contacts.
- **🛠 CRM Core Features**:
  - Contacts Management
  - Invoice Tracking
  - Real Transaction History
  - User Creation Forms with Validation
  - FAQ Knowledge Base

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Material UI (MUI)
- **State Management**: React Hooks & Redux Toolkit
- **Backend**: Blink SDK (Auth, Database, AI, Realtime)
- **Database**: SQLite (managed by Blink)
- **Charts**: Nivo, Chart.js
- **Form Handling**: Formik & Yup
- **Calendaring**: FullCalendar

## 🛠 Project Structure

- `src/scenes/dashboard`: Main analytics overview.
- `src/scenes/kanban`: Real-time task management.
- `src/scenes/global/Sidebar.jsx`: Dynamic navigation and user info.
- `src/components/AIAgentChat.jsx`: AI Assistant implementation.
- `src/hooks/useDashboardData.jsx`: Data fetching and initial seeding logic.

## 🔐 Authentication & Access

AdminBoard Pro uses **Blink Auth** for secure access. The application features a dedicated authentication gate that ensures only authorized personnel can access sensitive CRM data.

- **Admin**: Full access to dashboard, team management, and financial reports.
- **Manager**: Access to contacts, invoices, and analytics.
- **User**: Access to calendar, kanban, and personal tasks.

## 📈 Database Schema

The application uses a relational structure optimized for performance:
- `users`, `teams`, `contacts`, `invoices`, `transactions`, `calendar_events`, `kanban_tasks`, `chat_messages`, `faqs`.

---

Created with ❤️ using [Blink](https://blink.new)
