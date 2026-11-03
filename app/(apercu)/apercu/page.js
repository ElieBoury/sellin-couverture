import Home from "@/containers/Home/Home";
import { getWebSite } from "@/lib/webSite";

export const dynamic = "force-dynamic";

export default async function ApercuPage() {
  const webSite = (await getWebSite({ isFresh: true })) ?? {};

  return <Home webSite={webSite} />;
}
