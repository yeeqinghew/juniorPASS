import React from "react";
import { Layout, Menu, ConfigProvider, Typography, Image, Button } from "antd";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import homepageVideo from "../../videos/homepage.mp4"; // Import the video directly
import Footer from "../../layouts/Footer";

const { Header, Content } = Layout;

function HomePage() {
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
            top: "30px",
            zIndex: 3, // Higher z-index to stay on top of the video
            width: "100%",
            backgroundColor: "transparent", // Make the header transparent
            display: "flex",
            justifyContent: "space-between", // This ensures logo on the left, menu on the right
            alignItems: "center", // Vertically center items
            padding: "50px 150px",
          }}
        >
          <Link to="/">
            <Image
              alt="logo"
              src={require("../../images/logopngResize.png")}
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
              display: "flex",
              justifyContent: "flex-end", // This aligns the menu items to the right
              fontSize: "15px",
            }}
          >
            <Menu.Item key="classes">
              <Link to="/classes" style={{ color: "white", fontWeight: "600" }}>
                Browse our classes
              </Link>
            </Menu.Item>
            <Menu.Item key="plan">
              <Link to="/pricing" style={{ color: "white", fontWeight: "600" }}>
                Plans
              </Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link to="/login" style={{ color: "white", fontWeight: "600" }}>
                Login/Register
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ minHeight: "100vh" }}>
          <div>
            <Toaster />
            <Outlet />
            <div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Background Video */}
                <video
                  autoPlay
                  muted
                  loop
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    objectFit: "fill",
                    zIndex: 1, // The video stays in the background
                  }}
                >
                  <source src={homepageVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Overlay Content */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%", // Centers horizontally
                    top: "25%",
                    transform: "translate(-50%, -50%)", // Centers the content
                    zIndex: 2, // Content is above the video
                    color: "#fff", // White text
                    textAlign: "center",
                    padding: "50px",
                    borderRadius: "15px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex", // Create a flexbox container
                      justifyContent: "space-between", // Evenly space the columns
                      gap: "20px", // Add space between columns
                      width: "100%", // Set the overall width of the heading section
                    }}
                  >
                    <span style={{ flex: 1 }}>
                      <h1
                        style={{
                          fontSize: "48px", // Large font size
                          lineHeight: "1.2", // Adjusts line spacing for readability
                          fontFamily: "'Ovo', serif",
                        }}
                      >
                        Let us help your kids grow into the best versions of
                        themselves.
                      </h1>
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "75px", // Adjusts the distance from the bottom of the screen
                    left: "50%", // Centers horizontally
                    transform: "translateX(-50%)", // Centers the content horizontally
                    zIndex: 2, // Content is above the video
                  }}
                >
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      margin: "0 10px",
                      backgroundColor: "#fff",
                      color: "#000",
                      width: "280px",
                      borderRadius: "25px",
                    }}
                  >
                    Try for free!
                  </Button>
                  <Button
                    size="large"
                    style={{
                      margin: "0 10px",
                      backgroundColor: "#fff",
                      color: "#000",
                      width: "280px",
                      borderRadius: "25px",
                    }}
                  >
                    About Us
                  </Button>
                </div>
              </div>

              <div style={{ height: "1000px" }}></div>
            </div>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default HomePage;
