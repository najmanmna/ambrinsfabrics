import { defineLive } from "next-sanity";
import { client } from "./client";
import { draftMode } from "next/headers"; // 👈 Added this import

// Use the dummy token during build to prevent the "Missing Token" crash
const token = process.env.SANITY_API_READ_TOKEN || "dummy_token_for_build";

if (!token) {
  throw new Error("Missing SANITY_API_READ_TOKEN");
}

// 1. Rename the original fetcher to 'originalSanityFetch'
const { sanityFetch: originalSanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: {
    revalidate: 0,
  },
});

// 2. Export SanityLive component as is
export { SanityLive };

// 3. Export a custom wrapper for sanityFetch
export const sanityFetch = async (args: any) => {
  try {
    // In Next.js 15, we must await draftMode()
    // If this call fails (during static build), we catch the error below
    await draftMode();
    
    // If draftMode works, we are in a request, so use the Live fetcher
    return await originalSanityFetch(args);
  } catch (error) {
    // 🛑 BUILD TIME FALLBACK 🛑
    // If draftMode crashed, we are generating static pages.
    // Use the basic 'client' to fetch data without checking draft mode.
    const data = await client.fetch(args.query, args.params);
    return { data };
  }
};