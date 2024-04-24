import { Button, Flex, Image, Space, Typography } from "antd";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import UserContext from "../UserContext";

const { Title, Text } = Typography;
const _ = require("lodash");

const Class = () => {
  const { state } = useLocation();
  const { item } = state;
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
        <Title lev={1}>{item.listing_title}</Title>
      </Flex>
      <Image
        src={item.image}
        preview={false}
        style={{
          width: "500px",
        }}
      />
      <Space direction={"vertical"}>
        <Title level={1}>{item.vendor_name}</Title>
        <Text>{item.description}</Text>
        <Text>Pacakage Types</Text>
        {item.package_types.map((type) => {
          return <Text>{type}</Text>;
        })}
        {item.category.map((category) => {
          return <Text>{category}</Text>;
        })}
        {item.age_group.map((age) => {
          return <Text>{age}</Text>;
        })}
        {item.string_outlet_schedules.map((item) => {
          return <Text>{item?.address?.ADDRESS}</Text>;
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
