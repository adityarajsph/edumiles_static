This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


---

## CMS Setup Guide

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in every value:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | Atlas connection string — see below |
| `JWT_SECRET` | 64-char hex secret. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Settings → Account |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard → Settings → Access Keys |
| `CLOUDINARY_API_SECRET` | Same location as above |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Move the existing hardcoded key here (currently still hardcoded for backward compat) |
| `ADMIN_EMAIL` | First admin account email — used only by the create-admin script |
| `ADMIN_PASSWORD` | First admin password (min 8 chars) — used only by the create-admin script |
| `NEXT_PUBLIC_SITE_URL` | Your production domain, e.g. `https://edumilestravels.com` |

---

### 2. MongoDB Atlas Setup

1. Sign up at [atlas.mongodb.com](https://atlas.mongodb.com) and create a **free M0 cluster**.
2. **Database user** — Security → Database Access → Add New Database User.
   - Username: `edumiles_app`
   - Role: **Read and write to any database** (or restrict to `edumiles_cms`).
   - Save the password — it goes in `MONGODB_URI`.
3. **Network Access** — Security → Network Access → Add IP Address.
   - For Vercel / serverless hosting: add `0.0.0.0/0` (allow all IPs).
   - For a fixed-IP server: add your server's static IP instead.
4. **Connection string** — Connect → Drivers → copy the URI, replace `<password>` and append the database name:
   ```
   mongodb+srv://edumiles_app:<password>@cluster0.xxxxx.mongodb.net/edumiles_cms?retryWrites=true&w=majority
   ```

---

### 3. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier is sufficient).
2. From the Dashboard copy **Cloud name**, **API Key**, **API Secret** into `.env.local`.
3. Images upload to `edumiles/packages` and `edumiles/blogs` folders automatically.

---

### 4. Create the First Admin Account

After setting `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env.local`, run:

```bash
npx ts-node --skip-project scripts/create-admin.ts
```

This creates one admin document in MongoDB. Safe to run multiple times — exits early if the email already exists.

To change the admin password after setup, log in at `/admin/login` and go to **Settings → Change Password**.

---

### 5. Seed Existing Content into the Database

To migrate the hardcoded packages and blogs into MongoDB (preserving all existing live URLs):

```bash
npx ts-node --skip-project scripts/seed.ts
```

- **Idempotent** — safe to run multiple times. Skips any slug that already exists.
- **Non-destructive** — never overwrites content you have already edited in the CMS.
- Run against a **staging database first**; only point at production after verifying.

---

### 6. Running the Admin CMS

Start the dev server and visit:

```
http://localhost:3000/admin/login
```

Log in with the credentials from step 4. The CMS includes:

| Section | Path | Description |
|---|---|---|
| Dashboard | `/admin` | Stats, recent submissions |
| Packages | `/admin/packages` | List, add, edit, publish, feature, delete |
| Blog Posts | `/admin/blogs` | List, add, edit, publish, feature, delete |
| Submissions | `/admin/submissions` | All form submissions, status management, CSV export |
| Settings | `/admin/settings` | Change admin password |

---

### 7. How Content Updates Reach the Live Site

The public pages use **ISR (Incremental Static Regeneration)** with a 60-second revalidation window:

- When you publish or update a package/blog in the CMS, the API route calls `revalidatePath` — the live page refreshes on the next request.
- The listing pages (`/packages`, `/blog`) fetch from the database client-side on mount, so they always show the latest published content.
- If MongoDB is unreachable, every public page silently falls back to the hardcoded static data — the live site never crashes.

---

### 8. New Dependencies Added

| Package | Version | Purpose |
|---|---|---|
| `mongoose` | latest | MongoDB ODM |
| `bcryptjs` | latest | Admin password hashing |
| `jsonwebtoken` | latest | JWT auth for admin sessions |
| `cloudinary` | latest | Image uploads |
| `zod` | latest | Server-side input validation |
| `sanitize-html` | latest | XSS-safe rich text sanitization |
| `@types/bcryptjs` | dev | TypeScript types |
| `@types/jsonwebtoken` | dev | TypeScript types |
| `@types/sanitize-html` | dev | TypeScript types |

---

### 9. Rollback Plan

If anything goes wrong after deployment:

1. **Admin CMS broke a public page?** The middleware only matches `/admin/*` and `/api/admin/*`. Public routes are never touched by it. Revert `middleware.ts` to restore.
2. **DB fetch broke a public page?** Every public page has a try/catch with static data fallback. The page cannot crash from a DB error.
3. **Quick rollback** — revert these files to restore fully-static operation:
   - `app/packages/[slug]/page.tsx` — remove `fetchPackageBySlug` call, keep `getStaticPackageBySlug`
   - `app/blog/[slug]/page.tsx` — same pattern
   - `app/packages/page.tsx` and `app/blog/page.tsx` — remove `useEffect` fetch
   - `app/components/FeaturedPackages.tsx` — remove `useEffect` fetch
4. **Forms** — removing the fire-and-forget `fetch("/api/forms/submit")` from the 4 form components reverts to Web3Forms-only behaviour instantly.
