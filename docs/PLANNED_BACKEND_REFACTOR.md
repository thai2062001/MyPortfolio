# Backend Optimization & Frontend Refactoring Plan
(Saved on 2026-04-11)

## 1. Backend Evaluation Summary
- **Architecture**: Supabase (BaaS) + Vite.
- **Strength**: Proper RLS, consolidated PostgreSQL schema, Cloudinary integration.
- **Issues identified**:
    - Insecure `email.ts` logic (API Key exposure risk).
    - Manual variable caching in query layer.
    - Legacy code in `src/lib`.

## 2. Completed Backend Cleanup
- [x] Deleted insecure `src/lib/email.ts`.
- [x] Removed manual `heroCache` from `src/lib/supabase-queries.ts`.
- [x] Created secure email template at `supabase/functions/send-contact-email/index.ts`.

## 3. Proposed Frontend Refactoring (Paused)
- **Goal**: Transition from `useEffect`/`useState` to **TanStack Query**.
- **Scope**:
    - Create `useHeroQuery` and `useUpdateHeroMutation`.
    - Refactor `HeroSection.tsx` and `HeroManagement.tsx`.
    - Modernize `useAdminCRUD.ts` with React Query.

## 4. Notes
- Local environment uses port **8080** for testing.
- Manual verification required on `localhost:8080` once refactoring resumes.

---
*This plan is saved for later execution as per user request.*
