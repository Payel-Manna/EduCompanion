// src/components/LandingHero.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion } from "framer-motion";

function FloatingBook({ position, color }) {
  return (
    <mesh position={position} rotation={[0.3, 0.5, 0]}>
      <boxGeometry args={[1, 0.2, 1.5]} />
      <meshStandardMaterial color={color} />
      <Html distanceFactor={10}>
        <div className="text-xs text-black dark:text-white text-center">📘</div>
      </Html>
    </mesh>
  );
}

export default function LandingHero() {
  const books = [
    { position: [-1, 1, 0], color: "#F97316" },
    { position: [1, 1.5, -1], color: "#10B981" },
    { position: [0, 0.5, 1], color: "#3B82F6" },
  ];

  return (
    <section className="h-screen flex flex-col md:flex-row items-center justify-center px-6">
      {/* Text Section */}
      <motion.div
        className="md:w-1/2 mb-10 md:mb-0"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          EduCompanion: Your AI Study Partner
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Upload notes, ask questions, take quizzes, and track your learning—all in one interactive platform.
        </p>
      </motion.div>

      {/* 3D Canvas */}
      <div className="md:w-1/2 h-80 md:h-96 rounded-xl shadow-lg">
        <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          {books.map((b, idx) => (
            <FloatingBook key={idx} position={b.position} color={b.color} />
          ))}
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
    </section>
  );
}
