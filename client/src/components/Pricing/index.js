import React, { useState } from "react";
import { Typography, Card, Col, Row, Space, Button, Badge, Divider } from "antd";
import { CheckOutlined, StarFilled, ThunderboltFilled, CrownFilled, TrophyFilled } from "@ant-design/icons";
import "./index.css"; // Import the external CSS file

const { Text, Title } = Typography;

const CardComponent = ({ plan }) => {
  const isPopular = plan.isPopular;
  const price = plan.price;
  const credits = plan.credits;
  const perCreditPrice = (price / credits).toFixed(2);
  const savingsPercent = plan.savingsPercent;

  const tierIcons = {
    basic: <StarFilled className="tier-icon" />,
    value: <ThunderboltFilled className="tier-icon" />,
    premium: <CrownFilled className="tier-icon" />
  };

  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={8}
      className="card-container"
    >
      <Card
        hoverable
        className={`pricing-card ${isPopular ? "popular-card" : ""} ${plan.tierClass || ""}`}
        bodyStyle={{ padding: "32px 24px" }}
      >
        {isPopular && <span className="popular-label">🎯 Best Value</span>}
        {savingsPercent && (
          <Badge.Ribbon text={`Save ${savingsPercent}%`} color="#52c41a" className="savings-ribbon">
            <div></div>
          </Badge.Ribbon>
        )}
        
        <div className="card-header">
          {tierIcons[plan.tierClass?.replace('-card', '')]}
          <Title level={3} className="card-title">
            {plan.name}
          </Title>
        </div>
        
        {plan.tagline && (
          <Text className="card-tagline">{plan.tagline}</Text>
        )}

        <div className="pricing-section">
          <Space direction="vertical" size={2} style={{ width: '100%' }}>
            <Text className="card-price">
              <span className="currency">SGD</span> {price}
            </Text>
            <Text className="card-credits">
              <b>{credits} credits</b> included
            </Text>
            <Divider style={{ margin: '12px 0' }} />
            <Text className="per-credit-price">
              <span className="price-label">SGD {perCreditPrice}</span> per credit
            </Text>
            {plan.comparison && (
              <Text className="comparison-text">
                {plan.comparison}
              </Text>
            )}
          </Space>
        </div>

        <Button type="primary" size="large" className="choose-plan-btn">
          Get Started
        </Button>
        
        <div className="plan-features">
          {plan.features?.map((feature, idx) => (
            <div key={idx} className="feature-item">
              <CheckOutlined className="feature-check" />
              <Text className="feature-text">{feature}</Text>
            </div>
          ))}
        </div>
      </Card>
    </Col>
  );
};

const Pricing = () => {
  const basePrice = 5.0; // Base price per credit for comparison

  const plans = [
    {
      name: "Starter",
      isPopular: false,
      price: 60,
      credits: 12,
      tagline: "Perfect for trying out classes",
      tierClass: "basic-card",
      savingsPercent: null,
      comparison: "Standard rate",
      features: [
        "12 class credits",
        "Access to all partners",
        "Flexible scheduling",
        "No expiry date"
      ]
    },
    {
      name: "Popular",
      isPopular: true,
      price: 108,
      credits: 24,
      tagline: "Most chosen by families",
      tierClass: "value-card",
      savingsPercent: 10,
      comparison: "Save SGD 12 vs Starter rate",
      features: [
        "24 class credits",
        "All Starter features",
        "Priority support",
        "10% discount applied"
      ]
    },
    {
      name: "Premium",
      isPopular: false,
      price: 152,
      credits: 38,
      tagline: "Maximum savings & flexibility",
      tierClass: "premium-card",
      savingsPercent: 20,
      comparison: "Save SGD 38 vs Starter rate",
      features: [
        "38 class credits",
        "All Popular features",
        "Dedicated support",
        "20% discount applied"
      ]
    },
  ];
  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <Badge count={<TrophyFilled style={{ color: '#faad14' }} />} offset={[10, 0]}>
          <Title level={3} className="section-subtitle">
            Transparent Pricing
          </Title>
        </Badge>
        <Title level={1} className="section-title">
          Choose Your Perfect Plan
        </Title>
        <Text className="section-description">
          Flexible credit packages that grow with your child's learning journey.<br />
          <span className="highlight-text">Buy more, save more — up to 20% off!</span>
        </Text>
      </div>

      <Row
        gutter={[24, 24]}
        justify="center"
        className="pricing-cards-row"
        wrap={true}
      >
        {plans.map((plan, idx) => (
          <CardComponent key={idx} plan={plan} />
        ))}
      </Row>

      <div className="benefits-section">
        <Title level={4} className="benefits-title">
          Why Families Love JuniorPASS
        </Title>
        <Row gutter={[24, 24]} justify="center" className="benefits-grid">
          <Col xs={24} sm={12} md={6}>
            <div className="benefit-card">
              <CheckOutlined className="benefit-icon-large" />
              <Text className="benefit-title">No Expiry</Text>
              <Text className="benefit-description">
                Use your credits anytime, at your own pace
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="benefit-card">
              <CheckOutlined className="benefit-icon-large" />
              <Text className="benefit-title">Wide Selection</Text>
              <Text className="benefit-description">
                Access classes from verified partner centers
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="benefit-card">
              <CheckOutlined className="benefit-icon-large" />
              <Text className="benefit-title">Easy Booking</Text>
              <Text className="benefit-description">
                Schedule classes in just a few clicks
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="benefit-card">
              <CheckOutlined className="benefit-icon-large" />
              <Text className="benefit-title">Secure Payment</Text>
              <Text className="benefit-description">
                Safe transactions with instant confirmation
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      <div className="pricing-footer">
        <Text className="footer-note">
          💡 <strong>Pro Tip:</strong> Larger packages offer better value per credit. 
          Credits never expire, so stock up and save!
        </Text>
      </div>
    </div>
  );
};

export default Pricing;
