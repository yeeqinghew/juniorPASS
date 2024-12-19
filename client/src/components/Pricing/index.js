import React from "react";
import { Typography, Card, Col, Row, Space, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./index.css"; // Import the external CSS file

const { Text, Title } = Typography;

const CardComponent = ({ planName, planClass, price, credits }) => {
  const isPopular = planClass === "popularPlan";

  return (
    <Col
      xs={24} // Full-width on mobile
      sm={24} // Full-width on tablet portrait
      md={24} // 1/3 width on tablet landscape (3 items per row)
      lg={8}
      className="card-container"
    >
      <Card
        hoverable
        className={`pricing-card ${isPopular ? "popular-card" : ""}`}
        bodyStyle={{ padding: "24px" }}
        onClick={() => console.log(`${planName} clicked`)}
      >
        {isPopular && <span className="popular-label">Most Popular</span>}
        <Title level={4} className="card-title">
          {planName}
        </Title>
        <Text className="card-price">SGD {price}</Text>
        <Text className="card-credits">
          for <b>{credits}</b> credits
        </Text>
        <Button type="primary" size="large" className="choose-plan-btn">
          Choose Plan
        </Button>
      </Card>
    </Col>
  );
};

const Pricing = () => {
  return (
    <div className="pricing-container">
      <Title level={3} className="section-subtitle">
        Discover
      </Title>
      <Title level={1} className="section-title">
        Available Pricing
      </Title>
      <Text className="section-description">
        Choose the perfect pricing plans for your needs
      </Text>

      <Row
        gutter={[16, 16]}
        justify="center"
        className="pricing-cards-row"
        wrap={true}
      >
        <CardComponent
          planName="Basic"
          planClass="plan"
          price="60"
          credits="12"
        />
        <CardComponent
          planName="Value"
          planClass="popularPlan"
          price="108"
          credits="24"
        />
        <CardComponent
          planName="Premium"
          planClass="plan"
          price="152"
          credits="38"
        />
      </Row>

      <Space direction="vertical" className="benefits-list">
        <Text className="benefit-item">
          <CheckOutlined className="benefit-icon" />
          No expiration date
        </Text>
        <Text className="benefit-item">
          <CheckOutlined className="benefit-icon" />
          Flexible Credits
        </Text>
        <Text className="benefit-item">
          <CheckOutlined className="benefit-icon" />
          Easy Scheduling
        </Text>
        <Text className="benefit-item">
          <CheckOutlined className="benefit-icon" />
          Secure Payments
        </Text>
      </Space>
    </div>
  );
};

export default Pricing;
