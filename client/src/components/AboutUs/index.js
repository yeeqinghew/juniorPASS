import { Col, Image, Row, Typography } from "antd";
import React from "react";

const { Text, Title } = Typography;

const AboutUs = () => {
  return (
    <div style={{ padding: "50px", backgroundColor: "#f9f9f9" }}>
      <Title level={1} style={{ textAlign: "center", marginBottom: "20px" }}>
        About Junior Pass
      </Title>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={12}>
          <Text style={{ fontSize: "16px", lineHeight: "1.8" }}>
            At <strong>Junior Pass</strong>, we’re a passionate team of three on
            a mission to transform how parents discover and book enrichment
            classes for their children. Our platform is an all-in-one booking
            solution, connecting parents with a vibrant network of enrichment
            class vendors across the island. By curating a diverse and inclusive
            range of activities, we aim to empower parents to easily find the
            best opportunities that suit their children's unique interests and
            needs. At Junior Pass, we strive to be the bridge between parents
            and vendors, simplifying the process of managing schedules while
            fostering meaningful connections.
          </Text>
        </Col>
        <Col
          xs={24}
          md={12}
          style={{ textAlign: "center", position: "relative" }}
        >
          <div
            style={{
              transition: "transform 0.3s ease-in-out",
              transform: "scale(1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Image
              src={require("../../images/group.png")}
              alt="JuniorPASS Team"
              preview={false}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
              }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
