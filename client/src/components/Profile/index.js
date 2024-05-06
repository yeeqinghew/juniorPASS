import React from "react";
import { Avatar, Tabs } from "antd";
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
      label: "Children",
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
      defaultActiveKey={state || "child"}
      tabPosition={"left"}
      renderTabBar={renderTabBar}
      items={items}
      tabBarGutter={12}
      tabBarExtraContent={{ left: displayPicture }}
      style={{
        borderRadius: "18px",
      }}
    />
  );
};

export default Profile;
