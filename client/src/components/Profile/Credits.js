import React, { useState } from "react";
import { Button, Divider, Space, Typography } from "antd";
import { createFromIconfontCN } from "@ant-design/icons";
import { useUserContext } from "../UserContext";
import TopupModal from "./TopupModal";

const { Text, Title } = Typography;
const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/c/font_4957401_wsnyu01fcm.js"],
});

const Credits = () => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const { user } = useUserContext();

  const handleTopUp = () => {
    setIsTopUpModalOpen(true);
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

      <TopupModal
        isTopUpModalOpen={isTopUpModalOpen}
        setIsTopUpModalOpen={setIsTopUpModalOpen}
      />
    </>
  );
};

export default Credits;
