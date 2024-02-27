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
  Image,
} from "antd";
import { Link } from "react-router-dom";
import {
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  LinkedinFilled,
  InstagramOutlined,
} from "@ant-design/icons";
import "./Layout.css";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const OverallLayout = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          // colorPrimary: "#FCFBF8",
          borderRadius: 2,

          // Alias Token
          colorBgContainer: "#FCFBF8",
          fontSize: 14,
          colorLink: "black",
          fontFamily: "Poppins, sans-serif",
        },
        components: {
          Layout: {
            headerBg: "#FCFBF8",
            bodyBg: "#FCFBF8",
            headerHeight: 84,
          },
          Menu: {
            horizontalItemSelectedColor: "#98BDD2",
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
            padding: "38px 100px",
          }}
        >
          <Link to="/">
            <Image
              alt="logo"
              src={require("./images/logopngResize.png")}
              width={100}
              height={50}
              preview={false}
            />
          </Link>

          <div style={{ width: "48px" }}></div>
          <Menu
            mode="horizontal"
            style={{ flex: 1, minWidth: 0, display: "block" }}
          >
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="classes">
              <Link to="/classes">Classes</Link>
            </Menu.Item>
            <Menu.Item key="plan">
              <Link to="/plans">Plans</Link>
            </Menu.Item>
            <Menu.Item key="login" style={{ float: "right" }}>
              <Link to="/login">Login</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: "0 100px" }}>
          <div
            style={{
              margin: "16px 0",
              padding: 24,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ background: "#FCFBF8", padding: "0 100px" }}>
          <Divider></Divider>
          <Flex style={{ width: "100%" }}>
            <Flex style={{ width: "10%", justifyContent: "flex-start" }}>
              <Link to="/">
                <Image
                  alt="logo"
                  src={require("./images/logopngResize.png")}
                  width={100}
                  height={50}
                  preview={false}
                />
              </Link>
            </Flex>

            <Flex
              style={{ right: 0, width: "90%", justifyContent: "flex-end" }}
            >
              <Flex vertical gap="large" style={{ width: "15%" }}>
                <Link to="/classes">Classes</Link>
                <Link to="/plans">Plans</Link>
                {/* <Link to="/contactus">ContactUs</Link> */}
              </Flex>

              <Flex vertical gap="large" style={{ width: "15%" }}>
                <Space direction="horizontal">
                  <MailOutlined />
                  <Link to="mailto:hello@juniorpass.sg">
                    hello@juniorpass.sg
                  </Link>
                </Space>
                <Flex vertical={false} gap="large" style={{ width: "15%" }}>
                  <Space direction="horizontal">
                    <FacebookFilled />
                  </Space>

                  <Space direction="horizontal">
                    <InstagramOutlined />
                  </Space>

                  <Space direction="horizontal">
                    <LinkedinFilled />
                  </Space>
                </Flex>

                {/* <Space direction="horizontal">
                  <PhoneOutlined />
                  <Text>(65)XXXX-XXXX</Text>
                </Space>

                <Space direction="horizontal">
                  <WhatsAppOutlined />
                  <Text>(65)XXXX-XXXX</Text>
                </Space> */}
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
