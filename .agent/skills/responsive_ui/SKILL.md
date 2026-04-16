---
name: Responsive UI Design
description: Rules and guidelines for creating robust, responsive layouts across all device breakpoints.
---

# Responsive Design Rules

When developing or fixing UI components, especially in the Admin panel or main Portfolio section, follow these principles to ensure layouts do not break on smaller screens (Tablet 768px to Laptop 1024px):

1. **Mobile-First Approach:** Always write the default styling for the smallest screen, then use `md:`, `lg:`, `xl:` to adjust for larger screens.
2. **Flexbox & Grid Constraints:** 
   - Never use fixed widths/heights that exceed typical screen dimensions without `max-w-full` or overflow handling.
   - For Grid layouts, prefer `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` instead of fixed grid configurations.
   - When using Flexbox, add `flex-wrap` and handle wrapping behavior proactively.
3. **Preventing Overflow:** Ensure wide elements (like tables or long texts) use `overflow-x-auto` to prevent horizontal scrolling on the main page.
4. **Testing Breakpoints:** Always account for intermediate breakpoints. The layout must handle widths like `768px`, `850px`, and `1024px` gracefully, without elements squashing or clipping (e.g., footers overlapping content).
5. **Tailwind Best Practices:** Leverage Tailwind's utility classes. Refrain from custom CSS max-width rules unless absolutely necessary.

6. **Dialog Layout & Positioning:**
   - When using `fullScreenMobile` or components that apply `!important` to positioning (`!top-0`, `!left-0`), you **MUST** ensure those are explicitly reset for higher breakpoints if custom centering/sizing is needed (e.g., using `lg:!left-[50%]` and `lg:!top-[50%]`).
   - Avoid `!important` in base component primitives whenever possible, but if present, always use a matching priority reset for larger screens.
   - **Grid vs Flex:** Prefer `flex flex-col` for Dialog content to allow better child distribution and avoid `grid-gap` issues in complex nested layouts.

7. **Admin "Editorial" Sizing:**
   - The standard "Editorial" large dialog should target roughly `85vw` width and `82vh` height on desktop to maintain a premium feel without feeling overwhelming or losing its center.

8. **Fixed-Height Dialog Safety:**
   - **Sticky Footer Occlusion**: In dialogs with sticky footers (`absolute bottom-0`), the main scrollable container **MUST** have a defensive bottom padding (e.g., `pb-48` or `pb-64`) to prevent the last form fields/items from being hidden by the footer.
   - **Sidebar Integrity**: In fixed-height sidebars with a footer section (e.g., "Luminous Core"), the navigation list **MUST** use `flex-1 overflow-y-auto min-h-0` to ensure it scrolls independently and doesn't push or clip the sidebar footer out of view.
   - **Shrink Prevention**: Use `shrink-0` on sidebar footer elements to guarantee they maintain their intended dimensions.
