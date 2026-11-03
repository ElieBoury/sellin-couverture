import Script from "next/script";
import SiteShell from "@/components/SiteShell/SiteShell";
import { getWebSite } from "@/lib/webSite";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aperçu",
  robots: { index: false, follow: false },
};

export default async function ApercuLayout({ children }) {
  const webSite = (await getWebSite({ isFresh: true })) ?? {};

  return (
    <SiteShell webSite={webSite}>
      {children}
      <Script src="/builder-bridge.js" strategy="afterInteractive" />
    </SiteShell>
  );
}
