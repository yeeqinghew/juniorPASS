import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import faq from "../../data/faq.json";
import "./index.css";

const { Text } = Typography;

const FAQ = () => {
  const [faqList, setFaqList] = useState([]);

  useEffect(() => {
    setFaqList(() =>
      faq.map((item, index) => ({
        key: index,
        label: <Text className="faq-question">{item.question}</Text>,
        children: <Text className="faq-answer">{item.answer}</Text>,
      })),
    );
  }, []);

  return (
    <div className="faq-container">
      <Collapse
        items={faqList}
        expandIcon={({ isActive }) =>
          isActive ? (
            <MinusOutlined className="faq-expand-icon" />
          ) : (
            <PlusOutlined className="faq-expand-icon" />
          )
        }
        expandIconPosition="end"
        className="faq-collapse"
      />
    </div>
  );
};

export default FAQ;
