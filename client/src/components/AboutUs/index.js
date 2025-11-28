import React from "react";
import { Col, Row, Typography, Avatar, Space, Card } from "antd";
import { HeartFilled, RocketOutlined } from "@ant-design/icons";
import "./index.css";

const { Text, Title } = Typography;

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <Title level={1} className="about-hero-title">
          About Junior Pass
        </Title>
        <Text className="about-hero-subtitle">
          Connecting parents with trusted enrichment partners across Singapore.
        </Text>
      </div>

      <div className="about-content">
        <Row gutter={[48, 48]} align="top">
          <Col xs={24} lg={14}>
            <Title level={2} className="about-section-title">
              Our Story
            </Title>
            <Text className="about-lead">
              At <strong>Junior Pass</strong>, we're a passionate team of two on
              a mission to transform how parents discover and book enrichment
              classes for their children. Our platform is an all-in-one booking
              solution, connecting parents with a vibrant network of enrichment
              class vendors across the island.
            </Text>
            <Text className="about-lead">
              By curating a diverse and inclusive range of activities, we
              empower parents to easily find the best opportunities that suit
              their children's unique interests and needs—while simplifying
              schedules and fostering meaningful connections between families
              and vendors.
            </Text>

            <div className="about-bullets">
              <ul>
                <li>Curated classes across categories and age groups</li>
                <li>Simple, secure booking with flexible credits</li>
                <li>Trusted partners and transparent reviews</li>
                <li>Designed for parents, with care and dedication</li>
              </ul>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div className="values-section">
              <Title level={3} className="values-title">
                Our Values
              </Title>
              <Space direction="vertical" size={20} style={{ width: "100%" }}>
                <Card className="value-card">
                  <Space align="start" size={16}>
                    <div
                      className="value-icon"
                      style={{ background: "#e6f7ff" }}
                    >
                      🎯
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Parent-Centric
                      </Text>
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Every feature designed with parents' needs in mind
                      </Text>
                    </div>
                  </Space>
                </Card>

                <Card className="value-card">
                  <Space align="start" size={16}>
                    <div
                      className="value-icon"
                      style={{ background: "#fff7e6" }}
                    >
                      ⭐
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Quality First
                      </Text>
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Only trusted, verified enrichment partners
                      </Text>
                    </div>
                  </Space>
                </Card>

                <Card className="value-card">
                  <Space align="start" size={16}>
                    <div
                      className="value-icon"
                      style={{ background: "#f6ffed" }}
                    >
                      💚
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        Community Driven
                      </Text>
                      <Text type="secondary" style={{ fontSize: "14px" }}>
                        Building connections between families and partners
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Team Section - Full Width */}
        <div className="team-section">
          <Title level={2} className="team-main-title">
            Meet the Founders
          </Title>
          <Text className="team-main-subtitle">
            Two passionate entrepreneurs committed to empowering families
          </Text>

          <Row gutter={[32, 32]} justify="center" style={{ marginTop: 48 }}>
            <Col xs={24} sm={12} md={10}>
              <Card className="team-card-large">
                <div style={{ textAlign: "center" }}>
                  <div className="avatar-container-large">
                    <Avatar
                      size={120}
                      className="team-avatar-large"
                      style={{
                        backgroundColor: "#69b1ff",
                        fontSize: "60px",
                        margin: "0 auto",
                      }}
                    >
                      👦
                    </Avatar>
                    <RocketOutlined
                      className="avatar-badge-large"
                      style={{ color: "#69b1ff" }}
                    />
                  </div>
                  <Title level={3} style={{ marginTop: 24, marginBottom: 8 }}>
                    Abednego Tan
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "15px",
                      display: "block",
                      marginBottom: 16,
                    }}
                  >
                    Founder
                  </Text>
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    "Every child deserves access to amazing learning
                    opportunities. We're here to make that happen."
                  </Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={10}>
              <Card className="team-card-large">
                <div style={{ textAlign: "center" }}>
                  <div className="avatar-container-large">
                    <Avatar
                      size={120}
                      className="team-avatar-large"
                      style={{
                        backgroundColor: "#ff85c0",
                        fontSize: "60px",
                        margin: "0 auto",
                      }}
                    >
                      👧
                    </Avatar>
                    <HeartFilled
                      className="avatar-badge-large"
                      style={{ color: "#ff85c0" }}
                    />
                  </div>
                  <Title level={3} style={{ marginTop: 24, marginBottom: 8 }}>
                    Qing
                  </Title>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "15px",
                      display: "block",
                      marginBottom: 16,
                    }}
                  >
                    Co-Founder & Developer
                  </Text>
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      fontStyle: "italic",
                    }}
                  >
                    "Technology should simplify life, not complicate it.
                    Building Junior Pass with care and dedication."
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Card className="team-story-card">
            <Space
              direction="vertical"
              size={12}
              style={{ width: "100%", textAlign: "center" }}
            >
              <Text style={{ fontSize: "32px" }}>🤝</Text>
              <Title level={4} style={{ margin: 0 }}>
                From Friends to Co-Founders
              </Title>
              <Text
                style={{
                  fontSize: "15px",
                  color: "#666",
                  lineHeight: 1.7,
                  maxWidth: 600,
                  margin: "0 auto",
                  display: "block",
                }}
              >
                What started as casual conversations about the challenges
                parents face turned into a shared vision. Today, we're proud to
                serve families across Singapore, making enrichment classes
                accessible, affordable, and easy to book.
              </Text>
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
