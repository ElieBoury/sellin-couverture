import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import { App, ConfigProvider, Layout } from "antd";
import frFR from "antd/locale/fr_FR";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Content } from "antd/lib/layout/layout";
import GoogleProvider from "@/providers/GoogleProvider";
config.autoAddCss = false;

export async function generateMetadata({ params, searchParams }, parent) {
  const webSite = await (
    await fetch(
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:3002"
        : "https://artilis.fr") +
        "/api/websites?website=" +
        process.env.WEBSITE_ID
    )
  ).json();

  return {
    title: webSite.metaTitle,
    description: webSite.metaDescription,
    authors: [{ name: "Artilis", url: "https://artilis.fr" }],
    creator: "Artilis",
    openGraph: {
      images: [webSite.logo, webSite.bannerPhoto],
      title: webSite.metaTitle,
      description: webSite.metaDescription,
      url: "https://artilis.fr",
      siteName: webSite.companyName,
      locale: "fr_FR",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }) {
  const webSite = await (
    await fetch(
      (process.env.NODE_ENV !== "production"
        ? "http://localhost:3002"
        : "https://artilis.fr") +
        "/api/websites?website=" +
        process.env.WEBSITE_ID
    )
  ).json();

  console.log(webSite);

  return (
    <html lang="fr">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "black",
              },
              components: {
                Layout: {},
                Carousel: {
                  arrowSize: 30,
                  arrowOffset: 20,
                },
              },
            }}
            locale={frFR}
          >
            <App>
              <StyledComponentsRegistry>
                <Layout>
                  <Header webSite={webSite} />
                  <GoogleProvider>
                    <Content style={{ padding: 0 }}>{children}</Content>
                  </GoogleProvider>
                  <Footer webSite={webSite} />
                </Layout>
              </StyledComponentsRegistry>
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
