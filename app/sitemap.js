export default async function sitemap() {
  let sitemap = [
    {
      url: process.env.NEXT_PUBLIC_WEBSITE_URL + "/",
      lastModified: process.env.CREATED_AT,
      changeFrequency: "yearly",
      priority: 1,
    },
  ];

  return sitemap;
}
