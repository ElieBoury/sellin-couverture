import { getWebSite } from "@/lib/webSite";
import { getMainCity } from "@/lib/localPages";
import SiteShell from "@/components/SiteShell/SiteShell";

export async function generateMetadata({ params, searchParams }, parent) {
  const webSite = await getWebSite();
  if (!webSite) return {};

  const mainCity = getMainCity(webSite);
  const description = mainCity?.metaDescription || webSite.metaDescription;

  return {
    title: webSite.metaTitle,
    description,
    authors: [{ name: "Artilis", url: "https://artilis.fr" }],
    creator: "Artilis",
    openGraph: {
      images: [webSite.logo, webSite.bannerPhoto],
      title: webSite.metaTitle,
      description,
      url: "https://artilis.fr",
      siteName: webSite.companyName,
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }) {
  const webSite = (await getWebSite()) ?? {};

  return <SiteShell webSite={webSite}>{children}</SiteShell>;
}
