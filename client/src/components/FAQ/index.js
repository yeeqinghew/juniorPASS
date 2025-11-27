import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import faq from "../../data/faq.json";

const { Text } = Typography;

const FAQ = () => {
  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    setFaqList(() =>
      faq.map((item, index) => ({
        key: index,
        label: (
          <Text style={{ 
            fontSize: "16px", 
            fontWeight: "600",
            color: "#333"
          }}>
            {item.question}
          </Text>
        ),
        children: (
          <Text style={{ 
            fontSize: "15px", 
            lineHeight: "1.7",
            color: "#555",
            display: "block"
          }}>
            {item.answer}
          </Text>
        ),
      }))
    );
  }, []);

  return (
    <Collapse
      items={faqList}
      expandIcon={({ isActive }) => 
        isActive ? 
          <MinusOutlined style={{ fontSize: "16px", color: "#98BDD2" }} /> : 
          <PlusOutlined style={{ fontSize: "16px", color: "#98BDD2" }} />
      }
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
      }}
      expandIconPosition="end"
      className="faq-collapse"
    />
  );
};

export default FAQ;
