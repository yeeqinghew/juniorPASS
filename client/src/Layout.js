import "./App.css";
import React from "react";
import { Layout, Menu, ConfigProvider } from "antd";

const { Header, Content, Footer } = Layout;

const items = [
  { key: String("Home"), label: `Home` },
  { key: String("Classes"), label: `Classes` },
  { key: String("Plan"), label: `Plan` },
  { key: String("Contact Us"), label: `Contact Us` },
];

const rightMenu = [{ key: String("Login"), label: `Login` }];

const OverallLayout = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          //   colorPrimary: "#FCFBF8",
          borderRadius: 2,

          // Alias Token
          //   colorBgContainer: "#FCFBF8",
          fontSize: 14,
        },
        components: {
          Layout: {
            /* here is your component tokens */
            headerBg: "#FCFBF8",
            bodyBg: "#FCFBF8",
          },
        },
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FCFBF8",
          }}
        >
          <img
            alt="logo"
            src={require("./images/juniorPASS.png")}
            width="180"
          />
          <Menu
            mode="horizontal"
            items={items}
            style={{ flex: 1, minWidth: 0 }}
          />
          <Menu items={rightMenu} style={{ float: "right" }} />
        </Header>

        <Content style={{ padding: "0 48px" }}>
          <div
            style={{
              margin: "16px 0",
              padding: 24,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          juniorPASS © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default OverallLayout;
