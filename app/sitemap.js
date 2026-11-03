import { getWebSite } from "@/lib/webSite";
import { listLocalPageSlugs } from "@/lib/localPages";

export default async function sitemap() {
  const webSite = await getWebSite();

  let sitemap = [
    {
      url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/",
      lastModified: process.env.CREATED_AT,
      changeFrequency: "yearly",
      priority: 1,
    },
  ];

  const localPages = webSite
    ? listLocalPageSlugs(webSite).map((slug) => ({
        url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/" + slug,
        lastModified: process.env.CREATED_AT,
        changeFrequency: "yearly",
        priority: 0.8,
      }))
    : [];

  return [...sitemap, ...localPages];
}
