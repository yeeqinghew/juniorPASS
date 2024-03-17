import React from "react";
import { Avatar, Tabs } from "antd";
import Account from "./Account";
import Child from "./Child";
import Credits from "./Credits";
import AllClasses from "./AllClasses";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const { state } = useLocation();
  const renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar
      {...props}
      style={{
        backgroundColor: "#F2F1EB",
        width: 250,
        height: "calc(100vh - 285px - 100px - 40px)",
      }}
    />
  );

  const items = [
    {
      label: "My Account",
      key: "account",
      children: <Account />,
    },
    {
      label: "Child(ren)",
      key: "child",
      children: <Child />,
    },
    {
      label: "My Classes",
      key: "classes",
      children: <AllClasses />,
    },
    {
      label: "Credit",
      key: "credit",
      children: <Credits />,
    },
  ];

  const displayPicture = (
    <Avatar
      size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
      style={{
        backgroundColor: "#f56a00",
        margin: "24px",
      }}
    >
      DP
    </Avatar>
  );

  return (
    <Tabs
      defaultActiveKey={state || "account"}
      activeKey={state}
      tabPosition={"left"}
      renderTabBar={renderTabBar}
      items={items}
      tabBarGutter={12}
      tabBarExtraContent={{ left: displayPicture }}
    />
  );
};

export default Profile;
