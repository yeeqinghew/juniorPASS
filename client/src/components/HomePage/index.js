import React from "react";
import { Button, Card, Space, Typography, Image } from "antd";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Grid } from "@splidejs/splide-extension-grid";
import "@splidejs/react-splide/dist/css/splide.min.css";

// Default theme
// import "@splidejs/react-splide/css";

// or other themes
// import "@splidejs/react-splide/css/skyblue";
// import "@splidejs/react-splide/css/sea-green";

// // or only core styles
// import "@splidejs/splide/css/core";

const { Title, Text } = Typography;

const HomePage = () => {
  const images = require.context("../../images/partners", true);
  const imageList = images.keys().map((image) => images(image));

  return (
    <div>
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
          right: "120px",
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
            <Button size="large">Find out more</Button>
          </Link>
        </Space>
      </Card>
      <div style={{ height: 48 }}></div>
      <h1 style={{ textAlign: "center" }}>Education Partners</h1>
      <Splide
        style={{
          width: "100vh",
        }}
        extensions={{ Grid }}
        options={{
          pagination: false,
          grid: {
            rows: 2,
            cols: 3,
          },
        }}
      >
        {imageList.map((image, index) => (
          <SplideSlide>
            <Card
              style={{
                width: 300,
              }}
            >
              <Image
                key={index}
                src={image}
                alt={`image-${index}`}
                // width={288}
                preview={false}
                margin={24}
              />
            </Card>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default HomePage;
