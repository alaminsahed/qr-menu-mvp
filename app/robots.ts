import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://tapbite.org";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/protected/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
