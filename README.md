# Live Poll Demo

A modern, full-stack live polling platform for real-time engagement, analytics, and role-based access control. Built with the latest web technologies and best practices.

---

## 🚀 Features

- **Poll Creation & Management**: Create, manage, and complete polls with multiple options.
- **Real-time Voting**: Live updates for votes and poll results.
- **Analytics Dashboard**: Visualize poll data and participation.
- **Role-based Access**: Admin and member roles with granular permissions.
- **Responsive & Accessible**: Mobile-first, dark/light themes, and full accessibility support.

---

## 🛠️ Technology Stack & Integrations

### Frontend

- **React 19**: Modern UI with concurrent features.
- **TypeScript**: End-to-end type safety.
- **Vite**: Fast build and dev server.
- **TanStack Router & Query**: Type-safe routing and real-time server state.
- **Tailwind CSS**: Utility-first styling.
- **Shadcn UI**: Accessible UI primitives.
- **Lucide React**: Icon library.
- **Recharts**: Data visualization.

### Backend

- **Convex**: Real-time backend, database, and serverless functions (TypeScript).
- **Convex React Query**: Seamless integration with TanStack Query.
- **Clerk**: Authentication, user management, and JWT-based auth.
- **JWT**: Secure, stateless authentication.

### Dev & Deployment

- **pnpm**: Fast, efficient package management.
- **Netlify**: Deployment and hosting.
- **TypeScript**: Strict mode, 100% coverage.
- **ESLint & Prettier**: Code quality and formatting (recommended).

---

## 🔗 Integrations

- **Clerk**: Handles authentication, user sessions, and role management.
- **Convex**: Provides real-time database, backend logic, and subscriptions.
- **TanStack Query**: Manages server state, caching, and real-time updates.
- **TanStack Router**: File-based, type-safe routing.
- **Tailwind CSS & Shadcn UI**: For styling and accessible UI.
- **Recharts**: For analytics and data visualization.

---

## 🏗️ Project Structure

```
src/
├── components/      # Reusable UI and feature components
├── routes/          # File-based routing (public, authed, admin)
├── lib/             # Utilities and types
└── styles/          # Global styles
convex/              # Convex backend functions and schema
public/              # Static assets
```

---

## 🔒 Authentication & Authorization

- **Clerk**: Sign-in, JWT issuance, and user roles (`admin`, `member`).
- **Route Protection**: Authenticated and admin-only routes.
- **Convex Functions**: All backend logic requires authentication and role checks.

---

## 📊 Analytics & Real-time

- **Live Polls**: Polls and votes update instantly for all users.
- **Dashboard**: Admins access analytics and poll statistics.
- **Subscriptions**: Real-time data via Convex and TanStack Query.

---

## 🧑‍💻 Getting Started

1. **Clone the repository**
   ```powershell
   git clone <your-repo-url>
   cd tcc
   ```

2. **Install dependencies**
   ```powershell
   pnpm install
   ```

3. **Set up environment variables**
   - Configure Clerk and Convex credentials as required (see project docs or ask your admin).

4. **Start the development server**
   ```powershell
   pnpm run dev
   ```

---

## 📝 Development Notes

- **Type Safety**: 100% TypeScript, strict mode enabled.
- **Testing**: (Recommended) Use React Testing Library, Jest, and Playwright for comprehensive coverage.
- **Accessibility**: Follows WCAG guidelines, keyboard navigation, and ARIA support.
- **Performance**: Code splitting, caching, and optimized bundles via Vite and TanStack Query.

---

## 📅 Roadmap & Contributions

See `CODEBASE_ANALYSIS.md` for detailed roadmap, technical debt, and future features. Contributions are welcome—please open issues or pull requests!

---

## 📄 License

MIT

---

**Questions?**  
Open an issue or contact the maintainers.
