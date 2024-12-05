import React, { useContext } from "react";
import { Avatar, Tabs } from "antd";
import Account from "./Account";
import Child from "./Child";
import Credits from "./Credits";
import AllClasses from "./AllClasses";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../UserContext";

const Profile = () => {
  const { state } = useLocation();
  const { user } = useUserContext();

  const renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar
      {...props}
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    />
  );

  const items = [
    {
      label: "Account",
      key: "account",
      children: <Account />,
    },
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
      src={user?.display_picture}
      alt={user?.name}
      style={{
        margin: "24px",
      }}
    />
  );

  return (
    <div style={{ display: "flex" }}>
      <Tabs
        defaultActiveKey={state || "child"}
        tabPosition={"left"}
        renderTabBar={renderTabBar}
        tabBarExtraContent={{ left: displayPicture }}
        items={items}
        tabBarGutter={12}
        style={{
          flex: 1,
          marginLeft: "16px",
        }}
      />
    </div>
  );
};

export default Profile;
