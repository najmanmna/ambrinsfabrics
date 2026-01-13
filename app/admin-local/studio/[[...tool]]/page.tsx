import Studio from "./Studio";

// 1. Force Static Mode for Cloudflare
export const dynamic = "force-static";

// 2. Set the Title manually (Optional but nice)
export const metadata = {
  title: "Sanity Studio",
};

// 3. The Fix: Generate static params to make this a "Static Asset" (Unlimited Size)
export function generateStaticParams() {
  return [];
}

export default function StudioPage() {
  return <Studio />;
}