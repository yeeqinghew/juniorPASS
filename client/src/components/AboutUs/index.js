import React from "react";
import { Col, Row, Typography, Avatar, Space, Card } from "antd";
import {
  HeartFilled,
  RocketOutlined,
  TeamOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import "./index.css";

const { Text, Title } = Typography;

const AboutUs = () => {
  const values = [
    {
      icon: "🎯",
      title: "Parent-Centric",
      description: "Every feature designed with parents' needs in mind",
    },
    {
      icon: "⭐",
      title: "Quality First",
      description: "Only trusted, verified enrichment partners",
    },
    {
      icon: "💚",
      title: "Community Driven",
      description: "Building connections between families and partners",
    },
  ];

  const founders = [
    {
      name: "Abednego Tan",
      role: "Founder",
      emoji: "👦",
      color: "#69b1ff",
      badge: <RocketOutlined />,
      quote:
        "Every child deserves access to amazing learning opportunities. We're here to make that happen.",
    },
    {
      name: "Qing",
      role: "Co-Founder & Developer",
      emoji: "👧",
      color: "#ff85c0",
      badge: <HeartFilled />,
      quote:
        "Technology should simplify life, not complicate it. Building Junior Pass with care and dedication.",
    },
  ];

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <Title level={1} className="about-hero-title">
          About Junior Pass
        </Title>
        <Text className="about-hero-subtitle">
          Connecting parents with trusted enrichment partners across Singapore.
        </Text>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <Row gutter={[48, 48]} align="top">
          {/* Our Story */}
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

          {/* Values */}
          <Col xs={24} lg={10}>
            <div className="values-section">
              <Title level={3} className="values-title">
                Our Values
              </Title>
              <Space direction="vertical" size={16} className="values-list">
                {values.map((value, index) => (
                  <Card key={index} className="value-card">
                    <Space align="start" size={16}>
                      <div className="value-icon">{value.icon}</div>
                      <div className="value-content">
                        <Text strong className="value-title">
                          {value.title}
                        </Text>
                        <Text type="secondary" className="value-description">
                          {value.description}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </div>
          </Col>
        </Row>

        {/* Team Section */}
        <div className="team-section">
          <Title level={2} className="team-main-title">
            Meet the Founders
          </Title>
          <Text className="team-main-subtitle">
            Two passionate entrepreneurs committed to empowering families
          </Text>

          <Row gutter={[32, 32]} justify="center" className="team-row">
            {founders.map((founder, index) => (
              <Col key={index} xs={24} sm={12} md={10}>
                <Card className="team-card-large">
                  <div className="team-card-content">
                    <div className="avatar-container-large">
                      <Avatar
                        size={120}
                        className="team-avatar-large"
                        style={{ backgroundColor: founder.color }}
                      >
                        {founder.emoji}
                      </Avatar>
                      <span
                        className="avatar-badge-large"
                        style={{ color: founder.color }}
                      >
                        {founder.badge}
                      </span>
                    </div>
                    <Title level={3} className="founder-name">
                      {founder.name}
                    </Title>
                    <Text type="secondary" className="founder-role">
                      {founder.role}
                    </Text>
                    <Text className="founder-quote">"{founder.quote}"</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Card className="team-story-card">
            <Space
              direction="vertical"
              size={12}
              className="team-story-content"
            >
              <Text className="team-story-emoji">🤝</Text>
              <Title level={4} className="team-story-title">
                From Friends to Co-Founders
              </Title>
              <Text className="team-story-text">
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