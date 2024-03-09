import React from "react";
import {
  Button,
  Card,
  Space,
  Typography,
  Image,
  Col,
  Row,
  FloatButton,
} from "antd";
import { UpOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Grid } from "@splidejs/splide-extension-grid";
import "@splidejs/react-splide/dist/css/splide.min.css";

const { Title, Text } = Typography;

const HomePage = () => {
  const images = require.context("../../images/partners", true);
  const imageList = images.keys().map((image) => images(image));
  const desktopStyles = {
    div: {
      padding: "0 180px",
    },
    splideCard: {
      width: 240,
      height: 240,
    },
  };

  const mobileStyles = {
    div: {
      padding: 0,
    },
    splideCard: {
      width: 240,
      height: 240,
    },
  };

  return (
    <div>
      {/* thumbnail */}
      {/* <div>
        <Image
          src={require("../../images/cover.jpg")}
          alt="cover"
          style={{
            width: "100%",
            backgroundSize: "contain",
            filter: "brightness(50%)",
            margin: 0,
            padding: 0,
          }}
          preview={false}
        />
        <Card
          style={{
            backgroundColor: "#FFDEDE",
            width: "550px",
            borderRadius: "30px",
            position: "absolute",
            margin: "0 auto",
            right: "340px",
            top: "250px",
          }}
        >
          <Space direction="vertical" size={"large"}>
            <Title style={{ color: "#98BDD2", fontWeight: 1000, fontSize: 48 }}>
              Preparing preschoolers for life
            </Title>
            <Text>
              Unleashing potential through diverse classes for young minds
            </Text>
            <Link to="/classes">
              <Button
                style={{
                  borderRadius: "30px",
                }}
              >
                Find out more
              </Button>
            </Link>
          </Space>
        </Card>
      </div> */}

      <div style={{ height: 48 }}></div>

      {/* partners */}
      <div style={{ padding: "24px" }}>
        <Title level={1} style={{ textAlign: "center" }}>
          partners
        </Title>
        <Splide
          style={{
            width: "100vh",
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
                  alt={`image-${index}`}
                  preview={false}
                />
              </Card>
            </SplideSlide>
          ))}
        </Splide>
      </div>

      {/* about us */}
      <div style={{ padding: "24px" }}>
        <Title level={1}>about juniorPASS</Title>
        <Row style={{ padding: "24px" }}>
          <Col span={12}>
            <Text>
              At juniorPASS, we strive to transform the children enrichment
              sector in Singapore by bringing premier enrichment classes and
              experiences within a single place. If you're looking for swimming
              lesson or a piano lesson for your kids, fret not - simply book
              them online through our site.
            </Text>
          </Col>
          <Col span={2}></Col>
          <Col span={10} style={{ display: "flex", alignItems: "flex-end" }}>
            <Image src={require("../../images/group.png")} preview={false} />
          </Col>
        </Row>
      </div>

      {/* button */}
      <div></div>

      <FloatButton.BackTop icon={<UpOutlined />} />
    </div>
  );
};

export default HomePage;
