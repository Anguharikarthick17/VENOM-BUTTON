import { Metadata } from "next";
import { getPublishedProjects } from "@/lib/freeCodeDb";
import { FreeCodeClientView } from "@/components/free-code/FreeCodeClientView";

export const metadata: Metadata = {
  title: "Numbered Free Code Vault | GENZLOG",
  description:
    "Open source frontend code repositories accompanying our Instagram Reels. Search by permanent Reel number or project name to access tested source code directly on GitHub.",
  openGraph: {
    title: "Numbered Free Code Vault | GENZLOG",
    description:
      "Open source frontend code repositories accompanying our Instagram Reels. Search by permanent Reel number or project name.",
    url: "https://genzlog.com/free-code",
  },
};

export default async function FreeCodePage() {
  const publishedProjects = await getPublishedProjects();

  return <FreeCodeClientView initialProjects={publishedProjects} />;
}
