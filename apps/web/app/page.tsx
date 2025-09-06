"use client";
import dynamic from "next/dynamic";
import React from "react";

const Canvas = dynamic(() => import("./components/Canvas/Canvas"), { ssr: false });

export default function Home() {
  return <Canvas />;
}
