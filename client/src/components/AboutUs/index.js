import { Col, Image, Row, Typography } from "antd";
import React from "react";

const { Text, Title } = Typography;

const AboutUs = () => {
  return (
    <div>
      <Title level={1}>about juniorPASS</Title>
      <Row>
        <Col span={12}>
          <Text>
            At juniorPASS, we strive to transform the children enrichment sector
            in Singapore by bringing premier enrichment classes and experiences
            within a single place. If you're looking for swimming lesson or a
            piano lesson for your kids, fret not - simply book them online
            through our site.
          </Text>
        </Col>
        <Col span={2}></Col>
        <Col span={10} style={{ display: "flex", alignItems: "flex-end" }}>
          <Image src={require("../../images/group.png")} preview={false} />
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
