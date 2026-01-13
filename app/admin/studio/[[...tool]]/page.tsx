"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

// 1. Force Static Mode
export const dynamicParams = true; 

// 2. This is the Magic Fix:
// By returning an empty array, we tell Next.js to pre-build this page.
// This moves it from the "3MB Function Limit" to the "Unlimited Asset Limit".
export function generateStaticParams() {
  return [];
}

// Dynamically import NextStudio so it runs only in browser
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}