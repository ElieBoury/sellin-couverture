import Home from "@/containers/Home/Home";
import { getWebSite } from "@/lib/webSite";

export default async function Page() {
  const webSite = (await getWebSite()) ?? {};

  return <Home webSite={webSite} />;
}
