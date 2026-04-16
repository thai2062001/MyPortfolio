# Task Handoff: Editorial Theme High-Fidelity Rebuild

## Meta Information
- **Objective**: Rebuild the "Editorial" theme with 100% visual parity to Framer ID `augiA20Il`.
- **Current Status**: Data extraction complete; Foundation update complete; `Home.tsx` rebuild in progress.

## Accomplished
1.  **Meticulous Data Extraction**:
    - Created `design-tokens.json`: Contains exact `rgb`/`rgba` colors and `Crimson Pro`/`Inter` typography settings.
    - Created `component-spec.md`: Detailed variants and styling rules for `Button`, `ServicesCard`, `StatCard`, etc.
    - Created `page-structure.md`: Mapped out the asymmetric hierarchy (Hero, Services, Why Us, Process, etc.).
2.  **Core Styling Update**:
    - Updated `src/themes/editorial/styles/Editorial.css` with exact variables and base components (typography classes, layout utilities, primary/secondary buttons).

## Immediate Next Steps (For the Home Session)
1.  **Rebuild `Home.tsx`**:
    - **Hero**: Implement the asymmetric 1.2fr/1fr grid. Add floating absolute shapes. Ensure second image has 40px margin-top offset.
    - **Services**: Use `backgroundColor="/bg color"` for the section. Implement the dual-directional Tickers.
    - **Process**: Implement the `position: sticky` sidebar and the scrollable column of Steps.
    - **Comparison Table**: Build a pixel-perfect table with the Expert Consulting column highlighted.
2.  **Visual Audit**:
    - After coding, the AI must take screenshots and compare spacing/sizing against the XML dimensions.
    - **CRITICAL**: Do NOT normalize asymmetry. If a section has 64px gap on one side and 50px on another, keep it.

## Constraints Reminder
- Do NOT simplify the design.
- Do NOT replace tonal areas with standard white space.
- Keep the `Crimson Pro` and `Inter` hierarchies exact.
- Port `8080` for dev server.
