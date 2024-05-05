import React, { useContext } from "react";
import { Button, Divider, Flex, Image, Space, Typography } from "antd";
import UserContext from "../UserContext";

const { Text, Title } = Typography;

const Credits = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Space direction="vertical">
        <Title level={2}>Store Credit Available</Title>
        <Space direction="horizontal">
          <Image
            src={require("../../images/credit.png")}
            style={{
              height: "24px",
              width: "24px",
            }}
            preview={false}
          ></Image>
          <Text>{user?.credit}</Text>
        </Space>

        <Button>Top up</Button>
      </Space>

      <Divider />
      <Flex>
        <Title level={3}>Transaction history</Title>
      </Flex>
    </>
  );
};

export default Credits;
