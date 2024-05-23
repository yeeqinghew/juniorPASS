import React from "react";
import { Typography, Card, Col, Row, Space } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const CardComponent = ({ planName, planClass, price, credits }) => {
  return (
    <Col>
      <Card
        hoverable
        style={{
          boxShadow: 25,
          width: "fit-content",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: "2.5rem",
          margin: "12px",
          borderRadius: "25px",
          textAlign: "center",
          transition: "0.3s",
          cursor: "pointer",
        }}
      >
        <div className={planClass}>
          {planClass === "popularPlan" && (
            <span
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(=50%)",
                backgroundColor: "black",
                color: "#fff",
                padding: "4px 20px",
                fontSize: "18px",
                borderRadius: "5px",
              }}
            >
              Most Popular
            </span>
          )}
          <Title level={3}>{planName}</Title>
          <Text style={{ fontSize: "30px" }}>
            <b>SGD {price}</b>{" "}
          </Text>
          <Text>
            for <b>{credits}</b> credits
          </Text>
        </div>
      </Card>
    </Col>
  );
};

const Pricing = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <Text>Discover</Text>
        <Title level={1}>Available Pricing</Title>
        <Text>Choose the perfect pricing plans for your needs</Text>
      </div>

      <Row
        align={"center"}
        style={{
          margin: "24px 0",
        }}
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
      <Space direction="vertical">
        <Text>
          <CheckOutlined />
          No expiration date
        </Text>
        <Text>
          <CheckOutlined />
          Flexible Credits
          {/* Purchase credits that can be used to book any class on our platform. */}
        </Text>
        <Text>
          <CheckOutlined />
          Easy Scheduling
          {/* Book classes at your convenience with our user-friendly scheduling system. */}
        </Text>
        <Text>
          <CheckOutlined />
          Secure Payments
          {/* All transactions are secure and encrypted for your peace of mind. */}
        </Text>
      </Space>
    </div>
  );
};

export default Pricing;
