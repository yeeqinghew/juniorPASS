import React, { useState } from "react";
import { Layout, Menu, ConfigProvider, Image, Drawer } from "antd";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MenuOutlined } from "@ant-design/icons";
import "./Layout.css";
import useWindowDimensions from "../hooks/useWindowDimensions";
import Footer from "./Footer";

const { Header, Content } = Layout;

const OverallLayout = () => {
  const { isDesktop } = useWindowDimensions();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
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
            top: "0px",
            zIndex: 999,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FCFBF8",
            padding: "50px 150px",
          }}
        >
          <Link to="/">
            <Image
              className="logo-homepage"
              alt="logo"
              src={require("../images/logopngResize.png")}
              preview={false}
            />
          </Link>

          {/* Hamburger menu (visible on mobile) */}
          <div className="hamburger-menu" onClick={showDrawer}>
            <MenuOutlined style={{ fontSize: "24px" }} />
          </div>

          {/* Drawer (Hamburger menu for mobile) */}
          <Drawer
            placement="right"
            onClose={closeDrawer}
            open={drawerVisible}
            width={250}
            style={{
              padding: 0,
              zIndex: 9999,
            }}
          >
            <Menu
              mode="vertical"
              onClick={closeDrawer}
              style={{ background: "transparent", color: "black" }}
            >
              <Menu.Item key="classes">
                <Link to="/classes" style={{ fontWeight: "600" }}>
                  Browse our classes
                </Link>
              </Menu.Item>
              <Menu.Item key="plan">
                <Link to="/pricing" style={{ fontWeight: "600" }}>
                  Plans
                </Link>
              </Menu.Item>
              <Menu.Item key="login">
                <Link to="/login" style={{ fontWeight: "600" }}>
                  Login/Register
                </Link>
              </Menu.Item>
            </Menu>
          </Drawer>

          <Menu mode="horizontal">
            <Menu.Item key="classes">
              <Link to="/classes">Browse our classes</Link>
            </Menu.Item>
            <Menu.Item key="plan">
              <Link to="/pricing">Plans</Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="/login">Login/Register</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 120px", minHeight: "auto" }}>
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
