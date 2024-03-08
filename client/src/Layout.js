import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  ConfigProvider,
  Divider,
  Flex,
  Typography,
  Space,
  Image,
  Drawer,
} from "antd";
import { Link } from "react-router-dom";
import {
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  LinkedinFilled,
  InstagramOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import "./Layout.css";
import { googleLogout } from "@react-oauth/google";
import useWindowDimensions from "./hooks/useWindowDimensions";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const OverallLayout = ({ isAuthenticated, setAuth, children }) => {
  const [open, setOpen] = useState(false);
  const { height, width } = useWindowDimensions();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAuth(false);
    // logout of Google account
    googleLogout();
    toast.success("Logout successfully");
  };

  const showBurgerMenu = () => {
    setOpen(true);
  };

  const closeBurgerMenu = () => {
    setOpen(false);
  };

  function HeaderConfig() {
    if (width < 1024) {
      return (
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9999,
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FCFBF8",
            padding: "50px",
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
          <Menu
            mode="horizontal"
            style={{ flex: 1, minWidth: 0, display: "block" }}
          >
            <Menu.Item key="menu" style={{ float: "right" }}>
              <MenuOutlined onClick={showBurgerMenu} />
            </Menu.Item>
          </Menu>

          <Drawer
            title=""
            onClose={closeBurgerMenu}
            open={open}
            width={"100vw"}
            zIndex={9999999}
          >
            <Menu
              mode="vertical"
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
              {isAuthenticated ? (
                <>
                  <Menu.Item key="logout" style={{ float: "right" }}>
                    <LogoutOutlined onClick={handleLogout} />
                  </Menu.Item>
                  <Menu.Item key="profile" style={{ float: "right" }}>
                    <Link to="/profile">Profile</Link>
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item key="login" style={{ float: "right" }}>
                  <Link to="/login">Login</Link>
                </Menu.Item>
              )}
            </Menu>
          </Drawer>
        </Header>
      );
    }
    if (1024 <= width) {
      return (
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 9999,
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FCFBF8",
            padding: "50px 150px",
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
            {isAuthenticated ? (
              <>
                <Menu.Item key="logout" style={{ float: "right" }}>
                  <LogoutOutlined onClick={handleLogout} />
                </Menu.Item>
                <Menu.Item key="profile" style={{ float: "right" }}>
                  <Link to="/profile">Profile</Link>
                </Menu.Item>
              </>
            ) : (
              <Menu.Item key="login" style={{ float: "right" }}>
                <Link to="/login">Login</Link>
              </Menu.Item>
            )}
          </Menu>
        </Header>
      );
    }
    return null;
  }

  function FooterConfig() {
    if (width < 1024) {
      return (
        <Footer style={{ background: "#FCFBF8", padding: "50px" }}>
          <Divider></Divider>
          <Flex vertical gap="large" style={{ alignItems: "center" }}>
            <Link to="/">
              <Image
                alt="logo"
                src={require("./images/logopngResize.png")}
                width={100}
                height={50}
                preview={false}
              />
            </Link>

            <Flex vertical gap="large" style={{ alignItems: "center" }}>
              <Space direction="horizontal">
                <MailOutlined />
                <Link to="mailto:hello@juniorpass.sg">hello@juniorpass.sg</Link>
              </Space>
              <Flex vertical={false} gap="large">
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
            </Flex>
          </Flex>
        </Footer>
      );
    }
    if (1024 <= width) {
      return (
        <Footer style={{ background: "#FCFBF8", padding: "50px 150px" }}>
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
      );
    }
    return null;
  }

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
        <HeaderConfig />
        <Content style={{ padding: "0 100px" }}>
          <div
            style={{
              margin: "16px 0",
              padding: 24,
            }}
          >
            <Toaster />
            {children}
          </div>
        </Content>
        <FooterConfig />
      </Layout>
    </ConfigProvider>
  );
};

export default OverallLayout;
