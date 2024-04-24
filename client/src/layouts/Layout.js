import React, { useContext, useEffect, useState } from "react";
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
  Badge,
} from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  WhatsAppOutlined,
  MailOutlined,
  PhoneOutlined,
  FacebookFilled,
  LinkedinFilled,
  InstagramOutlined,
  LogoutOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import "./Layout.css";
import { googleLogout } from "@react-oauth/google";
import useWindowDimensions from "../hooks/useWindowDimensions";
import UserContext from "../components/UserContext";

const { Header, Content, Footer } = Layout;
const { Text, Title } = Typography;

const OverallLayout = ({
  isAuthenticated,
  setAuth,
  setLoading,
  setIsLoggingOut,
}) => {
  const [open, setOpen] = useState(false);
  const { width, isDesktop } = useWindowDimensions();
  const { user } = useContext(UserContext);
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
              src={require("../images/logopngResize.png")}
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
                    <Link to="/profile" state={"account"}>
                      Profile
                    </Link>
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
              src={require("../images/logopngResize.png")}
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
            <></>
            {isAuthenticated ? (
              <>
                <Menu.Item key="logout" style={{ float: "right" }}>
                  <LogoutOutlined onClick={handleLogout} />
                </Menu.Item>
                <Menu.Item
                  key="cart"
                  style={{ float: "right" }}
                  onClick={() => {
                    navigate("/cart");
                  }}
                >
                  <ShoppingCartOutlined />
                </Menu.Item>
                <Menu.Item
                  key="notification"
                  style={{ float: "right" }}
                  onClick={() => {
                    // TODO: Popover antd to show a list of notifcations
                  }}
                >
                  {/* TODO: <Badge> */}
                  <i className="fa fa-bell-o"></i>
                </Menu.Item>
                <Menu.Item
                  key="credit"
                  style={{
                    float: "right",
                  }}
                  onClick={() => {
                    navigate("/profile", {
                      state: "credit",
                    });
                  }}
                >
                  <Image
                    src={require("../images/credit.png")}
                    width={24}
                    height={24}
                    preview={false}
                  />
                  <Text>{user?.credit}</Text>
                </Menu.Item>
                <Menu.Item key="profile" style={{ float: "right" }}>
                  <Link to="/profile" state={"account"}>
                    Profile
                  </Link>
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
                src={require("../images/logopngResize.png")}
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
                <Title level={5}>QUICK LINKS</Title>
                <Link to="/">Home</Link>
                <Link to="/classes">Classes</Link>
                <Link to="/plans">Plans</Link>
                {/* <Link to="/contactus">ContactUs</Link> */}
              </Flex>

              <Flex vertical gap="large" style={{ width: "20%" }}>
                <Title level={5}>SUPPORT</Title>
                <Link to="/faq">FAQ</Link>
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
          (UEN: 202411484C)
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
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <HeaderConfig />
        <Content style={{ padding: isDesktop ? "0 150px" : "0" }}>
          <div
            style={{
              margin: isDesktop ? "16px 0" : "8px",
              padding: isDesktop ? 24 : 16,
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

export default OverallLayout;
