import React from "react";
import { Typography, Card, Col, Row } from "antd";
const { Text } = Typography;

const Plans = () => {
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Avaible Plans</h1>
        <Text>Simple pricing.</Text>
      </div>

      <Row gutter={16}>
        <Col span={12}>
          <Card hoverable style={{ width: 300, boxShadow: 25 }}>
            <h3>SGD 60</h3>
            <p>for 12 credits</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable style={{ width: 300, boxShadow: 25 }}>
            <h3>SGD 100</h3>
            <p>for 25 credits</p>
          </Card>
        </Col>
      </Row>
      <Text>Book classes in Singapore</Text>
    </>
  );
};

export default Plans;
