import React from "react";
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
  Rate,
} from "antd";
import { Outlet, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./index.css";
import homepageVideo from "../../videos/homepage.mp4"; // Import the video directly
import Footer from "../../layouts/Footer";
import FAQ from "../FAQ";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

function HomePage() {
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
              <div
                style={{
                  padding: "50px 120px",
                  textAlign: "center",
                  backgroundColor: "#fff",
                }}
              >
                {/* Flex container for aligning cards in one row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "30px",
                  }}
                >
                  {coursesData.map((course, index) => (
                    <Card
                      key={index}
                      hoverable
                      bordered={false}
                      style={{
                        width: 250,
                        borderRadius: "15px",
                        paddingBottom: "20px",
                        flexShrink: 0, // Prevent cards from shrinking on smaller screens
                      }}
                      cover={
                        <img
                          alt={course.title}
                          src={course.image}
                          style={{
                            borderRadius: "20px",
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                        />
                      }
                    >
                      <Title level={5} style={{ marginBottom: "10px" }}>
                        {course.title}
                      </Title>
                      <Text type="secondary">{course.provider}</Text>
                      <div style={{ marginTop: "5px" }}>
                        <Rate disabled defaultValue={course.rating} allowHalf />{" "}
                        <Text>({course.rating.toFixed(2)}★)</Text>
                      </div>
                      <Text
                        style={{
                          display: "block",
                          marginTop: "10px",
                          fontSize: "12px",
                        }}
                      >
                        {course.description}
                      </Text>
                    </Card>
                  ))}
                </div>
                <span flex={1}>
                  <Title
                    level={1}
                    style={{
                      fontSize: "48px", // Large font size
                      lineHeight: "1.2", // Adjusts line spacing for readability
                      fontFamily: "'Ovo', serif",
                    }}
                  >
                    Best classes near you
                  </Title>
                </span>
              </div>

              <div
                style={{
                  textAlign: "center",
                  padding: "0 120px",
                }}
              >
                <Row gutter={[32, 32]} justify="center">
                  {classesData.map((classItem, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card
                        hoverable
                        cover={
                          <img alt={classItem.title} src={classItem.image} />
                        }
                        style={{
                          borderRadius: "8px",
                          backgroundColor: classItem.bgColor,
                          border: "none",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "15px",
                          }}
                        >
                          <Text
                            strong
                            style={{
                              color: classItem.textColor,
                              fontSize: "18px",
                            }}
                          >
                            {classItem.title}
                          </Text>
                          <Button
                            type="link"
                            shape="circle"
                            icon={<ArrowRightOutlined />}
                            style={{
                              border: "2px solid white",
                              padding: "5px",
                              fontSize: "18px",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor = "white")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                          />
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div>
                  <h1
                    style={{
                      fontSize: "48px", // Large font size
                      lineHeight: "1.2", // Adjusts line spacing for readability
                      fontFamily: "'Ovo', serif",
                    }}
                  >
                    Browse all available classes here
                  </h1>
                </div>
              </div>

              <div style={{ padding: "50px 120px", background: "#F8F9FA" }}>
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
                <Row gutter={[16, 16]} justify="center">
                  <Col xs={24} sm={12} md={8}>
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: "#E0F0FF",
                        textAlign: "center",
                        height: "100%", // Ensure card takes full height of column
                        display: "flex", // For flex behavior
                        flexDirection: "column", // Column layout for text
                        justifyContent: "center", // Center content vertically
                      }}
                    >
                      <Title level={4}>Register</Title>
                      <Text>
                        Start this section with a brief overview of your
                        company, including your mission, vision, and
                        stakeholders.
                      </Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: "#E0F0FF",
                        textAlign: "center",
                        height: "100%", // Ensure card takes full height of column
                        display: "flex", // For flex behavior
                        flexDirection: "column", // Column layout for text
                        justifyContent: "center", // Center content vertically
                      }}
                    >
                      <Title level={4}>Find a Class</Title>
                      <Text>
                        Share your goals as a company, and the products or
                        services you provide to achieve them.
                      </Text>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: "#E0F0FF",
                        textAlign: "center",
                        height: "100%", // Ensure card takes full height of column
                        display: "flex", // For flex behavior
                        flexDirection: "column", // Column layout for text
                        justifyContent: "center", // Center content vertically
                      }}
                    >
                      <Title level={4}>Book it!</Title>
                      <Text>
                        Discuss what you’ve achieved in the past year using a
                        combination of narrative and visual tools.
                      </Text>
                    </Card>
                  </Col>
                </Row>

                {/* Divider */}
                <Divider />

                {/* Additional Text Below */}
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Text>This should come with something</Text>
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
