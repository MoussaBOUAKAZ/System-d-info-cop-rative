# 📄 Cooperative CRM System — Technical Report & Documentation

**Version:** 1.0.0  
**Date:** December 17, 2025  
**Technological Stack:** Next.js 15, Prisma, PostgreSQL, Tailwind CSS

---

## 1. Executive Summary

The **Cooperative CRM** is a centralized management platform tailored for cooperatives to streamline client relations, internal communication, and business analytics. It replaces fragmented tools with a single, type-safe interface for managing contacts, tracking interactions, and analyzing sales performance.

Key capability highlights include an **AI-powered ecosystem** (Chatbot & Smart Insights), a fully customizable **Product/Service Catalog**, and granular **Permission Management**.

---

## 2. Technical Architecture

The application adopts a **Modern Monolithic** architecture using the **Next.js App Router** (React Server Components). This ensures indexable, high-performance pages while retaining rich interactivity for dashboard components.

### 2.1. Architectural Diagrams

#### System Context
```mermaid
graph TD
    User((User)) -->|HTTPS/Secure Auth| WebApp[Next.js CRM]
    
    subgraph "Core Infrastructure"
        WebApp -->|ORM| DB[(PostgreSQL)]
        WebApp -->|Renders| UI[React Components]
        WebApp -->|Fetches| API[Internal API Routes]
    end
    
    subgraph "External Services"
        API -->|Inference| LocalLLM[LM Studio API]
    end
```

### 2.2. Tech Stack Definition

| Layer | Technology | Key Utility |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router) | Server-Side Rendering (SSR) & Streaming. |
| **Language** | TypeScript | Strict type safety across full stack. |
| **Styling** | Tailwind CSS 4 | Atomic, responsive styling. |
| **Database** | PostgreSQL + Prisma | Relational data integrity & easy migrations. |
| **Validation** | Zod | Runtime schema validation for forms/API. |
| **Components** | Shadcn/UI (Radix) | Accessible primitives (Dialogs, Tabs). |

---

## 3. Functional Modules Deep Dive

### 3.1. 👥 Client & Contact Management
*A trusted source of truth for all business relationships.*

*   **Contact Directory**:
    *   **Filtering**: Instantly filter by type (`Client`, `Prospect`, `Partner`).
    *   **Search**: Real-time name/company search.
    *   **Key Metrics**: Cards showing specific "Active Clients" vs "Prospects" counts.
*   **Detailed Profiles**:
    *   **Standard Fields**: Full Name, Company, Role, Email, Phone.
    *   **Location**: Address, City, Postal Code, Country.
    *   **Interaction History**: View all past calls/meetings directly on the client profile.

### 3.2. 🛍 Product & Service Catalog
*Flexible inventory management for both physical goods and intellectual services.*

*   **Item Management**:
    *   **Dual Types**: Distinguish between `Product` (stockable) and `Service` (intangible).
    *   **Categorization**: Organize by `Conseil`, `Logiciel`, `Formation`, etc.
    *   **Stock Tracking**: Specific field for product quantity, hidden for services.
*   **Sales Features**:
    *   **Status Toggle**: Quickly activate/deactivate items without deleting them.
    *   **Performance**: View "Revenue Generated" per product (calculated from linked deals).

### 3.3. 🤝 Interaction Tracking
*Logs every touchpoint to ensure no lead is forgotten.*

*   **Multi-Channel Logging**:
    *   **Email**: track sent proposals.
    *   **Call**: Log duration and outcome.
    *   **Meeting**: Schedule future dates.
*   **Smart Features**:
    *   **Context Linking**: Tag a specific *Product* in an interaction (e.g., "Demo for Product X").
    *   **Status Pipeline**: `Planned` -> `Pending` -> `Completed` -> `Cancelled`.
*   **Visual Timeline**:
    *   **Tabbed View**: Separate tabs for "Upcoming", "Calls", "Emails".
    *   **Badges**: Visual indicators for interaction type and status.

### 3.4. 💬 Communication & AI Hub
*Internal collaboration power-up.*

*   **Team Chat**:
    *   **Modes**: Direct Messages (1:1) and Group Channels.
    *   **Real-time UI**: Optimistic UI updates for instant feel.
*   **AI Assistant Integration**:
    *   **Local LLM Connection**: Connects to `localhost:1234` (LM Studio).
    *   **Context Aware**: Remembers the last 10 messages of the conversation.
    *   **System Prompts**: Configurable personas (General Assistant, Support Bot).

### 3.5. 📊 Analytics Dashboard
*Data-driven decision making.*

*   **Financial Metrics**:
    *   **Total Revenue**: Aggregated value of closed deals.
    *   **Conversion Rate**: Percentage of prospects turned into clients.
*   **Visualizations**:
    *   **Area Chart**: Monthly revenue trends vs targets.
    *   **Pie Chart**: Distribution of interaction types (e.g., "Are we calling enough?").
    *   **Funnels**: Visual representation of the sales pipeline stages.
*   **Leaderboard**: "Top Performers" card highlighting the most active users.

---

## 4. Database Schema Design

The data model is normalized to Third Normal Form (3NF) where practical.

### 4.1. Core Entities

*   **`User`**: The internal operator.
    *   *Relations*: Has many `Sessions`, `Accounts`, `Interactions`.
*   **`Contact`**: The external customer.
    *   *Relations*: Has many `Interactions`, many-to-many with `Product`.
*   **`Product`**: The value proposition.
    *   *Fields*: `type` (Enum: PRODUCT/SERVICE), `stock` (Int, nullable).

### 4.2. Relational Entity Diagram
```mermaid
erDiagram
    CONTACT ||--o{ INTERACTION : "participates in"
    PRODUCT ||--o{ INTERACTION : "is discussed in"
    USER ||--o{ INTERACTION : "logs"
    
    INTERACTION {
        int id
        string type
        string status
        datetime date
    }
    
    AI_CHAT_SESSION ||--|{ AI_CHAT_MESSAGE : contains
```

---

## 5. Installation & Deployment

### 5.1. System Requirements
*   **Node.js**: v18.17.0 or higher.
*   **Database**: PostgreSQL 14+.
*   **RAM**: 4GB+ (8GB+ if running Local LLM).

### 5.2. Quick Start Guide

1.  **Repository Setup**
    ```bash
    git clone <repo_url> mini_projet
    cd mini_projet
    npm install
    ```

2.  **Environment Configuration**
    Create `.env.local`:
    ```ini
    DATABASE_URL="postgresql://user:pass@localhost:5432/crm?schema=public"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="complex_random_string"
    ```

3.  **Database Migration**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Launch**
    ```bash
    npm run dev
    # Access at http://localhost:3000
    ```

---

## 6. Future Roadmap

*   [ ] **Outlook/Gmail Integration**: Two-way sync for emails.
*   [ ] **Invoice Generation**: PDF generation from verified sales.
*   [ ] **Role Granularity**: Custom permission sets (e.g., "View Only" users).
