import Home from "@/containers/Home/Home";
import { getWebSite } from "@/lib/webSite";
import {
  buildLocalPageTitle,
  hasLocalPages,
  resolveLocalPage,
} from "@/lib/localPages";
import { notFound } from "next/navigation";

export const dynamicParams = true;

const resolvePage = async (slug) => {
  const webSite = await getWebSite();
  if (!webSite || !hasLocalPages(webSite)) return { status: "notFound" };

  return { webSite, ...resolveLocalPage(webSite, slug) };
};

const resolveFoundPage = async (slug) => {
  const localPage = await resolvePage(slug);
  if (localPage.status === "notFound") notFound();
  return localPage;
};

export async function generateMetadata({ params }) {
  const localPage = await resolvePage((await params).slug);
  if (localPage.status !== "found") return {};

  const { webSite, city, service } = localPage;
  const title = buildLocalPageTitle({ webSite, city, service });

  return {
    title: title || webSite.metaTitle,
    description: city?.metaDescription || webSite.metaDescription,
  };
}

export default async function Page({ params }) {
  const { webSite, city, service } = await resolveFoundPage((await params).slug);

  return <Home webSite={webSite} currentCity={city} currentService={service} />;
}
