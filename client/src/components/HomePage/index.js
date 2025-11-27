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
import "@splidejs/react-splide/dist/css/splide-core.min.css";
import "@splidejs/react-splide/dist/css/themes/splide-default.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
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
  const { isDesktop, isTabletLandscape, isMobile } = useWindowDimensions();
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
    // Initialize AOS
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic',
    });

    const handleScroll = () => {
      if (isMobile) {
        let threshold = 300;
        setScrolled(window.scrollY > threshold);
        return;
      }
      setScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]);

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
            <MenuOutlined
              style={{ fontSize: "24px", color: scrolled ? "black" : "white" }}
            />
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
              {/* <video
                autoPlay
                muted
                loop
                className="video-src"
                playsinline
                webkit-playsinline
              >
                <source src={homepageVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video> */}
              <Image
                className="video-src"
                src={require("../../videos/homepage-webp.webp")}
                alt="Kids learning and playing"
                preview={false}
              />
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
                <Link to="/register">
                  <Button type="primary" className="headline-button" size="large">
                    Try for free!
                  </Button>
                </Link>
                <Link to="/about-us">
                  <Button className="headline-button" size="large">
                    About Us
                  </Button>
                </Link>
              </div>
            </div>

            {/* partners */}
            <div className={"partner-div"}>
              <div className="partner-header" data-aos="fade-up">
                <Title level={1} className="title partner-title">
                  Trusted by Leading Educators
                </Title>
                <Text className="partner-subtitle">
                  We partner with Singapore's best enrichment providers to bring quality learning experiences to your children
                </Text>
              </div>
              <Splide
                extensions={{ Grid }}
                options={{
                  pagination: false,
                  type: "loop",
                  perPage: 4,
                  perMove: 1,
                  gap: "24px",
                  arrows: true,
                  autoplay: true,
                  interval: 3000,
                  breakpoints: {
                    1200: {
                      perPage: 3,
                      gap: "20px",
                    },
                    900: {
                      perPage: 2,
                      gap: "16px",
                    },
                    600: {
                      perPage: 2,
                      gap: "12px",
                    },
                  },
                }}
              >
                {imageList.map((image, index) => (
                  <SplideSlide key={`partner-${index}`}>
                    <Card
                      className="partner-splide-card"
                      style={{
                        alignItems: "center",
                        display: "flex",
                      }}
                      bordered={false}
                    >
                      <Image
                        src={image}
                        alt={`Partner logo ${index + 1}`}
                        preview={false}
                      />
                    </Card>
                  </SplideSlide>
                ))}
              </Splide>
            </div>

            <div className="join-us-div">
              {/* Title and Subtitle */}
              <div className="join-us-header" data-aos="fade-up">
                <Title level={1} className="title join-us-title">
                  Getting Started is Easy
                </Title>
                <Text className="join-us-subtitle">
                  Three simple steps to unlock amazing learning experiences for your child
                </Text>
              </div>

              {/* Cards Section */}
              <Row
                gutter={[32, 32]}
                justify="center"
                className="join-us-cards-row"
              >
                {cardsData.map((card, index) => (
                  <Col
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                  >
                    <div className="step-number">{index + 1}</div>
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

              {/* CTA Button */}
              <div className="join-us-cta" data-aos="fade-up" data-aos-delay="500">
                <Link to="/register">
                  <Button type="primary" size="large" className="join-us-button">
                    Start Your Journey Today
                  </Button>
                </Link>
              </div>
            </div>

            {/* FAQs */}
            <div className="faq-div">
              <div className="faq-inner-div">
                <Row gutter={[32, 32]} align="top">
                  {/* Title Column */}
                  <Col xs={24} sm={24} md={8} lg={7} data-aos="fade-right">
                    <div className="faq-header-section">
                      <Title className="title faq-title" level={1}>
                        Got Questions?
                      </Title>
                      <Text className="faq-subtitle">
                        Find answers to common questions about our services,
                        booking process, and credit system.
                      </Text>
                      <div className="faq-cta">
                        <Link to="/faq">
                          <Button type="primary" className="faq-view-more-btn">
                            View All FAQs →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Col>

                  {/* FAQ Collapse Column */}
                  <Col xs={24} sm={24} md={16} lg={17} data-aos="fade-left" data-aos-delay="200">
                    <FAQ />
                  </Col>
                </Row>
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
