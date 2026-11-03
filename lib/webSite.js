// Transitoire : l'API renvoie `services` ; repli sur l'ancien nom `products`,
// puis sur les anciens champs service1-3 tant que la migration n'a pas eu lieu
const buildLegacyServices = (webSite) =>
  [1, 2, 3]
    .filter((number) => webSite[`service${number}Title`])
    .map((number) => ({
      title: webSite[`service${number}Title`],
      homeDescription: webSite[`service${number}Desc`] ?? null,
    }));

const withServices = (webSite) => {
  const services = webSite.services ?? webSite.products ?? [];
  return {
    ...webSite,
    services: services.length ? services : buildLegacyServices(webSite),
  };
};

export async function getWebSite({ isFresh = false } = {}) {
  if (!process.env.WEBSITE_ID) return null;

  try {
    const res = await fetch(
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:3002"
        : "https://artilis.fr") +
        "/api/websites?website=" +
        process.env.WEBSITE_ID +
        (isFresh ? "&fresh=" + Date.now() : ""),
      isFresh ? { cache: "no-store" } : { next: { revalidate: 60 } },
    );

    if (!res.ok) return null;

    return withServices(await res.json());
  } catch (error) {
    return null;
  }
}
