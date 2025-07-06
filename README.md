# 3D Battleship ⚓🔥  
_A cinematic re‑imagining of the classic board game using Three.js_

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Gameplay Loop](#gameplay-loop)
- [Controls](#controls)
- [Installation & Running Locally](#installation--running-locally)
- [Tech Stack & Course Concepts](#tech-stack--course-concepts)
- [Challenges & Solutions](#challenges--solutions)
- [Future Enhancements](#future-enhancements)
- [Team Contributions](#team-contributions)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Project Overview

This project transforms the traditional 2D game of **Battleship** into a gritty, cinematic 3D experience using **Three.js**. Players place ships on a shared ocean grid, then engage in turn-based combat that replaces the classic “guessing” mechanic with **skill-based, physics-driven cannon shots**. Dynamic cameras, real-time explosions, and particle effects bring naval warfare to life.

---

## Key Features

| Category       | Highlights |
| -------------- | ---------- |
| **Visuals**    | - Cinematic intro cut-scene  <br> - Skybox with dynamic clouds & mountains  <br> - Water shaders for realistic waves  <br> - Explosive particle effects & ship-sinking animations |
| **Gameplay**   | - 2-phase loop: Ship Placement → Combat  <br> - Five ship types with varying health & damage  <br> - Turn-based firing with *two-stage* angle selection  <br> - “Hit-again” reward on successful sink |
| **Physics**    | - Frame-by-frame parabolic cannonball motion  <br> - Gravity & initial-velocity tuning for playability |
| **Camera**     | - Smooth lerp transitions between bird’s-eye, over-the-shoulder, and aiming views |
| **Performance**| - Lightweight Box3 bounding-box collisions at 60 FPS  <br> - Selective object visibility per game phase |

---

## Gameplay Loop

1. **Loading / Intro**  
   - Press `Enter` to skip or watch the cinematic establishing a high-seas battlefield.

2. **Ship Placement Phase**  
   - Move & rotate each ship on your half of the grid, avoiding overlaps and borders.  
   - Press `Space` to lock in a valid position.  
   - Player 1 places all 5 ships, then Player 2 does the same.

3. **Combat Phase**  
   - Players alternate turns selecting a ship and entering the **Shooting Phase**.

4. **Shooting Phase**  
   - Select a horizontal firing angle via arc overlay.  
   - Then select a vertical angle in a second overlay.  
   - Cannonball is fired along a physics-driven path.

5. **Victory Condition**  
   - The last commander with any remaining ships wins. A final stats screen is displayed.

---

## Controls

| Action                      | Key / Mouse         |
| -------------------------- | ------------------- |
| Move ship (placement)      | `W A S D`           |
| Rotate ship 90°            | `R`                 |
| Place ship / Fire cannon   | `Space / Left-click`|
| Skip cinematic             | `Enter`             |
| Look around (cinematic)    | Mouse drag          |

---

## Installation & Running Locally

**Prerequisites:** Node.js (≥ 18), npm (≥ 9)

```bash
git clone https://github.com/your-org/3d-battleship.git
cd 3d-battleship
npm install
npm run dev
