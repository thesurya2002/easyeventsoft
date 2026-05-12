# EasyEventSoft — Static Demo

A fully static, frontend-only preview of the EasyEventSoft ERP/CRM for event management companies. **No backend, no database, no API calls.** All data is hardcoded into the bundle, so the whole thing runs anywhere that serves static HTML — perfect for GitHub Pages.

> ⚠️ This is the **demo** build. The real product has a Node/Express + Prisma + MySQL backend, JWT auth, GST invoice PDF generation, multi-tenant row scoping, and an audit log. This bundle simulates the UI of all those features against in-memory data so you can show stakeholders the workflows without standing up infrastructure.

---

## What's inside

- **5 personas** selectable from the login page — pick any to see that role's view
- **15+ pages**: dashboard, leads, events (list + detail), vendors, tasks, payments, expenses, invoices, categories, staff, reports, activity logs, settings
- **Super-admin section**: companies, plans, platform analytics, cross-tenant logs
- **Recharts** for the dashboard and report charts
- **Printable invoice** rendered as an HTML page (use your browser's "Save as PDF") — substitutes for the backend's pdfkit output
- **Pure CSR**: any "create / edit / delete" you do updates an in-memory store; refreshing the page resets it

---

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. You'll land on `/login` first — pick a persona.

---

## The five personas

| Persona            | Email                       | What they can see                                                    |
| ------------------ | --------------------------- | -------------------------------------------------------------------- |
| **Super Admin**    | `super@easyeventsoft.com`   | Platform-wide: companies list, plans, analytics, cross-tenant logs   |
| **Company Admin**  | `admin@demo.com`            | Everything inside the Demo Events Co. workspace (all modules + staff) |
| **Event Manager**  | `manager@demo.com`          | Leads, events, vendors, tasks, invoices, categories, reports         |
| **Staff**          | `staff@demo.com`            | Only their own assigned tasks + events they're tied to               |
| **Accountant**     | `accounts@demo.com`         | Finance focus: payments, expenses, invoices, reports                 |

No passwords — clicking any persona logs you in via `localStorage`. Use "Switch user" from the sidebar (or the Settings page) to go back to the picker.

---

## Deploy to GitHub Pages

A workflow is already included at `.github/workflows/deploy.yml`.

1. Push this repo to GitHub.
2. Settings → Pages → **Source: GitHub Actions**.
3. Edit `.github/workflows/deploy.yml` and replace `/easyeventsoft-demo` in `NEXT_PUBLIC_BASE_PATH` with `/<your-repo-name>` (matching the URL slug).
4. Push to `main`. The Action runs `npm ci && npm run build`, drops the output in `out/`, and publishes it.

After the first run, the demo lives at `https://<your-username>.github.io/<your-repo-name>/`.

### Notes on `basePath`

- For a **project page** (e.g. `username.github.io/easyeventsoft-demo/`) → set `NEXT_PUBLIC_BASE_PATH=/easyeventsoft-demo` (matching the repo name).
- For a **user/org root site** (`username.github.io`) or a **custom domain** → leave it blank (don't set the env var at all, or set it to an empty string).

The build script writes the path into both `basePath` and `assetPrefix` in `next.config.js` so all links and bundled assets resolve correctly under the subdirectory.

---

## How the demo simulates a backend

| Real product                          | Demo substitute                                                              |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| Express + Prisma + MySQL              | `src/data/seed.js` — a single module exporting fixed records                 |
| JWT login / refresh tokens            | `src/context/AuthContext.jsx` — stores the chosen user id in `localStorage`  |
| `api.get/post/put/delete` via Axios   | `src/hooks/useDemoList.js` — local React state with `create/update/remove`   |
| Role-based middleware on every route  | `<DashboardLayout allowedRoles={[...]}>` redirects mismatches                |
| pdfkit-generated GST invoice          | `printInvoice()` opens a new tab with print-styled HTML                      |
| Audit log writes from controllers     | Pre-seeded `activityLogs` array; new mutations don't append to it            |

If you want to wire it back to a real backend later, the page structures are almost identical to the full-stack version — just swap `useDemoList(seed)` back to `useCrud('/api/leads')` (or similar) and re-add the `api` Axios client.

---

## Tech

- Next.js 14 (App Router, `output: 'export'`)
- React 18
- Tailwind CSS
- React Hook Form + react-hot-toast
- Recharts
- lucide-react icons
- date-fns

---

## License

Demo source. Use it however helps you sell or showcase the real product.
