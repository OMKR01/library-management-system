# 📚 Library Management System (LMS)

A full-stack, production-ready Library Management System designed to streamline library cataloging, multi-copy inventory, member privileges, loan circulation, and overdue penalty tracking.

Built with **React (Vite)**, **Tailwind CSS**, **Node.js (Express)**, **Prisma ORM**, and **PostgreSQL (Supabase)**.

---

## ✨ Features

### 📖 Catalog & Inventory Management
- **Books & Multi-Copy Tracking**: Manage book titles with ISBNs, editions, and publication years. Track multiple individual physical copies with unique barcodes, shelf locations, and availability statuses (`AVAILABLE`, `BORROWED`, `MAINTENANCE`).
- **Authors & Categories**: Normalize book-author many-to-many associations and organize books by genre/category.
- **Real-Time Search & Filtering**: Instant search across titles, authors, categories, ISBNs, and copy barcodes.

### 👥 Member Management
- **Tiered Memberships**: Support for `STUDENT`, `FACULTY`, and `STANDARD` member tiers with customizable loan allowances (e.g. 3–5 books).
- **Member Profiles**: Track membership numbers, contact details, join dates, and active borrowing statuses.

### 🔄 Loan Circulation & Desk Operations
- **Book Issuance**: Fast checkout by member number and copy barcode, with automated loan duration and due-date calculations.
- **Book Returns**: Transaction-safe returns that immediately restore copy availability and recalculate borrowing quotas.
- **Overdue Penalty & Fine Tracking**: Automated fine calculation based on overdue days, with status tracking (`PAID`, `UNPAID`).

### 🛡️ Admin & Control Panels
- **Dedicated Admin Workspace**: Secured administration view for granular CRUD operations over Books, Authors, Categories, Members, and Individual Copies.
- **Interactive UI**: Responsive layouts, theme toggling (Dark/Light mode), dynamic status badges, and instant toast notifications.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Modern Responsive UI |
| **Backend** | Node.js, Express.js, CORS, Morgan |
| **Database & ORM** | PostgreSQL ([Supabase](https://supabase.com)), [Prisma ORM](https://www.prisma.io/) |
| **Architecture** | RESTful API, Transactional Circulation Workflow |

---

## 📁 Project Structure

```text
library-management-system/
├── client/                      # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── api/                 # API client utilities (fetch wrappers)
│   │   ├── components/          # Reusable UI components (Sidebar, Toast, ThemeToggle, etc.)
│   │   ├── pages/               # Views (Dashboard, Issue, Return, Admin Panels)
│   │   │   └── admin/           # Panels for Books, Authors, Categories, Members
│   │   ├── App.jsx              # Main application shell & routing
│   │   └── index.css            # Tailwind & global stylesheet
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Application (Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema definitions & models
│   │   └── seed.js              # Optional initial database seeder
│   └── src/
│       ├── controllers/         # Request handling & business logic
│       ├── lib/                 # Prisma client instance
│       ├── middlewares/         # Global error handlers
│       ├── routes/              # REST API route endpoints
│       ├── index.js             # Express server entry point
│       ├── package.json
│       └── .env.example         # Server environment variables template
│
├── .env.example                 # Global environment variables template
├── .gitignore                   # Security & Git ignore configuration
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account or any PostgreSQL database instance

---

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/library-management-system.git
cd library-management-system
```

---

### 2. Configure Environment Variables

Create a `.env` file inside `server/src/` (or copy from the provided template):

```bash
# In server/src/
cp .env.example .env
```

Open `server/src/.env` and provide your database connection credentials:
```env
# Shared transaction pooler (port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations (port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

PORT=5000
```

> **Note:** The `.env` file is excluded from Git tracking via `.gitignore` to keep credentials secure.

---

### 3. Setup the Database

Navigate to `server/src/`, install dependencies, and push the Prisma schema to your database:

```bash
cd server/src
npm install

# Push schema to Supabase / PostgreSQL
npx prisma db push

# (Optional) Populate database with sample starter data
npm run db:seed
```

---

### 4. Start the Backend Server

From `server/src`:
```bash
npm run dev
```
The server will start listening at `http://localhost:5000`.

---

### 5. Start the Frontend Client

Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The client application will start at `http://localhost:5173`.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/copies` | List all book copies with status & shelf location |
| `GET` | `/api/members` | Retrieve registered members |
| `GET` | `/api/borrows/active` | Retrieve currently active book loans |
| `POST` | `/api/circulation/issue` | Issue a book copy to a member |
| `POST` | `/api/circulation/return` | Process book return and calculate overdue fines |
| `GET` / `POST` | `/api/books` | Fetch or add new books |
| `GET` / `POST` | `/api/authors` | Fetch or add authors |
| `GET` / `POST` | `/api/categories` | Fetch or add book categories |
| `POST` | `/api/admin/members` | Create and manage library members |
| `POST` | `/api/admin/copies` | Register new book copies & barcodes |

---

## 🔒 Security & Best Practices
- **No Hardcoded Secrets**: Sensitive database URLs and passwords are fully isolated into environment configurations.
- **Prisma Transactions**: Circulation updates use atomic transactions (`prisma.$transaction`) to prevent desynchronization between borrow records and physical book copy statuses.
- **Safe Cascade Rules**: Relational integrity enforced across Authors, Books, Copies, Members, and Fines.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
