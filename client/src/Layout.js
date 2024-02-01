import "./App.css";
import React from "react";
import { Layout, Menu, ConfigProvider, Divider, Flex } from "antd";
import { Link } from "react-router-dom";
import {
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const items = [
  { key: String("Home"), label: <Link to="/">Home</Link> },
  { key: String("Classes"), label: <Link to="/classes">Classes</Link> },
  { key: String("Plan"), label: <Link to="/plans">Plans</Link> },
  { key: String("Contact Us"), label: <Link to="/contactus">ContactUs</Link> },
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
          colorBgContainer: "#FCFBF8",
          fontSize: 14,
        },
        components: {
          Layout: {
            headerBg: "#FCFBF8",
            bodyBg: "#FCFBF8",
            headerHeight: 84,
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
          <img alt="logo" src={require("./images/logopng.png")} width="180" />
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
        <Footer style={{ background: "#FCFBF8" }}>
          <Divider></Divider>
          <Flex vertical={false}>
            <Flex style={{ width: "30%" }}>
              <img
                alt="logo"
                src={require("./images/logopng.png")}
                width="180"
              />
            </Flex>

            <Flex vertical={false} style={{ right: 0, width: "100%" }}>
              <Flex
                vertical
                gap="large"
                style={{ width: "50%", textDecoration: "none" }}
              >
                <Link to="/classes">Classes</Link>
                <Link to="/plans">Plans</Link>
                <Link to="/contactus">ContactUs</Link>
              </Flex>
              <Flex vertical gap="large" style={{ width: "50%" }}>
                <Flex>
                  <MailOutlined />
                  <Link to="mailto:hello@juniorpass.sg">
                    hello@juniorpass.sg
                  </Link>
                </Flex>

                <Link to="">
                  <PhoneOutlined />
                  (65)XXXX-XXXX
                </Link>
                <Link to="">
                  <WhatsAppOutlined />
                  (65)XXXX-XXXX
                </Link>
              </Flex>
            </Flex>
          </Flex>
          <Divider></Divider>© Copyright {new Date().getFullYear()} juniorPASS
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default OverallLayout;
