import React from "react";
import { Col, Image, Row, Typography } from "antd";
import "./index.css";

const { Text, Title } = Typography;

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <Title level={1} className="about-hero-title">About Junior Pass</Title>
        <Text className="about-hero-subtitle">
          Connecting parents with trusted enrichment partners across Singapore.
        </Text>
      </div>

      <Row gutter={[24, 24]} align="middle" className="about-content">
        <Col xs={24} md={12}>
          <Text className="about-lead">
            At <strong>Junior Pass</strong>, we’re a passionate team of three on a mission
            to transform how parents discover and book enrichment classes for their children.
            Our platform is an all-in-one booking solution, connecting parents with a vibrant
            network of enrichment class vendors across the island. By curating a diverse and
            inclusive range of activities, we empower parents to easily find the best opportunities
            that suit their children's unique interests and needs—while simplifying schedules and
            fostering meaningful connections between families and vendors.
          </Text>

          <div className="about-bullets">
            <ul>
              <li>Curated classes across categories and age groups</li>
              <li>Simple, secure booking with flexible credits</li>
              <li>Trusted partners and transparent reviews</li>
              <li>Designed by parents, for parents</li>
            </ul>
          </div>
        </Col>

        <Col xs={24} md={12} className="about-illustration-wrap">
          <Image
            src={""}
            alt="Parents and children discovering classes together"
            preview={false}
            className="about-illustration"
          />
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
