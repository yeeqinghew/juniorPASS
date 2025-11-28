import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import faq from "../../data/faq.json";
import "./index.css";

const { Title, Text, Paragraph } = Typography;

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
    <div className="faq-container">
      <Title level={1} className="faq-title">
        Frequently Asked Questions
      </Title>
      <Paragraph className="faq-subtitle">
        Find answers to common questions about juniorPASS, our services, and how to get started
      </Paragraph>
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
    </div>
  );
};

export default FAQ;
