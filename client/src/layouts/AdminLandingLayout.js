import React, { useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";

const AdminLandingLayout = () => {
  const [isAdminAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // check if admin is login
    // if login, bring to homepage
  }, []);

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

export default AdminLandingLayout;
