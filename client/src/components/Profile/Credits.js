import React, { useContext, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Typography,
} from "antd";
import UserContext from "../UserContext";

const { Text, Title } = Typography;

const Credits = () => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpForm] = Form.useForm();
  const { user } = useContext(UserContext);

  const handleTopUp = () => {
    setIsTopUpModalOpen(true);
  };

  const handleCancel = () => {
    setIsTopUpModalOpen(false);
  };

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

        <Button type={"primary"} onClick={handleTopUp}>
          Top up
        </Button>
      </Space>

      <Divider />
      <Flex>
        <Title level={3}>Transaction history</Title>
      </Flex>

      <Modal
        title={"Top up"}
        open={isTopUpModalOpen}
        onCancel={handleCancel}
        centered
        style={{
          borderRadius: "18px",
        }}
        footer={
          <Button
            form="topUpForm"
            key="submit"
            htmlType="submit"
            // onClick={handleAddChild}
          >
            Next
          </Button>
        }
      >
        {/* TODO: top up packages */}
        {/* TODO: top up custom amount */}
        <Form form={topUpForm} autoComplete="off" layout="vertical">
          <Form.Item name="amount" label="Top up amount">
            <Input placeholder="Custom amount (e.g. 10, 20)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Credits;
