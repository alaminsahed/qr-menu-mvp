import type { NextConfig } from "next";

function getSupabaseImageHost() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return null;
  }
}

const supabaseImageHost = getSupabaseImageHost();

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseImageHost
        ? [{ protocol: "https" as const, hostname: supabaseImageHost }]
        : []),
    ],
  },
};

export default nextConfig;
