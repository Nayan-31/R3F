# React Three Fiber Learning

React aur Vite par bana 3D playground: rotating cubes, hover par hot pink color, click par size toggle, aur pointer se camera movement.

## Run locally

```bash
npm install
npm run dev
```

## `useThree` kya karta hai?

`useThree` khud camera controller nahi hai. Ye React Three Fiber ki state access karne ka hook hai. Is project mein hum isse `camera` aur `pointer` lete hain.

- `camera`: scene dekhne wala camera, jiski position hum change karte hain.
- `pointer`: normalized pointer coordinates. Canvas ke andar X/Y roughly `-1` se `1` tak hote hain; center par `0`.
- `useFrame`: har rendered frame par callback chalata hai, jisse camera latest pointer position follow karta hai.

In hooks ko use karne wala component `<Canvas>` ke andar render hona chahiye.

## Example: pointer-follow camera

```jsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";

function CameraController() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x = pointer.x * 0.5;
    camera.position.y = pointer.y * 0.5;
  });

  return null;
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 5]} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <CameraController />
    </Canvas>
  );
}
```

Pointer right jaayega toh camera ka X positive hoga; left jaayega toh negative. Y bhi pointer ke according change hoga. `0.5` movement ki range control karta hai: camera ka X/Y roughly `-0.5` se `0.5` tak jaayega. Z position `5` hi rehti hai.

Yahaan direct position assign ho rahi hai, smoothing nahi. `delta` se multiply karne ki zaroorat nahi hai, kyunki hum absolute position set kar rahe hain; rotation animation ki tarah har frame distance add nahi kar rahe.

## `OrbitControls` ke saath movement stuck kyun lagti hai?

Agar same camera ke liye dono components render kar do:

```jsx
<CameraController />
<OrbitControls />
```

Toh dono camera ko update karne ki koshish karte hain:

1. `OrbitControls` drag, zoom aur pan ke according camera move karta hai.
2. Hamara `CameraController` har frame camera ka X/Y pointer ki values par set kar deta hai.
3. Orbit interaction se aayi X/Y position overwrite ho jaati hai. Isliye movement restricted, jumpy ya stuck lag sakti hai.

Example: orbit drag camera ka X `2` karna chahta hai, lekin pointer ka X `0.4` hai. Hamara controller X wapas `0.4 * 0.5 = 0.2` set kar dega. Dono updates ka intention alag hai, isliye expected orbit movement nahi milti.

Is conflict mein mouse cursor khud freeze nahi hota; scene ki camera movement stuck jaisi dikhti hai.

## Solution: ek time par ek camera controller

### Option 1: pointer-follow movement

Existing `<Canvas>` ke andar ye rakho:

```jsx
<CameraController />
{/* <OrbitControls /> */}
```

Ye current project ka setup hai. Pointer move karne se camera ka X/Y change hota hai.

### Option 2: orbit, zoom aur pan

Pehle import karo:

```jsx
import { OrbitControls } from "@react-three/drei";
```

Phir existing `<Canvas>` mein custom controller ki jagah ye rakho:

```jsx
{/* <CameraController /> */}
<OrbitControls />
```

Ab camera movement `OrbitControls` handle karega.

### Optional example: React state se mode switch

Ye snippets ek optional extension hain; current app mein mode toggle implement nahi hai.

`useState` import karke `App` ke andar state rakho:

```jsx
const [cameraMode, setCameraMode] = useState("pointer");
```

Normal React DOM mein, `<Canvas>` ke bahar button rakho:

```jsx
<button
  onClick={() =>
    setCameraMode((mode) => (mode === "pointer" ? "orbit" : "pointer"))
  }
>
  Switch to {cameraMode === "pointer" ? "orbit" : "pointer"} mode
</button>
```

Aur `<Canvas>` ke andar sirf selected controller render karo:

```jsx
{cameraMode === "pointer" ? <CameraController /> : <OrbitControls />}
```

Isse ek time par sirf ek controller camera update karega. Ye basic toggle camera reset ya smooth transition nahi karta. Pointer mode mein lautne par X/Y turant pointer ke according set honge; orbit mode se aayi Z position aur orientation reh sakti hai.

## Kya `useThree` aur `OrbitControls` incompatible hain?

Nahi. `useThree` ko `OrbitControls` ke saath use karna valid hai. Problem tab aati hai jab custom code aur orbit controls same camera ki position ya rotation ko independently update karte hain.

Dono behaviors combine karna possible hai, lekin camera updates aur controls ke target ko coordinate karna padta hai. Is learning example mein ek time par ek controller rakhna simple solution hai. Sirf `OrbitControls` import karne se conflict nahi hota; active component render hone par camera control hota hai.

Official references: [React Three Fiber hooks](https://r3f.docs.pmnd.rs/api/hooks) aur [Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html).
