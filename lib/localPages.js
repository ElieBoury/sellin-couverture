export const LOCAL_PAGE_SEPARATOR = "-a-";

export const buildSlug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildLocalPageSlug = (serviceSlug, citySlug) =>
  serviceSlug + LOCAL_PAGE_SEPARATOR + citySlug;

export const hasLocalPages = (webSite) =>
  Boolean(webSite?.cities?.length || webSite?.services?.length);

export const getMainCity = (webSite) =>
  webSite?.cities?.find(({ isMain }) => isMain) ?? null;

export const getMainJobSlug = (webSite) =>
  webSite?.mainJob ? buildSlug(webSite.mainJob) : null;

const resolveCitySlug = (webSite, citySlug) => {
  const city = webSite.cities?.find(({ slug }) => slug === citySlug);
  return city ? { city, citySlug } : null;
};

const resolveServiceSlug = (webSite, serviceSlug) => {
  if (serviceSlug === getMainJobSlug(webSite)) {
    return { service: null, serviceSlug };
  }
  const service = webSite.services?.find(({ slug }) => slug === serviceSlug);
  return service ? { service, serviceSlug } : null;
};

const splitPositions = (slug) => {
  const positions = [];
  let position = slug.indexOf(LOCAL_PAGE_SEPARATOR);
  while (position !== -1) {
    positions.push(position);
    position = slug.indexOf(LOCAL_PAGE_SEPARATOR, position + 1);
  }
  return positions;
};

export const resolveLocalPage = (webSite, slug) => {
  const plainService = webSite.services?.find(
    (service) => service.slug === slug,
  );
  if (plainService) {
    return { status: "found", city: null, service: plainService };
  }
  for (const position of splitPositions(slug)) {
    const resolvedService = resolveServiceSlug(webSite, slug.slice(0, position));
    const resolvedCity = resolveCitySlug(
      webSite,
      slug.slice(position + LOCAL_PAGE_SEPARATOR.length),
    );
    if (!resolvedService || !resolvedCity) continue;
    return {
      status: "found",
      city: resolvedCity.city,
      service: resolvedService.service,
    };
  }
  return { status: "notFound" };
};

export const listLocalPageSlugs = (webSite) => {
  const serviceSlugs = [
    getMainJobSlug(webSite),
    ...(webSite.services ?? []).map(({ slug }) => slug),
  ].filter(Boolean);
  return [
    ...(webSite.services ?? []).map(({ slug }) => slug),
    ...(webSite.cities ?? []).flatMap(({ slug: citySlug }) =>
      serviceSlugs.map((serviceSlug) =>
        buildLocalPageSlug(serviceSlug, citySlug),
      ),
    ),
  ];
};

export const buildLocalPageTitle = ({ webSite, city, service }) =>
  [service?.title ?? (city ? webSite.mainJob : null), city?.name]
    .filter(Boolean)
    .join(" à ");

export const buildServicePageHref = (webSite, service) => {
  const mainCity = getMainCity(webSite);
  return (
    "/" +
    (mainCity ? buildLocalPageSlug(service.slug, mainCity.slug) : service.slug)
  );
};
