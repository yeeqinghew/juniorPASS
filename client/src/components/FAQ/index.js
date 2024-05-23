import React, { useEffect, useState } from "react";
import { Collapse, Typography, Button, Space } from "antd";
import faq from "../../data/faq.json";

const { Title, Text } = Typography;

const FAQ = () => {
  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    setFaqList(() =>
      faq.map((item, index) => ({
        key: index,
        label: item.question,
        children: <>{item.answer}</>,
      }))
    );
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%", alignItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <Title>FAQ</Title>
        <Text>
          Find answers to common questions about our services, booking process
          and credit system.
        </Text>
      </div>

      <Collapse
        items={faqList}
        style={{
          width: "100%",
          maxWidth: "600px",
        }}
      />

      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <Space direction="vertical">
          <Text>Didn't find the answer you are looking for?</Text>
          <Button type="primary">Contact us</Button>
        </Space>
      </div>
    </Space>
  );
};

export default FAQ;
