import React from "react";
import { Typography, Card, Col, Row, Space, Button, Badge, Divider, Tag } from "antd";
import { 
  CheckOutlined, 
  StarFilled, 
  ThunderboltFilled, 
  CrownFilled, 
  TrophyFilled,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  CustomerServiceOutlined,
  CalendarOutlined,
  GiftOutlined,
  RocketOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./index.css";

const { Text, Title } = Typography;

const CardComponent = ({ plan, onSelect }) => {
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
    <Col xs={24} sm={24} md={24} lg={8} className="card-container">
      <Card
        hoverable
        className={`pricing-card ${isPopular ? "popular-card" : ""} ${plan.tierClass || ""}`}
      >
        {isPopular && <span className="popular-label">🎯 Best Value</span>}
        {savingsPercent && (
          <Badge.Ribbon 
            text={`Save ${savingsPercent}%`} 
            color="var(--color-success)" 
            className="savings-ribbon"
          >
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
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text className="card-price">
              <span className="currency">SGD</span> {price}
            </Text>
            <Text className="card-credits">
              <GiftOutlined style={{ marginRight: 6 }} />
              <b>{credits} credits</b> included
            </Text>
            <Divider className="pricing-divider" />
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

        <Button 
          type="primary" 
          size="large" 
          className="choose-plan-btn"
          onClick={() => onSelect(plan)}
        >
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
  const navigate = useNavigate();

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

  const benefits = [
    {
      icon: <ClockCircleOutlined className="benefit-icon-large" />,
      title: "No Expiry",
      description: "Use your credits anytime, at your own pace"
    },
    {
      icon: <SafetyCertificateOutlined className="benefit-icon-large" />,
      title: "Wide Selection",
      description: "Access classes from verified partner centers"
    },
    {
      icon: <CalendarOutlined className="benefit-icon-large" />,
      title: "Easy Booking",
      description: "Schedule classes in just a few clicks"
    },
    {
      icon: <CustomerServiceOutlined className="benefit-icon-large" />,
      title: "Secure Payment",
      description: "Safe transactions with instant confirmation"
    }
  ];

  const handleSelectPlan = (plan) => {
    navigate("/register", { state: { selectedPlan: plan } });
  };

  return (
    <div className="pricing-container">
      {/* Header Section */}
      <div className="pricing-header">
        <Tag 
          icon={<TrophyFilled />} 
          color="gold"
          className="pricing-badge"
        >
          Transparent Pricing
        </Tag>
        <Title level={1} className="section-title">
          Choose Your Perfect Plan
        </Title>
        <Text className="section-description">
          Flexible credit packages that grow with your child's learning journey.
          <br />
          <span className="highlight-text">
            <RocketOutlined style={{ marginRight: 6 }} />
            Buy more, save more — up to 20% off!
          </span>
        </Text>
      </div>

      {/* Pricing Cards */}
      <Row
        gutter={[24, 24]}
        justify="center"
        className="pricing-cards-row"
        wrap={true}
      >
        {plans.map((plan, idx) => (
          <CardComponent 
            key={idx} 
            plan={plan} 
            onSelect={handleSelectPlan}
          />
        ))}
      </Row>

      {/* Benefits Section */}
      <div className="benefits-section">
        <Title level={4} className="benefits-title">
          Why Families Love JuniorPASS
        </Title>
        <Row gutter={[24, 24]} justify="center" className="benefits-grid">
          {benefits.map((benefit, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <div className="benefit-card">
                {benefit.icon}
                <Text className="benefit-title">{benefit.title}</Text>
                <Text className="benefit-description">
                  {benefit.description}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer Note */}
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