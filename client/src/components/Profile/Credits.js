import React, { useState } from "react";
import { Button, Divider, Form, Input, Modal, Space, Typography } from "antd";
import { createFromIconfontCN } from "@ant-design/icons";
import { useUserContext } from "../UserContext";

const { Text, Title } = Typography;
const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/c/font_4957401_wsnyu01fcm.js"],
});

const Credits = () => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpForm] = Form.useForm();
  const { user } = useUserContext();

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <IconFont type="icon-money" />
            <Text style={{ lineHeight: "normal" }}>{user?.credit}</Text>
          </div>
        </Space>

        <Button type={"primary"} onClick={handleTopUp}>
          Top up
        </Button>
      </Space>

      <Divider />
      <Title level={3}>Transaction History</Title>
      {/* TODO: if empty shows <Empty/> */}
      <div
        style={{
          maxHeight: "400px", // Set the desired maximum height
          overflowY: "auto", // Enable vertical scrolling
          padding: "16px", // Optional padding for styling
          border: "1px solid #f0f0f0", // Optional border for styling
          borderRadius: "4px", // Optional border radius for styling
        }}
      >
        {/* TODO: Get transaction history */}
      </div>

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
