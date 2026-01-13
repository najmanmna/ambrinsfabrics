// sanity/env.ts
export const apiVersion = "2024-11-09"

// These are public — safe to hardcode for Studio
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vxrs2vrl"
