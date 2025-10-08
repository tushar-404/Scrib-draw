"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Island from "./components/Canvas/Island";
import CharacteristicsIsland from "./components/Canvas/Characteristics";
import CollaborationManager from "./components/Canvas/Collaboration";
import PhonePage from "./components/PhonePage";

const Canvas = dynamic(() => import("./components/Canvas/Canvas"), {
  ssr: false,
});

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 350);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return <PhonePage />;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        <Island />
        <CharacteristicsIsland />
        <CollaborationManager />
      </div>

      <div className="z-0">
        <Canvas />
      </div>
    </>
  );
}
