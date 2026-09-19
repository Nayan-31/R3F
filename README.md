# R3F Spiral Streams

Gojo ke raised fingertip ke paas se pink, gold, silver, chrome, red aur green cube streams start hoti hain. Streams model ke around dip karke upar wide spirals banati hain. Har stream mein 110 rotating, moving matcap cubes hain. Thin bright lines aur wider transparent lines ribbon-like appearance deti hain. Background plain dark hai, 180 tiny decorative particles ke saath; wallpaper use nahi hoti.

## Run

```bash
npm install
npm run dev
```

`npm run lint` code rules check karta hai. `npm run build` production bundle banata hai.

## Controls

Drag se orbit, scroll se zoom. Cube hover par tint badalta hai; click par size toggle hota hai.

## Code aur learning guide

- `src/App.jsx`: sirf Canvas, lights, camera aur scene components.
- `src/components/`: Character, SpiralCube, SpiralStream, SpiralStreams aur SpaceDust.
- `src/config/streams.js`: matcap imports, stream colors/phases, cube count aur emission point.
- `src/spiral.js`: shared spiral position formula. Cubes aur ribbons same formula use karte hain.
- [Detailed Hinglish explanation](README-HINGLISH.md): current code, maths, hooks aur settings ko step-by-step samjho.

## Settings

`src/config/streams.js` mein `CUBES_PER_STREAM` density control karta hai. `delta * 0.035` travel speed hai. `getSpiralPosition` ke radius, turns aur height spiral shape control karte hain. `EMISSION_POINT` existing static model pose ke fingertip ke paas manually calibrated hai; model animate/repose karne par automatic finger tracking nahi hai.

Ye reference-inspired basic implementation hai. Ribbon glow layered transparent lines hai, actual bloom/postprocessing nahi. Depth-of-field blur aur animated character pose included nahi hain. Background particles static hain. Cube endpoint par scale down karke fingertip se restart hota hai. Browser visual review abhi pending hai.

Model `public/models/character/` se load hota hai. Original asset `src/models/` mein hai; served copy ke old specular/glossiness materials base-color textures ke saath metallic/roughness format mein adapted hain.

### Model credit

This work is based on [“Gojo”](https://sketchfab.com/3d-models/gojo-b66b15ae463f45a3b7d30252d174b4bd) by [Paleo_isle](https://sketchfab.com/Paleo_isle), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The served copy has adapted materials; original license is included alongside the model.

Nayi matcap ke liye `src/config/streams.js` mein image import karke `MATCAP_STREAMS` mein entry add karo. Phases total stream count se automatically calculate hote hain. Ab 6 streams × 110 = 660 animated cubes hain.
