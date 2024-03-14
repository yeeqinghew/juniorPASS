import { ConfigProvider } from "antd";
import React from "react";
import { Outlet } from "react-router-dom";

const PartnerLayout = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#98BDD2",
          colorPrimaryActive: "#98BDD2",

          // Alias
          fontSize: 14,
          fontFamily: "Poppins, sans-serif",
        },
      }}
    >
      <div
        style={{
          backgroundColor: "#FCFBF8",
        }}
      >
        <Outlet />
      </div>
    </ConfigProvider>
  );
};

export default PartnerLayout;
