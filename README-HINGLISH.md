# Spiral scene — current code ko Hinglish mein samjho

Ye guide ab current spiral implementation ke liye hai. Purana random triangle/cloud code replace ho chuka hai. Pehle big picture samjho: teen rang ki imaginary curved railway tracks hain. Har track par chhote cubes move karte hain aur khud bhi ghoomte hain. Tracks finger ke paas start hote hain, model ke around dip karte hain aur upar wide ho jaate hain.

Code ab separate files mein organized hai. Neeche component explanations same behavior explain karti hain; sab components ab App.jsx ke andar nahi hain.

| File | Responsibility |
| --- | --- |
| `src/App.jsx` | Canvas, lights, Suspense, camera aur scene assembly |
| `src/config/streams.js` | Matcap imports, STREAMS, CUBES_PER_STREAM, EMISSION_POINT |
| `src/components/Character.jsx` | Model loading |
| `src/components/SpiralCube.jsx` | Ek cube ka movement, rotation, hover aur click |
| `src/components/SpiralStream.jsx` | Ek stream ke cubes aur ribbon lines |
| `src/components/SpiralStreams.jsx` | STREAMS array ko map karke saari streams render karna |
| `src/components/SpaceDust.jsx` | Background specks |
| `src/spiral.js` | Shared path maths |

Har component file apna function `export default` karti hai; parent usse `import` karta hai. Config file constants ko named `export` karti hai, isliye import mein `{ STREAMS }` jaisi braces aati hain. `../` current folder se ek level upar jaata hai, isliye moved components `../spiral` use karte hain. Nayi matcap/stream ab `src/config/streams.js` mein add karo.

Ye readability ke liye component separation hai; lazy loading ya automatic separate network bundles add nahi kiye.

Actual files: `src/spiral.js` shape ki maths rakhti hai, `src/App.jsx` scene banati hai. `src/main.jsx` app start karta hai aur `src/index.css` full-page sizing deta hai.

## Basic words

- **Component:** ek reusable recipe, jaise `SpiralCube`.
- **Mesh:** visible 3D object; geometry uska shape, material uski surface.
- **Position `[x,y,z]`:** X left/right, Y up/down, Z depth (world axes).
- **Rotation:** object ka angle, radians mein. `Math.PI` = 180 degrees.
- **Scale:** size multiplier. Geometry side 1 ho toh scale 0.1 se side 0.1 hoti hai.
- **Props:** parent se component ko milne wali information.
- **Ref:** actual mesh ya changing value rakhne ka box, jise update karne se React rerender nahi hota.
- **State:** React ki memory; setter se update karne par React UI update kar sakta hai.
- **`const`:** variable ko doosri value assign nahi karenge; array/object ke andar changes phir bhi possible hain.
- **`[]`:** list. **`{}`:** object/block, ya JSX ke andar JavaScript expression, context ke according.
- **`=>`:** arrow function. **`return`:** result do. **`//`:** explanatory comment.
- Blank lines readability ke liye hain. Semicolon statement end karta hai. Closing braces apna object/function/block end karti hain.

## 1. src/spiral.js — ek shared path

```js
export function getSpiralPosition(progress, phase) {
```

Function bahar import ho sake, isliye `export`. `progress` path par location hai: 0 start, 1 end. `phase` starting angular offset hai; isse teen tracks ek hi jagah overlap nahi karte. Opening `{` function body start karta hai.

```js
const angle = progress * Math.PI * 2 * 2.2 + phase;
```

`Math.PI * 2` ek full round, ya 360 degrees. `2.2` roughly 2.2 rounds banata hai. Progress badhega toh angle badhega. Phase same spiral ko circle ke around alag starting direction deta hai.

```js
const radius = progress * 5.4 + Math.sin(progress * Math.PI) * 1.1;
```

Radius center se distance hai. Start par progress zero, radius zero: sab tracks fingertip par meet karte hain. `progress * 5.4` upar jaate hue radius grow karta hai. Sine wala extra term beech mein thoda fullness deta hai. `Math.sin(0)` aur `Math.sin(Math.PI)` approximately zero hain, aur half-way `Math.sin(Math.PI / 2)` one hota hai.

```js
const dip = progress < 0.45 ? Math.sin((progress / 0.45) * Math.PI) * 3.3 : 0;
```

`condition ? yes : no` ternary expression hai. First 45% path mein dip calculate hota hai; uske baad zero. `(progress / 0.45)` first section ko 0–1 range mein convert karta hai. Sine start par zero, beech mein one, end par zero: path pehle neeche dip karke wapas rise karta hai. `3.3` dip strength hai. Ye function continuous hai, lekin join par mathematically perfectly smooth tangent ki guarantee nahi hai.

```js
return [
  Math.cos(angle) * radius,
  progress * 8 - dip,
  Math.sin(angle) * radius * 0.65,
];
}
```

X ke liye cosine, Z ke liye sine use hota hai. Dono milkar circular/elliptical movement banate hain. Imagine clock hand: angle badalte hi uska tip circle banata hai.

Y `progress * 8 - dip` se decide hota hai. Overall upward growth hai, early portion mein downward curve. Z ko `0.65` se multiply karne se depth compressed rehti hai; spiral ellipse jaisi hoti hai. `return` teen coordinates deta hai. `];` array/statement close, final `}` function close.

**Important:** function khud animation nahi karta. Ye bas kisi progress ke liye address deta hai. `useFrame` progress change karke animation banayega. Ribbons bhi yahi function use karti hain, isliye cubes aur visible paths aligned rehte hain.

## 2. Imports (ab relevant component/config files mein)

```jsx
// @refresh reset
import { Line, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import { getSpiralPosition } from "./spiral";
```

Special refresh comment development edits par old state reset karne ko kehta hai. Ye production animation loop nahi hai.

Drei se `Line` connected 3D points draw karta hai, `OrbitControls` camera interaction, `useGLTF` model loading, aur `useTexture` image loading deta hai. R3F se `Canvas` stage aur `useFrame` frame callback milte hain. React se loading boundary, refs aur state aate hain. Last import hamari own maths function hai.

```jsx
import goldMatcap from "./images/matcap1.png";
import pinkMatcap from "./images/matcap2.jpg";
import silverMatcap from "./images/matcap3.jpg";
```

Har image import Vite ko usable URL generate karne deta hai. `./` App.jsx ke folder se path resolve karta hai. Gold, pink, silver variable names images ko identify karte hain; image ka actual look asset se aata hai.

## 3. Constants aur streams

```jsx
const EMISSION_POINT = [-0.44, -0.59, 0.98];
const CUBES_PER_STREAM = 110;
const STREAMS = [
  { color: "#ff80b0", matcap: pinkMatcap, phase: 0 },
  { color: "#ffe18a", matcap: goldMatcap, phase: (Math.PI * 2) / 3 },
  { color: "#d9efff", matcap: silverMatcap, phase: (Math.PI * 4) / 3 },
];
```

Emission point poore stream group ka world address hai. Existing static model ke fingertip ke paas manually set hai; finger tracking nahi.

110 cubes × 3 streams = 330 animated cubes. Array ki har object ek stream ki settings hai. `color` ribbon color hai, `matcap` cube texture URL, `phase` angular separation. Phases 0°, 120°, 240° hain. Random textures per cube ki jagah coherent stream colors use hue hain, taaki pink/gold/silver paths readable hon.

## 4. Character component

```jsx
function Character() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/character/scene.gltf`);
  return <primitive object={scene} position={[-0.5, -3.8, 0]} scale={1.2} />;
}
```

First line component define karti hai. `useGLTF` model load karta hai; `{ scene }` returned object se scene field nikaalta hai. Backtick string mein `${...}` value insert hoti hai. Vite base URL normally `/` hai. Public files ke browser path mein `public/` nahi aata.

`primitive` existing Three.js object display karta hai. Position model ko neeche rakhti hai; scale 1.2 original se 20% bigger karta hai. Is component mein bones ya character animation play nahi hoti.

## 5. SpiralCube props aur memory

```jsx
function SpiralCube({ start, phase, matcap, size, spin, offset }) {
  const cubeRef = useRef();
  const progressRef = useRef(start);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
```

Props destructuring se har recipe value ka naam directly milta hai. `start` initial path fraction; `phase` stream angle; `matcap` loaded texture; `size` base cube scale; `spin` rotation speed; `offset` tiny sideways variation.

`cubeRef` actual mesh access ke liye. `progressRef` changing progress yaad rakhta hai, initially `start`. `useRef` initial value later rerenders par automatically replace nahi karta. Hover/click states har cube ki independent memory hain. Dono initially false.

## 6. Movement: useFrame ki har line

```jsx
useFrame((_, delta) => {
  progressRef.current = (progressRef.current + delta * 0.035) % 1;
  const progress = progressRef.current;
  const [x, y, z] = getSpiralPosition(progress, phase);
  const scatter = Math.sin(progress * Math.PI) * 0.24;
```

Callback har rendered frame chalti hai. First argument state unused hai, isliye naam `_`; underscore magic keyword nahi. `delta` pichhle frame se elapsed seconds hai.

`delta * 0.035` har second 0.035 progress add karta hai: full journey roughly 28.6 seconds. `% 1` remainder rakhta hai: 1.01 becomes 0.01, cube restart karta hai. Ye constant path-progress speed hai; curve ki world-space distance speed constant nahi, kyunki path sections ki lengths differ karti hain.

Local `progress` readability ke liye hai. Array destructuring `[x,y,z]` path address nikaalti hai. Scatter start/end par zero, middle mein larger: cubes ribbon ke aas-paas float karte hain, fingertip par scatter vanish hota hai.

```jsx
cubeRef.current.position.set(
  x + offset[0] * scatter,
  y + offset[1] * scatter,
  z + offset[2] * scatter,
);
```

Actual mesh ki position direct set hoti hai. Har coordinate mein fixed random offset × current scatter add hota hai. Array indices 0/1/2 X/Y/Z values hain. Random values har frame regenerate nahi hoti, isliye noisy teleporting nahi hoti.

```jsx
cubeRef.current.rotation.x += spin * delta;
cubeRef.current.rotation.y += spin * delta * 0.8;
```

Cube path par travel karte hue khud bhi rotate karta hai. `+=` existing value mein addition hai. Y speed X ki 80% hai. Delta animation ko frame-rate independent rakhta hai: 30 FPS aur 60 FPS par roughly same rotation per second.

```jsx
const fade = Math.min(1, progress * 35, (1 - progress) * 18);
cubeRef.current.scale.setScalar(
  size * (0.3 + progress * 1.5) * fade * (clicked ? 1.5 : 1),
);
});
```

`Math.min` smallest value choose karta hai. Start ke paas `progress * 35` small, end ke paas `(1-progress)*18` small, middle mein maximum 1. Yahaan fade **scale fade** hai, opacity fade nahi.

`setScalar` X/Y/Z teenon scale same set karta hai. Base size path ke saath grow hota hai, end par shrink hota hai. Clicked ho toh another 1.5 multiplier. Last lines scale call aur frame callback close karti hain. Har frame scale yahin set hota hai, isliye click multiplier bhi yahin include hai.

## 7. Cube ka JSX

```jsx
return (
  <mesh
    ref={cubeRef}
    position={getSpiralPosition(start, phase)}
    scale={0}
```

Mesh create hota hai aur ref attach hota hai. Initial position same path se aati hai. Initial zero scale first frame se pehle accidental visible flash avoid karta hai; useFrame calculated size apply karta hai.

```jsx
onPointerOver={(event) => {
  event.stopPropagation();
  setHovered(true);
}}
onPointerOut={() => setHovered(false)}
onClick={(event) => {
  event.stopPropagation();
  setClicked((previous) => !previous);
}}
```

Hover handler color memory true karta hai; pointer out false. `stopPropagation` same event ko further objects/parents tak jaane se rokta hai. Click functional updater latest boolean ko reverse karta hai: `!false` true, `!true` false. Ye camera controls globally disable nahi karta.

```jsx
  >
    <boxGeometry />
    <meshMatcapMaterial matcap={matcap} color={hovered ? "#ffc1df" : "white"} />
  </mesh>
);
}
```

`>` opening mesh tag complete. Default box side lengths 1 hain, scale actual size decide karta hai. Matcap texture baked surface appearance deta hai; scene lights matcap ko relight nahi karti. White neutral tint, hover light-pink tint. Closing tags/parentheses return aur component complete karte hain.

## 8. SpiralStream: ek color ki poori stream

```jsx
function SpiralStream({ color, matcap: image, phase }) {
  const matcap = useTexture(image);
```

Destructuring mein `matcap: image` incoming matcap URL ko local naam image deta hai. `useTexture(image)` se loaded texture milta hai. Ek stream ke cubes same texture use karte hain.

```jsx
const [cubes] = useState(() =>
  Array.from({ length: CUBES_PER_STREAM }, (_, index) => ({
    start: index / CUBES_PER_STREAM,
    size: 0.07 + Math.random() * 0.075,
    spin: 0.4 + Math.random(),
    offset: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
  })),
);
```

Lazy state initializer initial recipes banata hai; ordinary rerenders par reuse hoti hain. `Array.from` 110 items generate karta hai. Index zero se start. `start` path par evenly spaced starting locations deta hai, isliye scene load par stream already filled hai.

Random size 0.07 se 0.145 se chhota; spin 0.4 se 1.4 se chhota. Offset ke three random values roughly -0.5 to 0.5 hain. `({ ... })` arrow function se object directly return karta hai. Setter unused hai kyunki recipes update nahi kar rahe.

```jsx
const [points] = useState(() =>
  Array.from({ length: 301 }, (_, index) => getSpiralPosition(index / 300, phase)),
);
```

301 sampled positions, including progress 0 aur 1, line path banati hain. 301 count, 300 divisor intentional hai: indices 0...300. Static stream phase ke liye points once store hote hain. Future mein phase prop dynamically change karoge toh stored points regenerate karne ka logic bhi chahiye.

```jsx
return (
  <group>
    <Line points={points} color={color} lineWidth={9} transparent opacity={0.07} depthWrite={false} />
    <Line points={points} color={color} lineWidth={3} transparent opacity={0.2} depthWrite={false} />
    <Line points={points} color={color} lineWidth={1} transparent opacity={0.85} depthWrite={false} />
```

Group invisible container hai. Teen lines same path par hain: wide faint halo, medium layer, thin bright center. `points` addresses connect hote hain. `lineWidth` screen-space line width hai. `transparent` opacity enable karta hai, `opacity` strength set karta hai. `depthWrite={false}` transparent halo ko depth buffer mein solid blocker jaisa likhne se rokta hai; depth testing still enabled hai.

Ye simple luminous appearance hai, **actual bloom nahi**. Line meshes light emit karke character ko illuminate nahi karte.

```jsx
    {cubes.map((cube, index) => (
      <SpiralCube key={index} {...cube} phase={phase} matcap={matcap} />
    ))}
  </group>
);
}
```

`.map` recipes se components banata hai. `key` React identity hai; fixed non-reordered list mein index use hua hai. `{...cube}` start, size, spin aur offset props pass karta hai. Phase aur texture stream se separately milte hain. Closing punctuation map, group aur component close karti hai.

## 9. SpaceDust: wallpaper ke bina background specks

```jsx
function SpaceDust() {
  const [particles] = useState(() =>
    Array.from({ length: 180 }, () => ({
      position: [(Math.random() - 0.5) * 26, (Math.random() - 0.5) * 20, -5 - Math.random() * 8],
      size: 0.008 + Math.random() * 0.018,
    })),
  );
```

180 static particle recipes once generate hoti hain. X roughly -13...13, Y -10...10, Z -5...-13 (default camera se peeche). Size tiny hai. Ye simulated physics particles nahi, simple decorative boxes hain.

```jsx
  return particles.map((particle, index) => (
    <mesh key={index} position={particle.position} scale={particle.size}>
      <boxGeometry />
      <meshBasicMaterial color="#a6b3c8" />
    </mesh>
  ));
}
```

Har recipe ek mesh banati hai. Basic material ko lights ki need nahi. No useFrame here, so specks static hain; orbit camera ki wajah se viewpoint change ho sakta hai.

## 10. App aur SpiralStreams: scene assembly

```jsx
function App() {
  return (
    <Canvas camera={{ position: [0, 2, 19], fov: 50 }} dpr={[1, 1.5]}>
```

Camera thoda upar/peeche hai, tall spiral fit karne ke liye. FOV 50 vertical degrees hai. `dpr` pixel ratio 1–1.5 range mein limit karta hai; high-density displays par rendering cost control hoti hai. Double braces camera prop ke andar JS object hain.

```jsx
<color attach="background" args={["#080c15"]} />
<ambientLight intensity={1.3} />
<directionalLight position={[3, 6, 5]} intensity={2} />
<SpaceDust />
```

Dark scene background set hota hai; wallpaper removed hai. Ambient light base illumination, directional light model ko directional shading deti hai. Matcap cubes aur basic dust lights par depend nahi karte. SpaceDust component tiny specks add karta hai.

```jsx
<Suspense fallback={null}>
  <Character />
  <group position={EMISSION_POINT}>
    {STREAMS.map((stream) => <SpiralStream key={stream.color} {...stream} />)}
  </group>
</Suspense>
```

Assets loading ke dauraan boundary ke contents ki jagah nothing (`null`) render hota hai. Ye error handler nahi. Character aur streams ready hone par show honge. Emission group local path origin ko fingertip ke paas translate karta hai. `map` three settings se three streams banata hai.

```jsx
<OrbitControls target={[0, 1.5, 0]} minDistance={8} maxDistance={30} />
</Canvas>
);
}
export default App;
```

Orbit target scene center se thoda upar hai. Distance limits camera-to-target distance constrain karti hain. Closing lines JSX aur function finish karti hain. Default export main.jsx ko App import karne deta hai.

## 11. main.jsx aur CSS

`import { createRoot } from 'react-dom/client'` React DOM mount tool laata hai. `import './index.css'` stylesheet apply karta hai. `import App from './App.jsx'` main component laata hai.

`createRoot(document.getElementById('root')).render(<App />)` HTML ka root element dhoondhkar App render karta hai. React DOM root ke andar Canvas apna 3D rendering setup banata hai.

CSS mein `html, body, #root` selectors par `margin: 0` default gaps remove, `width: 100%` available width fill, `height: 100%` full-height chain set karte hain. `canvas { display: block; }` inline baseline gap avoid karta hai. App.css current entry flow mein imported nahi hai.

## 12. Safely experiment karo

| Setting | Meaning |
| --- | --- |
| CUBES_PER_STREAM | Har color mein cube count; 80 means 240 total. |
| delta × 0.035 | Travel speed; 0.02 slower, 0.05 faster. |
| angle mein 2.2 | Number of spiral turns. |
| radius mein 5.4 | Upper outer width. |
| Y mein progress × 8 | Overall height. |
| dip mein 3.3 | Model ke around downward bend. |
| Line opacity/width | Ribbon brightness/thickness appearance. |
| EMISSION_POINT | Fixed fingertip alignment. |

Ek setting ek baar change karo. `npm run lint` code rules check, `npm run build` production bundle check. Browser mein look check karna alag step hai. No custom shaders, bloom pipeline, physics ya instancing added. New main concepts sine/cosine path aur Drei Line hain.


### Clean App mein streams kaise aati hain?

App mein ab `<SpiralStreams />` hai. Ye component `src/config/streams.js` se `STREAMS` aur `EMISSION_POINT` import karta hai. Uske andar wahi `<group position={EMISSION_POINT}>` aur `.map()` loop hai jo upar explain hua. App ko cube loop aur texture details yaad rakhne ki zaroorat nahi; woh sirf scene arrange karta hai. Animation formulas aur settings is refactor mein change nahi hui hain.


## Update: six matcaps aur automatic phases

Ab `src/config/streams.js` mein matcap4 (chrome), matcap5 (red), matcap6 (green) bhi import hain. Total 6 streams, har stream mein 110 cubes: 660 animated cubes. Upar ke three-stream examples previous configuration explain karte hain; current source of truth config file hai.

`MATCAP_STREAMS` har stream ka color aur matcap URL rakhta hai. `STREAMS` is array se generate hota hai:

```js
export const STREAMS = MATCAP_STREAMS.map((stream, index) => ({
  ...stream,
  phase: (index / MATCAP_STREAMS.length) * Math.PI * 2,
}));
```

- `.map()` har entry se naya object banata hai.
- `...stream` us entry ka color aur matcap copy karta hai.
- `index / MATCAP_STREAMS.length` circle ka fraction hai.
- `Math.PI * 2` full circle hai. Six streams par offsets 0°, 60°, 120°, 180°, 240°, 300° hain.
- Nayi image import karke `MATCAP_STREAMS` mein unique ribbon color ke saath entry add karo; manual phases edit nahi karne padenge.
