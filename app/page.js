import Home from "@/containers/Home/Home";

export default async function Page() {
  const webSite = await (
    await fetch(
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:3002"
        : "https://artilis.fr") +
        "/api/websites?website=" +
        process.env.WEBSITE_ID
    )
  ).json();

  return <Home webSite={webSite} />;
}
