---
name: Auth login flow details
overview: Detailed explanation of how the current login/admin flow works end-to-end in this repo (Next.js App Router + Supabase SSR cookies + admin_users membership + middleware/page guards).
isProject: false
---

# Auth + Admin Login Flow (Detailed)

This repo uses **Supabase auth** with **email + password** and **server-side admin gating** using a membership table:

- Admin membership table: `public.admin_users`
- Admin definition in the app: “the signed-in user exists in `public.admin_users`”
- Enforcement layers:
  1. Middleware redirects non-admins away from `/protected`
  2. `/protected` page redirects again (defense in depth)

## Key files (where the logic lives)

- `app/login/page.tsx`
  - Renders the login form
  - Handles sign-in via `signInWithPassword`
  - If already signed in, checks admin membership and redirects
- `lib/supabase/server.ts`
  - Creates the Supabase SSR client wired to Next.js cookies
- `lib/admin/is-admin.ts`
  - Checks admin membership by querying `public.admin_users`
- `lib/supabase/middleware.ts` + `proxy.ts`
  - Middleware reads the session user from cookies and redirects non-admins
- `app/protected/page.tsx`
  - Checks that the user is logged in AND is in `public.admin_users`

## Database admin membership (what makes someone an admin)

The migration creates:

- Table: `public.admin_users`
- Column: `user_id uuid` (references `auth.users(id)`)
- RLS enabled + a policy that allows a user to `select` only their own membership row

Conceptually:

> If `auth.uid()`’s user id exists in `public.admin_users`, they are an admin in the app.

### Why you needed the migration + insert

When you ran:

- `create table public.admin_users ...`
- `insert into public.admin_users (user_id) ...`

…the app’s runtime checks (`isAdminUser`) started returning `true`, so `/protected` became accessible.

## Supabase SSR cookies (how the session survives across requests)

### Where cookies are connected

In `lib/supabase/server.ts`:

1. `cookies()` from `next/headers` reads cookies from the incoming request.
2. `createServerClient(url, anonKey, { cookies: { getAll, setAll } })` wires Supabase auth to those cookies.
3. When Supabase needs to update cookies (e.g., during sign-in), `setAll()` writes them back to the response.

### What this means in practice

After a successful `signInWithPassword`, Supabase sets session cookies.
Because Next’s SSR client is cookie-wired, subsequent server components can do:

- `await supabase.auth.getUser()`

and get the correct session user.

## Full flow: admin login end-to-end (request-by-request)

### 0) Precondition

- Admin exists in `auth.users`
- Admin’s `auth.users.id` is inserted into `public.admin_users`

If either is missing, the admin check fails.

### 1) Admin opens `/login`

Request hits server-rendered `app/login/page.tsx`.

Server component does:

1. `const supabase = await createClient()`
2. `const user = await supabase.auth.getUser()`
3. If `user` exists:
   - Call `isAdminUser(supabase, user.id)`
   - If admin: `redirect("/protected")`
   - If not admin: redirect to `/login?error=unauthorized`

#### Note about `searchParams` (important runtime detail)

If you access `/login?error=unauthorized`, Next may provide `searchParams` as a dynamic Promise.
Your code was updated to `await` the resolved value before reading `.error`.
This prevents the runtime error:
“searchParams is a Promise and must be unwrapped…”

### 2) Admin submits login form

Form posts to the server action inside `app/login/page.tsx` (`signInWithEmail`):

1. Read `email` + `password` from `formData`
2. `const supabaseServer = await createClient()`
3. Call:
   - `supabaseServer.auth.signInWithPassword({ email, password })`
4. On success:
   - Supabase writes session cookies via the SSR cookie adapter (`setAll`)
5. Then redirect to `/protected`

### 3) Browser requests `/protected`

Now the request includes the fresh Supabase session cookies.

#### 3a) Middleware runs first

`proxy.ts` calls `updateSession()` in `lib/supabase/middleware.ts`.

It does:

1. Create a Supabase server client bound to the request cookies
2. `supabase.auth.getUser()` reads the session
3. If the path starts with `/protected` and the user is not an admin:
   - redirect to `/login?error=unauthorized`

#### 3b) The `/protected` page runs

`app/protected/page.tsx` also enforces:

1. `user` must exist
2. `isAdminUser(supabase, user.id)` must return `true`
3. Else redirect to `/login?error=unauthorized`

This double check is intentional defense in depth.

### 4) Admin clicks “Sign out”

In `app/protected/page.tsx`:

1. Calls `supabaseServer.auth.signOut()`
2. Supabase clears auth cookies
3. Redirects to `/login`

## How the admin check works internally

In `lib/admin/is-admin.ts`:

1. Query:
   - `supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle()`
2. Returns:
   - `true` if a row exists
   - `false` otherwise (including RLS errors)

### Bottleneck/behavior implication

If RLS blocks the query (misconfiguration), `isAdminUser` returns `false`.
So “not admin” can mean either:

- membership row missing, or
- RLS/policy misconfigured, or
- select permission missing

## Bottlenecks and things you should know (practical)

### 1) DB membership query happens multiple times

Per login flow, you typically hit:

- `/login` server component: membership check
- middleware for `/protected`: membership check
- `/protected` page: membership check

For MVP, this is fine.
If you later scale or add many admin routes, consider reducing checks:

- middleware-only enforcement OR page-only enforcement
- memoizing admin membership in-request

### 2) Middleware is currently set to match `/login` too

Your `proxy.ts` matcher includes:

- `"/protected/:path*"`
- `"/login"`
- `"/auth/callback"`

So every `/login` request still does `supabase.auth.getUser()`.
This is small overhead but not needed.
You can later optimize by removing `"/login"` from matcher and letting the page handle its own guard.

### 3) `app/auth/callback/route.ts` may be legacy now

Your login UI currently uses `signInWithPassword`, not `signInWithOtp`.
So the `/auth/callback` route is not required for the current flow.
It’s safe to leave it, but it’s part of the older magic-link implementation.

### 4) RLS failures look like “not admin”

If admin suddenly stops working after changes, check:

- `public.admin_users` exists
- RLS enabled
- the `select` policy exists and matches your auth model

## Summary (one sentence)

Login sets Supabase session cookies; then both middleware and the `/protected` page verify admin membership by checking `public.admin_users` for the signed-in user id.
