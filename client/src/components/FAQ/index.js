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
      <Collapse
        items={faqList}
        style={{
          width: "100%",
          maxWidth: "600px",
        }}
        ghost
      />
    </Space>
  );
};

export default FAQ;
