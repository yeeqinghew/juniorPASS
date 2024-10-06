import React from "react";
import { Layout, Menu, ConfigProvider, Image } from "antd";
import { Outlet, Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Layout.css";
import useWindowDimensions from "../hooks/useWindowDimensions";
import Footer from "./Footer";

const { Header, Content } = Layout;

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
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
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
            <Menu.Item key="classes">
              <Link to="/classes">Browse our classes</Link>
            </Menu.Item>
            <Menu.Item key="plan">
              <Link to="/pricing">Plans</Link>
            </Menu.Item>
            <Menu.Item key="login" style={{ float: "right" }}>
              <Link to="/login">Login</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
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
      </Layout>
      <Footer />
    </ConfigProvider>
  );
};

export default OverallLayout;
