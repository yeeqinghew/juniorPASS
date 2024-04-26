import { Button, Flex, Image, Space, Typography } from "antd";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import UserContext from "../UserContext";

const { Title, Text } = Typography;
const _ = require("lodash");

const Class = () => {
  const { state } = useLocation();
  const { listing } = state;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleGoBackButton = () => {
    return navigate(-1);
  };

  return (
    <Flex vertical>
      <Flex
        style={{
          alignItems: "center",
          padding: "24px",
        }}
      >
        <LeftOutlined
          onClick={handleGoBackButton}
          style={{
            fontSize: "24px",
          }}
        />
        <Title lev={1}>{listing?.listing_title}</Title>
      </Flex>
      <Image
        src={listing?.image}
        preview={false}
        style={{
          width: "500px",
        }}
      />
      <Space direction={"vertical"}>
        <Title level={1}>{listing?.listing_title}</Title>
        <Text>{listing?.description}</Text>
        <Text>Pacakage Types</Text>
        {listing?.package_types.map((type) => {
          return <Text>{type}</Text>;
        })}
        {listing?.categories.map((category) => {
          return <Text>{category}</Text>;
        })}
        {listing?.age_group.map((age) => {
          return <Text>{age}</Text>;
        })}
        {listing?.string_outlet_schedules.map((listing) => {
          return <Text>{listing?.address?.ADDRESS}</Text>;
        })}
      </Space>

      {!_.isEmpty(user) && (
        <Button>
          <i class="fa fa-plus" aria-hidden="true">
            Add to cart
          </i>
        </Button>
      )}
    </Flex>
  );
};

export default Class;
