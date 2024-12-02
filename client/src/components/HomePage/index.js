import React, { useState } from "react";
import {
  Layout,
  Menu,
  ConfigProvider,
  Typography,
  Image,
  Button,
  Row,
  Col,
  Card,
  Divider,
} from "antd";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Grid } from "@splidejs/splide-extension-grid";
import "@splidejs/react-splide/dist/css/splide.min.css";
import "./index.css";
import homepageVideo from "../../videos/homepage.mp4"; // Import the video directly
import Footer from "../../layouts/Footer";
import FAQ from "../FAQ";
import {
  SmileOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import InfoCard from "../../utils/InfoCard";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

function HomePage() {
  // Keep track of the hovered card index (-1 means none are hovered)
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(-1);
  };

  const images = require.context(
    "../../images/partners",
    false,
    /\.(png|jpe?g|svg)$/
  );
  const imageList = images.keys().map((key) => images(key));

  const coursesData = [
    {
      title: "LEGO® Robotics",
      image: require("../../images/cover.jpg"),
      provider: "Bricks 4 Kidz",
      rating: 4.88,
      description:
        "Add either a description of the course or a quote (testimonial/review)",
    },
    {
      title: "Water Confidence for 2–4 years",
      image: require("../../images/cover.jpg"),
      provider: "Dreamers Academy",
      rating: 4.5,
      description:
        "Add either a description of the course or a quote (testimonial/review)",
    },
    {
      title: "Piano Course for 6–8 years",
      image: require("../../images/cover.jpg"),
      provider: "Yamaha",
      rating: 4.9,
      description:
        "Add either a description of the course or a quote (testimonial/review)",
    },
    {
      title: "Python Junior 1",
      image: require("../../images/cover.jpg"),
      provider: "Coding Lab",
      rating: 4.78,
      description:
        "Add either a description of the course or a quote (testimonial/review)",
    },
    {
      title: "Introductory Gymnastics",
      image: require("../../images/cover.jpg"),
      provider: "My Gym",
      rating: 4.6,
      description:
        "Add either a description of the course or a quote (testimonial/review)",
    },
  ];

  const classesData = [
    {
      title: "Art & Music",
      image: require("../../images/cover.jpg"),
      bgColor: "#FBD0D9",
      textColor: "black",
    },
    {
      title: "Science & Technology",
      image: require("../../images/cover.jpg"),
      bgColor: "#D0E7F9",
      textColor: "black",
    },
    {
      title: "Sports & Fitness",
      image: require("../../images/cover.jpg"),
      bgColor: "#D0E7F9",
      textColor: "black",
    },
  ];

  const cardsData = [
    {
      title: "Register",
      icon: <SmileOutlined style={{ fontSize: "40px", color: "#FF6B6B" }} />,
      description:
        "Create your account to join a vibrant community of parents and learners. Enjoy easy access to our platform, personalized recommendations, and exclusive benefits.",
    },
    {
      title: "Find a Class",
      icon: <BookOutlined style={{ fontSize: "40px", color: "#FF6B6B" }} />,
      description:
        "Explore a wide variety of classes tailored to your child's interests and needs. From art to science, browse through our curated options and discover their next favorite class.",
    },
    {
      title: "Book it!",
      icon: (
        <CheckCircleOutlined style={{ fontSize: "40px", color: "#FF6B6B" }} />
      ),
      description:
        "Secure your spot in just a few clicks! Enjoy a seamless booking process and get your child started on their learning adventure right away.",
    },
  ];

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
                      <Title
                        level={1}
                        style={{
                          fontSize: "48px", // Large font size
                          lineHeight: "1.2", // Adjusts line spacing for readability
                          fontFamily: "'Ovo', serif",
                          color: "white",
                        }}
                      >
                        Let us help your kids grow into the best versions of
                        themselves.
                      </Title>
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
            </div>

            <div>
              {/* partners */}
              <div style={{ padding: "24px 250px" }}>
                <Title
                  level={1}
                  style={{
                    fontSize: "48px", // Large font size
                    lineHeight: "1.2", // Adjusts line spacing for readability
                    fontFamily: "'Ovo', serif",
                    textAlign: "center",
                  }}
                >
                  Our partners
                </Title>
                <Splide
                  style={{
                    width: "100%",
                  }}
                  extensions={{ Grid }}
                  options={{
                    pagination: false,
                    drag: "free",
                    perPage: 4,
                    perMove: 1,
                    autoplay: "true",
                    type: "loop",
                    rewind: true,
                    lazyLoad: "nearby",
                    cover: true,
                    grid: {
                      rows: 1,
                    },
                    autoScroll: {
                      speed: 1,
                    },
                  }}
                >
                  {imageList.map((image, index) => (
                    <SplideSlide>
                      <Card
                        style={{
                          display: "flex",
                          width: 300,
                          height: 300,
                        }}
                        bodyStyle={{
                          alignItems: "center",
                          display: "flex",
                        }}
                        bordered={false}
                      >
                        <Image
                          key={index}
                          src={image}
                          alt={`partner-${index}`}
                          preview={false}
                        />
                      </Card>
                    </SplideSlide>
                  ))}
                </Splide>
              </div>

              <div style={{ padding: "50px 200px", background: "#F8F9FA" }}>
                {/* Title and Subtitle */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <Title
                    level={1}
                    style={{
                      fontSize: "48px", // Large font size
                      lineHeight: "1.2", // Adjusts line spacing for readability
                      fontFamily: "'Ovo', serif",
                    }}
                  >
                    Join us —
                  </Title>
                  <Text
                    style={{
                      fontSize: "24px", // Large font size
                      lineHeight: "1.2", // Adjusts line spacing for readability
                      fontFamily: "'Ovo', serif",
                    }}
                  >
                    Here’s what you need to do.
                  </Text>
                </div>

                {/* Cards Section */}
                <Row gutter={[32, 32]} justify="center">
                  {cardsData.map((card, index) => (
                    <Col
                      xs={24}
                      sm={12}
                      md={8}
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%", // Ensure the column takes up the full height of the row
                      }}
                    >
                      <InfoCard
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                        hovered={hoveredIndex === index}
                        onHover={() => handleMouseEnter(index)}
                        onLeave={() => handleMouseLeave()}
                      ></InfoCard>
                    </Col>
                  ))}
                </Row>

                {/* Divider */}
                <Divider />

                {/* Additional Text Below */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Text></Text>
                </div>
              </div>
              {/* FAQs */}
              <div
                style={{
                  padding: "50px 0", // Padding on top and bottom
                  display: "flex", // Flexbox for centering
                  justifyContent: "center", // Center content horizontally
                  backgroundColor: "#E0F0FF",
                }}
              >
                <div
                  style={{
                    maxWidth: "1200px", // Maximum width of the container
                    padding: "0 100px", // Padding on left and right for spacing
                    width: "100%", // Make sure it occupies full width within the maxWidth
                  }}
                >
                  <Row gutter={16}>
                    {/* Title Column */}
                    <Col xs={24} md={6}>
                      <Row>
                        <Text
                          style={{
                            fontSize: "48px", // Large font size
                            lineHeight: "1.2", // Adjusts line spacing for readability
                            fontFamily: "'Ovo', serif",
                            fontWeight: "600",
                          }}
                        >
                          Frequently Asked Questions
                        </Text>
                      </Row>
                      <Row>
                        <Text>
                          Find answers to common questions about our services,
                          booking process and credit system.
                        </Text>
                      </Row>
                    </Col>

                    {/* FAQ Collapse Column */}
                    <Col xs={24} md={18}>
                      <FAQ />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
      <Footer />
    </ConfigProvider>
  );
}

export default HomePage;
