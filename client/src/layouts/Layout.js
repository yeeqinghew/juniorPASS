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
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  LinkedinFilled,
  InstagramOutlined,
} from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import "./Layout.css";
import useWindowDimensions from "../hooks/useWindowDimensions";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const OverallLayout = ({ setAuth, setLoading, setIsLoggingOut }) => {
  const { isDesktop } = useWindowDimensions();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setLoading(false);
    setIsLoggingOut(true);
    // logout of Google account
    // googleLogout();
    toast.success("Logout successfully");
    navigate("/login");
  };

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
      <Layout style={{ minHeight: "100vh", overflow: "hidden" }}>
        <Header
          style={{
            position: "absolute", // Keeps the header at the top, above the video
            zIndex: 3, // Higher z-index to stay on top of the video
            width: "100%",
            backgroundColor: "transparent", // Make the header transparent
            display: "flex",
            padding: "50px 150px",
          }}
        >
          <Link to="/">
            <Image
              alt="logo"
              src={require("../images/logopngResize.png")}
              width={100}
              height={50}
              preview={false}
            />
          </Link>

          <Menu
            mode="horizontal"
            style={{
              background: "transparent",
              borderBottom: "none",
              flex: 1,
              minWidth: 0,
              display: "block",
            }}
          >
            <Menu.Item key="classes">
              <Link to="/classes" style={{ color: "white" }}>
                Browse our classes
              </Link>
            </Menu.Item>
            <Menu.Item key="plan">
              <Link to="/pricing" style={{ color: "white" }}>
                Plans
              </Link>
            </Menu.Item>
            <Menu.Item key="login" style={{ float: "right" }}>
              <Link to="/login" style={{ color: "white" }}>
                Login
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ minHeight: "100vh" }}>
          <div>
            <Toaster />
            <Outlet />
          </div>
        </Content>
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

            <Flex
              style={{ right: 0, width: "90%", justifyContent: "flex-end" }}
            >
              <Flex vertical gap="large" style={{ width: "20%" }}>
                <Title level={5}>JuniorPass</Title>
                <Link to="/about-us">About us</Link>
                <Link to="/classes">Classes</Link>
                <Link to="/pricing">Pricing</Link>
              </Flex>

              <Flex vertical gap="large" style={{ width: "20%" }}>
                <Title level={5}>SUPPORT</Title>
                <Link to="/contact-us">Contact Us</Link>
                <Link to="/faq">FAQs</Link>
              </Flex>

              <Flex vertical gap="large" style={{ width: "20%" }}>
                <Title level={5}>PARTNERS</Title>
                <Link to="/partner-contact">Become a partner</Link>
                <Link to="/partner/login">Partner Login</Link>
                {/* <Link to="/contactus">ContactUs</Link> */}
              </Flex>

              <Flex vertical gap="large" style={{ width: "20%" }}>
                <Title level={5}>FOLLOW US</Title>
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
      </Layout>
    </ConfigProvider>
  );
};

export default OverallLayout;
