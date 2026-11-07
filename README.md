# VENOM-BUTTON

An interactive WebGL2 liquid symbiote button inspired by Venom / Anti-Venom. Features procedural raymarched Signed Distance Fields (SDF), Verlet integration physics tendrils that stretch and snap toward the pointer, real-time specular chrome sheen sweeps, and an embedded Web Audio procedural sound synthesizer.

Designed and developed for [GENZLOG](https://genzlog.tech).

## Features
- **Raymarched 3D Signed Distance Fields:** Full-screen GLSL fragment shader computing organic curvature, surface tension bevels, and liquid metaball blending live on the GPU.
- **Verlet Integration Physics:** Autonomous multi-jointed strands running a 60 FPS Verlet physics simulation stretching toward cursor coordinates.
- **Dynamic Specular Sheen:** Multi-angle lighting pass with Fresnel rim reflections and continuous beam sweep.
- **Procedural Web Audio Engine:** Zero audio files; built-in dual-oscillator FM synthesizer calculates tactile liquid squelches and sub-bass rumbles in real time.
- **Zero External Dependencies:** Self-contained in a single `index.html` file with vanilla WebGL2 and embedded font data.

## Quick Start
Run any local static HTTP server:
```bash
python3 -m http.server 3005
```
Then open `http://localhost:3005` in your browser.
