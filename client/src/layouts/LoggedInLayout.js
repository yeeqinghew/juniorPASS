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
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  LinkedinFilled,
  InstagramOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import "./Layout.css";
import { googleLogout } from "@react-oauth/google";
import { useUserContext } from "../components/UserContext";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;
const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/c/font_4957401_wsnyu01fcm.js"],
});

const LoggedInLayout = () => {
  const { user, isAuthenticated, setAuth, setLoading } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setLoading(false);
    // logout of Google account
    googleLogout();
    toast.success("Logout successfully");
    navigate("/login");
  };

  function HeaderConfig() {
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
        <Link to="/profile">
          <Image
            alt="logo"
            src={require("../images/logopngResize.png")}
            width={100}
            height={50}
            preview={false}
          />
        </Link>

        <div style={{ width: "48px" }}></div>

        <Menu
          mode="horizontal"
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            justifyContent: "flex-end",
            background: "transparent",
            borderBottom: "none",
          }}
        >
          {isAuthenticated ? (
            <>
              <Menu.Item key="classes">
                <Link to="/classes">Browse Classes</Link>
              </Menu.Item>
              
              <Menu.Item key="pricing">
                <Link to="/pricing">Plans</Link>
              </Menu.Item>

              <Menu.Item
                key="credit"
                onClick={() =>
                  navigate("/profile", {
                    state: "credit",
                  })
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <IconFont type="icon-money" />
                  <Text style={{ lineHeight: "normal", fontWeight: "600" }}>
                    {user?.credit} credits
                  </Text>
                </div>
              </Menu.Item>

              <Menu.Item key="notification">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    // TODO: Popover antd to show a list of notifcations
                  }}
                >
                  <IconFont type="icon-notification" />
                </div>
              </Menu.Item>

              <Menu.Item key="logout">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={handleLogout}
                >
                  <IconFont type="icon-signout-1" />
                </div>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login">
              <Link to="/login">Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
    );
  }

  function FooterConfig() {
    return (
      <Footer style={{ background: "#FCFBF8", padding: "50px 150px" }}>
        <Divider></Divider>
        <Flex style={{ width: "100%" }}>
          <Flex style={{ width: "25%", justifyContent: "flex-start" }}>
            <Flex vertical gap="large">
              <Link to="/">
                <Image
                  alt="logo"
                  src={require("../images/logopngResize.png")}
                  width={100}
                  height={50}
                  preview={false}
                />
              </Link>
            </Flex>
          </Flex>

          <Flex style={{ right: 0, width: "90%", justifyContent: "flex-end" }}>
            <Flex vertical gap="large" style={{ width: "20%" }}>
              <Title level={5}>JuniorPass</Title>
              <Link to="/about-us">About us</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/pricing">Pricing</Link>
            </Flex>

            <Flex vertical gap="large" style={{ width: "20%" }}>
              <Title level={5}>SUPPORT</Title>
              <Link to="/faq">FAQs</Link>
            </Flex>

            <Flex vertical gap="large" style={{ width: "20%" }}>
              <Title level={5}>PARTNERS</Title>
              <Link to="/partner-contact">Become a partner</Link>
              <a
                href="www.portal.juniorpass.sg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text>Partner Login</Text>
              </a>
              {/* <Link to="/contactus">ContactUs</Link> */}
            </Flex>

            <Flex vertical gap="large" style={{ width: "20%" }}>
              <Title level={5}>FOLLOW US</Title>
              <Space direction="horizontal">
                <MailOutlined />
                <Link to="mailto:admin@juniorpass.sg">admin@juniorpass.sg</Link>
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
              <Space direction="horizontal">
                <PhoneOutlined />
                <Text>(65)XXXX-XXXX</Text>
              </Space>

              {/* <Space direction="horizontal">
              <WhatsAppOutlined />
              <Text>(65)XXXX-XXXX</Text>
            </Space> */}
            </Flex>
          </Flex>
        </Flex>
        <Divider></Divider>© Copyright {new Date().getFullYear()} juniorPASS
        (UEN: 202411484C)
      </Footer>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          borderRadius: 2,
          colorPrimary: "#98BDD2",
          colorPrimaryActive: "#98BDD2",

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
          Tabs: {
            itemActiveColor: "#98BDD2",
            itemHoverColor: "#98BDD2",
            itemSelectedColor: "#98BDD2",
            inkBarColor: "#98BDD2",
          },
        },
      }}
    >
      <Layout>
        <HeaderConfig />
        <Content className="layout-content" style={{ padding: "0 150px" }}>
          <div
            style={{
              margin: "16px 0",
              padding: 24,
            }}
          >
            <Toaster />
            <Outlet />
          </div>
        </Content>
        <FooterConfig />
      </Layout>
    </ConfigProvider>
  );
};

export default LoggedInLayout;
