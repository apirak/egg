### Instructions for AI/Code Generation

1.  **Project Type:** HTML5 Mobile-first Web App (type script, vite, preact for ui)
2.  **Key Libraries:** Matter.js (Physics), GSAP (Animations - Optional but recommended), Minimal CSS.
3.  **Core Task:** Implement an 'Egg Merge' game with strict physics, Suika-style merging, specific level progression for three colors, and high performance (pre-rendered sprites).

---

### Master Prompt for Egg Merge Game

**Act as an expert Senior Frontend Game Developer specializing in physics-based mobile games.** Your task is to develop a fully functional 'Egg Merge' web application, optimized for mobile devices, using `Matter.js` for physics.

Please follow these detailed requirements precisely to ensure the geometry is optimized and the gameplay logic is correct.

---

### **PART 1: Geometry & Optimized Rendering (CRITICAL)**

Instead of calculating smooth silhouettes every frame (CPU intensive), we must use the **"Pre-rendered Sprite"** approach.

1.  **Define Egg Geometry (Physics Only):** In Matter.js, represent an egg as a `Matter.Body.create({ parts: [...] })`. This compound body must consist of two `Matter.Bodies.circle`:
    * `circleLarge` (Base of the egg).
    * `circleSmall` (Top of the egg, positioned slightly above).
    * Ensure they overlap correctly to create a convincing, wobbly, and non-symmetrical roll.

2.  **Generate Sprite Textures (Graphics Initialization):** Upon game load, create an internal `offscreenCanvas` (not visible to the user). For each of the **15 total egg types** (3 Colors x 5 Levels), draw the smooth egg silhouette *once*.
    * **The Curve Algorithm:** Use the centers and radii of `circleLarge` and `circleSmall` to calculate the tangent points. Draw two Bezier curves connecting these points smoothly, forming the final eggshell shape. Fill the shape with the color and a subtle stroke.
    * **Store as Data URLs:** Save each drawn egg as a PNG Data URL or a reusable `<canvas>` pattern to use as a texture in the game loop.

3.  **Final Rendering Loop:** In the main game loop, draw the *pre-rendered sprite* onto the main canvas at the exact position (`body.position`) and rotation (`body.angle`) of the Matter.js compound body. Do not draw the individual circles. This ensures 60FPS on mobile.

---

### **PART 2: Gameplay Logic & Progression**

Implement strict merge rules for 3 distinct colors (Red, Blue, Green). **Eggs must only merge if they are the SAME color AND the SAME level.**

#### **Progression Data (Apply per Color):**

When two L1 Red eggs collide and merge, they create one L2 Red egg with **1.2x size multiplier**.

* **Level 1 (General)** ➔ L1 + L1 = **L2 (Dot)**
* **Level 2 (Dot)** ➔ L2 + L2 = **L3 (Wristband)**
* **Level 3 (Wristband)** ➔ L3 + L3 = **L4 (Flash)**
* **Level 4 (Flash)** ➔ L4 + L4 = **L5 (Golden)**
* **Level 5 (Golden)** ➔ L5 + L5 = **"ASCENSION" (Angle)**

#### **The "Angle" (Ascension) Handling:**

When two **Golden Red** eggs merge:
1.  Play a special particle effect/sound.
2.  Remove the resulting **Angle Red** egg *immediately* from the Matter.js physics world.
3.  Implement a "floating up" animation (use `GSAP` if available, or manual interpolation) to move the visual sprite toward a predefined "Collection Shelf" UI element at the top/side of the screen.

---

### **PART 3: Controls & Mobile-First UI**

1.  **Controls:**
    * **TAP (or CLICK):** Instantly drop the currently spawned egg from the emitter.
    * **HOLD (or LONG-PRESS):** Auto-drop spawned eggs consecutively as long as held.
    * Add a visual "Guide Line" showing the drop trajectory.

2.  **UI Elements:**
    * **Container:** A clean, fixed-size play area.
    * **Spawn Button:** A prominent button labeled "SPAWN EGG" to queue the next random L1 egg (Red, Blue, or Green) into the emitter.
    * **Progression Shelf:** A UI panel showing how many Angle Eggs of each color have been collected (e.g., "Angles: R:2 | B:1 | G:3").
    * **Game Over:** Detect when eggs stack too high (cross a deadline for >2 seconds).

---

### **PART 4: Technical Execution**

Generate a well-structured, clean implementation. If possible, keep it in a single `index.html` with inline `<style>` and `<script>` for ease of testing, or provide a minimal Vite-style structure (`index.html`, `style.css`, `main.js`).

**Generate the full code now, prioritizing performance and the sprite-based optimized geometry.**
