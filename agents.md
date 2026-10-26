# Agent Directives: Library Management System

## Project Overview
A full-stack web application automating library cataloging, copy tracking, borrower memberships, and loan circulation (issue, return, and overdue penalty tracking).

## Stack & Architecture
- Backend: Node.js, Express.js (REST API)
- Database: PostgreSQL with Prisma ORM
- Frontend: React 18+ (Vite), Tailwind CSS
- Authentication: Session/JWT (Role: Admin / Librarian)

## Execution Standards for Antigravity Agents
1. Before writing new routes, inspect `server/prisma/schema.prisma` and ensure database migrations are in sync via `npx prisma db push`.
2. Do not write mock data in controllers; query Prisma directly.
3. Every borrow record update (e.g. marking a book returned) must be wrapped in a database transaction (`prisma.$transaction`) to guarantee copy status (`book_copies.status`) and loan status remain synchronized.
4. Auto-verify API endpoints with curl/tests before prompting user review.