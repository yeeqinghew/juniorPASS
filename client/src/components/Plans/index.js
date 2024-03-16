import React from "react";
import { Typography, Card, Col, Row } from "antd";
import { CheckOutlined } from "@ant-design/icons";
const { Text, Title } = Typography;

const CardComponent = ({ planName, planClass, price, credits }) => {
  return (
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
        <Text style={{ fontSize: "30px" }}>SGD {price} </Text>
        <Text> for {credits} credits</Text>
      </div>
    </Card>
  );
};

const Plans = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <Title level={1}>Avaible Plans</Title>
        <Text>Simple pricing.</Text>
      </div>

      <Row align={"center"}>
        <Col>
          <CardComponent
            planName="Basic"
            planClass="plan"
            price="60"
            credits="12"
          />
        </Col>
        <Col>
          <CardComponent
            planName="Value"
            planClass="popularPlan"
            price="100"
            credits="25"
          />
        </Col>
      </Row>
      <Text>
        <CheckOutlined />
        Book classes in Singapore
      </Text>
    </div>
  );
};

export default Plans;
