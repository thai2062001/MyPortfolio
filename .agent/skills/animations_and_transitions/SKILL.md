---
name: Animations and Interactivity
description: Guidelines for implementing UI animations, page transitions, and advanced interactive elements like 3D.
---

# Animations and Interactivity Rules

When building or updating interactive components, UI animations, or advanced 3D scenes (like Three.js/R3F), follow these guidelines:

1. **Page Transitions (Framer Motion / Similar):**
   - Implement smooth page transitions without harsh layout flickers. Use unified animations like a "curtain" reveal or "cinematic scroll".
   - Keep animation variations subtle and cohesive with the overall minimalist/editorial design of the web app.

2. **3D Experiences (Three.js / React Three Fiber):**
   - Ensure performance is top priority for any 3D logic. Remove unused meshes, manage lighting efficiently, and use `useFrame` carefully.
   - For multi-scene web apps (like Memory Vortex, Love Helix, etc.), use scene separation and lazy rendering so the GPU doesn't process invisible scenes.

3. **Scroll Interactions:**
   - Use intersection observers (or `framer-motion` variants like `whileInView`) to trigger animations dynamically based on scroll position.
   - Avoid attaching heavy logic to the window scroll listener unless throttled/debounced appropriately.

4. **Aesthetic Tone:**
   - Implement "editorial" and "cinematic" aesthetics when applicable. Clean typography, elegant slow-reveal animations, sharp borders, and glassmorphism (when asked) typically elevate the user experience.
