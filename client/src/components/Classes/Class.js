import { Image, Typography } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

const Class = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { item } = state;

  const handleGoBackButton = () => {
    return navigate(-1);
  };

  return (
    <>
      <LeftOutlined onClick={handleGoBackButton} />
      <Image src={item.picture} preview={false} />
      <Title level={1}>{item.vendor_name}</Title>
      <Text>{item.description}</Text>
    </>
  );
};

export default Class;
