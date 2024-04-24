import React, { useEffect, useState } from "react";
import { Collapse, Typography } from "antd";
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
    <div>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Title>FAQ</Title>
        <Text>
          Find answers to common questions about our services, booking process
          and credit system.
        </Text>
      </div>

      <Collapse items={faqList} />
    </div>
  );
};

export default FAQ;
