import React, { useEffect, useState } from "react";
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
  Drawer,
} from "antd";
import { Outlet, Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Grid } from "@splidejs/splide-extension-grid";
import "@splidejs/react-splide/dist/css/splide.min.css";
import homepageVideo from "../../videos/homepage.mp4"; // Import the video directly
import Footer from "../../layouts/Footer";
import FAQ from "../FAQ";
import {
  SmileOutlined,
  BookOutlined,
  CheckCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import InfoCard from "../../utils/InfoCard";
import "./index.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const { Header, Content } = Layout;
const { Text, Title } = Typography;

function HomePage() {
  // Keep track of the hovered card index (-1 means none are hovered)
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { isDesktop, isTabletLandscape } = useWindowDimensions();
  const [scrolled, setScrolled] = useState(false);

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

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight); // Check if scrolled past 100vh
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
          id={"header-homepage"}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: scrolled ? "#FCFBF8" : "transparent",
            transition: "background-color 0.3s ease",
          }}
        >
          {/* Logo */}
          <Link to="/">
            <Image
              className="logo-homepage"
              alt="logo"
              src={require("../../images/logopngResize.png")}
              preview={false}
            />
          </Link>

          {/* Hamburger menu (visible on mobile) */}
          <div className="hamburger-menu" onClick={showDrawer}>
            <MenuOutlined style={{ fontSize: "24px", color: "white" }} />
          </div>

          {/* Drawer (Hamburger menu for mobile) */}
          <Drawer
            title="Menu"
            placement="right"
            onClose={closeDrawer}
            open={drawerVisible}
            width={250}
            style={{ padding: 0 }}
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
              <Link
                to="/classes"
                style={{
                  background: "transparent",
                  color: scrolled ? "black" : "white",
                }}
              >
                Browse our classes
              </Link>
            </Menu.Item>
            <Menu.Item key="plan">
              <Link
                to="/pricing"
                style={{
                  background: "transparent",
                  color: scrolled ? "black" : "white",
                }}
              >
                Plans
              </Link>
            </Menu.Item>
            <Menu.Item key="login">
              <Link
                to="/login"
                style={{
                  background: "transparent",
                  color: scrolled ? "black" : "white",
                }}
              >
                Login/Register
              </Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ minHeight: "100vh" }}>
          <div>
            <Outlet />
            <div className="headline-div">
              {/* Background Video */}
              <video autoPlay muted loop className="video-src">
                <source src={homepageVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Overlay Content */}
              <div className="overlay-homepage">
                <div
                  style={{
                    display: "flex", // Create a flexbox container
                    justifyContent: "space-between", // Evenly space the columns
                    gap: "20px", // Add space between columns
                    width: "100%", // Set the overall width of the heading section
                  }}
                >
                  <span style={{ flex: 1 }}>
                    <Title level={1} className="title headline-title">
                      Let us help your kids grow into the best versions of
                      themselves.
                    </Title>
                  </span>
                </div>
              </div>
              <div className="headline-cta">
                <Button type="primary" className="headline-button" size="large">
                  Try for free!
                </Button>
                <Button className="headline-button" size="large">
                  About Us
                </Button>
              </div>
            </div>

            <div>
              {/* partners */}
              <div className={"partner-div"}>
                <Title level={1} className="title partner-title" style={{}}>
                  Our partners
                </Title>
                <Splide
                  extensions={{ Grid }}
                  options={{
                    pagination: false,
                    drag: "free",
                    perPage: isDesktop || isTabletLandscape ? 4 : 3,
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
                    arrows: true,
                  }}
                >
                  {imageList.map((image, index) => (
                    <SplideSlide>
                      <Card
                        className="partner-splide-card"
                        bodyStyle={{
                          alignItems: "center",
                          display: "flex",
                        }}
                        bordered={false}
                      >
                        <Image
                          src={image}
                          alt={`partner-${index}`}
                          preview={false}
                        />
                      </Card>
                    </SplideSlide>
                  ))}
                </Splide>
              </div>

              <div className="join-us-div">
                {/* Title and Subtitle */}
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <Title level={1} className="title join-us-title">
                    Join us —
                  </Title>
                  <Text className={"join-us-subtitle"}>
                    Here’s what you need to do.
                  </Text>
                </div>

                {/* Cards Section */}
                <Row
                  gutter={[16, 16]} // Responsive gutter
                  justify="center"
                >
                  {cardsData.map((card, index) => (
                    <Col
                      xs={24} // Full-width on mobile
                      sm={24} // Full-width on tablet portrait
                      md={24} // 1/3 width on tablet landscape (3 items per row)
                      lg={8} // 1/3 width on desktop (3 items per row)
                      key={index}
                    >
                      {/* Center InfoCard within column */}
                      <InfoCard
                        icon={card.icon}
                        title={card.title}
                        description={card.description}
                        hovered={hoveredIndex === index}
                        onHover={() => handleMouseEnter(index)}
                        onLeave={() => handleMouseLeave()}
                      />
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
              <div className="faq-div">
                <div className="faq-inner-div">
                  <Row gutter={16}>
                    {/* Title Column */}
                    <Col xs={24} sm={24} md={6} lg={6}>
                      <Row>
                        <Title
                          className="title faq-title"
                          level={1}
                          style={{
                            fontWeight: "600",
                          }}
                        >
                          Frequently Asked Questions
                        </Title>
                      </Row>
                      <Row>
                        <Text className="faq-subtitle">
                          Find answers to common questions about our services,
                          booking process, and credit system.
                        </Text>
                      </Row>
                    </Col>

                    {/* FAQ Collapse Column */}
                    <Col xs={24} sm={24} md={18} lg={18}>
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
