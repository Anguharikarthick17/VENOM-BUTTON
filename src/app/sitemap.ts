import { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/freeCodeDb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://genzlog.com";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/free-code`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  let publishedProjects: { slug?: string; reelNumber: string }[] = [];
  try {
    publishedProjects = await getPublishedProjects();
  } catch {
    publishedProjects = [];
  }

  const resourcePages = publishedProjects.map((res) => ({
    url: `${baseUrl}/free-code/${res.slug || res.reelNumber}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...resourcePages];
}
