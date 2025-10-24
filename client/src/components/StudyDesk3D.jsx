// components/StudyDesk3D.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

function Book({ position, title, summary, url }) {
  const handleClick = () => {
    if (url) window.open(url, "_blank"); // open external link
    else alert(summary || "No notes available");
  };

  return (
    <mesh position={position} onClick={handleClick} scale={[1, 1, 1]}>
      <boxGeometry args={[1, 0.2, 1.5]} />
      <meshStandardMaterial color="orange" />
      <Html distanceFactor={10}>
        <div className="text-xs text-black dark:text-white text-center">{title}</div>
      </Html>
    </mesh>
  );
}

export default function StudyDesk3D({ books }) {
  if (!books || !books.length) return <p className="text-gray-500">No study materials yet.</p>;

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        {books.map((b, idx) => (
          <Book
            key={b.id}
            position={[idx * 2 - books.length, 1, 0]}
            title={b.title}
            summary={b.summary}
            url={b.url}
          />
        ))}
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
