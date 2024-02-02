import "./App.css";
import React from "react";
import {
  Layout,
  Menu,
  ConfigProvider,
  Divider,
  Flex,
  Typography,
  Space,
} from "antd";
import { Link } from "react-router-dom";
import {
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const items = [
  { key: String("Home"), label: <Link to="/">Home</Link> },
  { key: String("Classes"), label: <Link to="/classes">Classes</Link> },
  { key: String("Plan"), label: <Link to="/plans">Plans</Link> },
  { key: String("Contact Us"), label: <Link to="/contactus">ContactUs</Link> },
];

const rightMenu = [
  { key: String("Login"), label: <Link to="/login">Login</Link> },
];

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
          colorLink: "black",
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
          <img
            alt="logo"
            src={require("./images/logopngResize.png")}
            width="100"
          />
          <div style={{ width: "48px" }}></div>
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
          <Flex style={{ width: "100%" }}>
            <Flex style={{ width: "10%", justifyContent: "flex-start" }}>
              <img
                alt="logo"
                src={require("./images/logopngResize.png")}
                width="100"
                height="50"
              />
            </Flex>

            <Flex
              style={{ right: 0, width: "90%", justifyContent: "flex-end" }}
            >
              <Flex vertical gap="large" style={{ width: "25%" }}>
                <Link to="/classes">Classes</Link>
                <Link to="/plans">Plans</Link>
                <Link to="/contactus">ContactUs</Link>
              </Flex>
              <Flex vertical gap="large" style={{ width: "25%" }}>
                <Space direction="horizontal">
                  <MailOutlined />
                  <Link to="mailto:hello@juniorpass.sg">
                    hello@juniorpass.sg
                  </Link>
                </Space>

                <Space direction="horizontal">
                  <PhoneOutlined />
                  <Text>(65)XXXX-XXXX</Text>
                </Space>

                <Space direction="horizontal">
                  <WhatsAppOutlined />
                  <Text>(65)XXXX-XXXX</Text>
                </Space>
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