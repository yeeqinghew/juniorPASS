import { Button, Image, Typography } from "antd";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import UserContext from "../UserContext";
const { Title, Text } = Typography;

const Class = () => {
  const { state } = useLocation();
  const { item } = state;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const _ = require("lodash");

  const handleGoBackButton = () => {
    return navigate(-1);
  };

  return (
    <>
      <LeftOutlined onClick={handleGoBackButton} />
      <Image src={item.image} preview={false} />
      <Title level={1}>{item.vendor_name}</Title>
      <Text>{item.description}</Text>
      {!_.isEmpty(user) && (
        <Button>
          <i class="fa fa-plus" aria-hidden="true">
            Add to cart
          </i>
        </Button>
      )}
    </>
  );
};

export default Class;
