import { useEffect } from "react";
import { Layout, Typography, Card, Row, Col, Tag, Space, Divider } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import "./PackageTypes.css";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

function PackageTypes() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
    window.scrollTo(0, 0);
  }, []);

  const packages = [
    {
      title: "Pay-As-You-Go",
      icon: <ThunderboltOutlined />,
      color: "#52c41a",
      gradient: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
      tagColor: "success",
      description:
        "Perfect for trying out activities without long-term commitment. Pay only for the classes you attend.",
      features: [
        "No commitment required",
        "Book individual classes",
        "Flexible scheduling",
        "Cancel anytime without penalty",
        "Try different activities easily",
        "Pay per session attended",
      ],
      bestFor: [
        "Parents exploring new activities for their child",
        "Trying out different classes before committing",
        "Irregular schedules or busy families",
        "One-off events or workshops",
      ],
      creditUsage: "1-2 credits per class (varies by partner)",
      example:
        "Book a single dance class this Saturday, a cooking workshop next week, and a swimming lesson whenever your schedule allows.",
    },
    {
      title: "Short-Term Package",
      icon: <CalendarOutlined />,
      color: "#1890ff",
      gradient: "linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)",
      tagColor: "processing",
      description:
        "Commit to a series of classes over 4-12 weeks. Great for developing skills with some structure and often comes with savings.",
      features: [
        "Fixed duration (4-12 weeks typically)",
        "Discounted rates vs pay-as-you-go",
        "Regular weekly schedule",
        "Build consistency and routine",
        "Better value for committed learners",
        "Structured curriculum",
      ],
      bestFor: [
        "Children learning a new skill systematically",
        "Building habits and routines",
        "Families wanting some commitment but not long-term",
        "Seasonal activities (summer camps, holiday programs)",
      ],
      creditUsage: "Package deal - typically 20-30% savings",
      example:
        "Sign up for an 8-week art course meeting every Tuesday, or a 6-week tennis program to learn fundamentals.",
    },
    {
      title: "Long-Term Package",
      icon: <CrownOutlined />,
      color: "#722ed1",
      gradient: "linear-gradient(135deg, #722ed1 0%, #9254de 100%)",
      tagColor: "purple",
      description:
        "Full commitment for a term or year. Maximum savings and priority access for serious learners building mastery.",
      features: [
        "Extended duration (3+ months or full term)",
        "Maximum savings (30-50% vs pay-as-you-go)",
        "Priority booking and slots",
        "Progress tracking and reports",
        "Deeper learning and mastery",
        "Community building with classmates",
      ],
      bestFor: [
        "Serious skill development and mastery",
        "Children passionate about an activity",
        "Long-term commitment to a hobby or sport",
        "Families wanting maximum value",
      ],
      creditUsage: "Bulk package - up to 50% savings on credits",
      example:
        "Enroll in a full-year piano program, a semester of competitive swimming, or a 6-month coding bootcamp.",
    },
  ];

  const comparisonData = [
    {
      aspect: "Commitment",
      payAsYouGo: "None - book anytime",
      shortTerm: "4-12 weeks",
      longTerm: "3+ months",
    },
    {
      aspect: "Cost Savings",
      payAsYouGo: "Standard pricing",
      shortTerm: "20-30% discount",
      longTerm: "30-50% discount",
    },
    {
      aspect: "Flexibility",
      payAsYouGo: "High",
      shortTerm: "Medium",
      longTerm: "Low",
    },
    {
      aspect: "Cancellation",
      payAsYouGo: "Cancel anytime",
      shortTerm: "Partial refund possible",
      longTerm: "Limited refunds",
    },
    {
      aspect: "Best For",
      payAsYouGo: "Exploration",
      shortTerm: "Skill building",
      longTerm: "Mastery",
    },
  ];

  return (
    <Layout className="package-types-layout">
      <Content className="package-types-content">
        {/* Hero Section */}
        <div className="package-hero" data-aos="fade-down">
          <Title level={1} className="package-hero-title">
            Choose Your Learning Journey
          </Title>
          <Paragraph className="package-hero-subtitle">
            Understanding our package types helps you make the best choice for
            your child's learning needs and your family's schedule.
          </Paragraph>
        </div>

        {/* Package Cards */}
        <div className="packages-container">
          <Row gutter={[32, 32]}>
            {packages.map((pkg, index) => (
              <Col xs={24} sm={24} md={24} lg={8} key={index}>
                <Card
                  className="package-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  style={{
                    borderTop: `4px solid ${pkg.color}`,
                  }}
                >
                  <div className="package-card-header">
                    <div
                      className="package-icon"
                      style={{ background: pkg.gradient }}
                    >
                      {pkg.icon}
                    </div>
                    <Title level={2} className="package-card-title">
                      {pkg.title}
                    </Title>
                    <Tag color={pkg.tagColor} className="package-tag">
                      {pkg.title.toUpperCase()}
                    </Tag>
                  </div>

                  <Paragraph className="package-description">
                    {pkg.description}
                  </Paragraph>

                  <Divider />

                  <div className="package-features">
                    <Text strong className="section-label">
                      <CheckCircleOutlined /> Key Features
                    </Text>
                    <ul className="feature-list">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx}>
                          <CheckCircleOutlined
                            style={{ color: pkg.color, marginRight: 8 }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Divider />

                  <div className="package-best-for">
                    <Text strong className="section-label">
                      <InfoCircleOutlined /> Best For
                    </Text>
                    <ul className="best-for-list">
                      {pkg.bestFor.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <Divider />

                  <div className="package-credits">
                    <Space direction="vertical" size={4}>
                      <Text strong className="section-label">
                        <DollarOutlined /> Credit Usage
                      </Text>
                      <Text className="credit-info">{pkg.creditUsage}</Text>
                    </Space>
                  </div>

                  <Divider />

                  <div className="package-example">
                    <Text strong className="section-label">
                      Example
                    </Text>
                    <Paragraph className="example-text">
                      {pkg.example}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Comparison Table */}
        <div className="comparison-section" data-aos="fade-up">
          <Title level={2} className="comparison-title">
            Quick Comparison
          </Title>
          <Card className="comparison-card">
            <div className="comparison-table">
              <div className="comparison-header">
                <div className="comparison-cell header-cell">Aspect</div>
                <div className="comparison-cell header-cell">
                  <ThunderboltOutlined /> Pay-As-You-Go
                </div>
                <div className="comparison-cell header-cell">
                  <CalendarOutlined /> Short-Term
                </div>
                <div className="comparison-cell header-cell">
                  <CrownOutlined /> Long-Term
                </div>
              </div>
              {comparisonData.map((row, idx) => (
                <div className="comparison-row" key={idx}>
                  <div className="comparison-cell aspect-cell">
                    {row.aspect}
                  </div>
                  <div className="comparison-cell">{row.payAsYouGo}</div>
                  <div className="comparison-cell">{row.shortTerm}</div>
                  <div className="comparison-cell">{row.longTerm}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-section" data-aos="fade-up">
          <Title level={2} className="section-title">
            How Our Credit System Works
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="step-card">
                <div className="step-number">1</div>
                <Title level={4}>Top Up Credits</Title>
                <Text>
                  Purchase credits in your account. Credits never expire.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="step-card">
                <div className="step-number">2</div>
                <Title level={4}>Choose Package</Title>
                <Text>
                  Select the package type that fits your needs and schedule.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="step-card">
                <div className="step-number">3</div>
                <Title level={4}>Book Classes</Title>
                <Text>
                  Use your credits to book classes based on your chosen package.
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="step-card">
                <div className="step-number">4</div>
                <Title level={4}>Enjoy Learning</Title>
                <Text>
                  Your child attends classes and develops new skills!
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* FAQ Section */}
        <div className="package-faq-section" data-aos="fade-up">
          <Title level={2} className="section-title">
            Common Questions
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={4}>Can I switch between package types?</Title>
                <Paragraph>
                  Yes! You can try pay-as-you-go classes first, then switch to
                  a short-term or long-term package when you're ready to
                  commit. Each class listing shows available package options.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={4}>Do credits expire?</Title>
                <Paragraph>
                  No! Your credits never expire and can be used for any package
                  type. Top up anytime and use them at your own pace.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={4}>Which package should I choose?</Title>
                <Paragraph>
                  Start with pay-as-you-go if you're exploring. Choose
                  short-term when you want to build a skill over a few weeks.
                  Go long-term when you're committed to mastery and want
                  maximum savings.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="faq-card">
                <Title level={4}>What if I need to cancel?</Title>
                <Paragraph>
                  Cancellation policies vary by package type and partner. Check
                  the specific terms when booking. Generally, pay-as-you-go
                  offers the most flexibility.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}

export default PackageTypes;
