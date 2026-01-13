"use client";

import dynamic from "next/dynamic";

// 👇 CHANGE THIS LINE.
// Use '@/' to point directly to the root folder.
import config from "@/sanity.config"; 

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function Studio() {
  return <NextStudio config={config} />;
}