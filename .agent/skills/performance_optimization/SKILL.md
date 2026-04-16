---
name: Performance Optimization
description: Coding guidelines for optimizing data fetching, image loading, and overall React application performance.
---

# Performance Optimization Rules

> [!CAUTION]
> **MANDATORY PRE-REQUISITE**:
> 1. **Read this Skill**: You MUST read this documentation in its entirety BEFORE performing any tasks related to Frontend data fetching, API integration, or State management.
> 2. **Database Truth**: You MUST read `SUPABASE_SCHEMA_CONSOLIDATED.sql` BEFORE any data-related implementation.
> 3. **Fixed Port**: The development port is strictly **8080**. Do not use or configure any other ports.

Based on standard workflows and goals for high-performance React/Next.js projects:

1. **Image Optimization:** 
   - Never use unoptimized, raw raster images directly if possible. Deliver images via Cloudinary or another image CDN.
   - Serve in WebP/AVIF format and apply appropriate transformations to crop/resize images on the server side.
   - Use lazy loading (`loading="lazy"`) for images that are below the fold.

2. **Data Fetching & State Management:**
   - Utilize standard caching libraries like React Query (`@tanstack/react-query`) or SWR. Avoid relying purely on `useEffect` with raw `fetch` for robust applications.
   - Ensure caching policies are implemented to minimize redundant API calls. Data fetching should be centralized (e.g., custom hooks).
   - Handle loading, error, and caching states cleanly to provide a smooth structural transition for the user instead of "loading flickers."

3. **Code Splitting & Bundle Size:**
   - Use dynamic imports (`React.lazy` / `next/dynamic`) for heavy components (e.g., 3D graphics like Three.js canvases, complex charts) to avoid bloating the initial payload.

4. **Reducing Render Overhead:**
   - Memoize expensive calculations (`useMemo`) and callback props (`useCallback`).
   - Try to isolate state rendering so that high-frequency updates (like animation values) do not trigger unnecessary whole-tree re-renders.

5. **Scroll & Rendering Lag Preventatives:**
   - **IntersectionObserver Overload:** Do not nest Framer Motion `whileInView` setups across both parent (e.g. `PortfolioGrid`) and children (`ProjectCard`). Staggered containers handle the IntersectionObserver gracefully for all descendants. Redundant observers degrade main thread performance severely on mobile scrolls.
   - **Heavy GPU Filters:** Avoid `will-change: transform` or `will-change: opacity` on massive absolute elements (like Background Accents) that also apply `filter: blur()`. A large blur surface natively costs extreme GPU resources to rasterize. Combining it with `will-change` traps it into an expensive composition layer layout thrashing loop. Use `will-change: auto` instead for blurred decorative nodes.
