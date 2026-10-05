export async function getWebSite() {
  if (!process.env.WEBSITE_ID) return null;

  try {
    const res = await fetch(
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:3002"
        : "https://artilis.fr") +
        "/api/websites?website=" +
        process.env.WEBSITE_ID,
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    return null;
  }
}
