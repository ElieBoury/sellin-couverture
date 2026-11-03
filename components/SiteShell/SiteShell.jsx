import "@/app/globals.css";
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

export default function SiteShell({ webSite, children }) {
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
