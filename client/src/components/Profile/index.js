import React from "react";
import { Avatar, Tabs, Space } from "antd";
import Account from "./Account";
import Child from "./Child";
import Credits from "./Credits";
import AllClasses from "./AllClasses";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../UserContext";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import "./index.css";

const Profile = () => {
  const { state } = useLocation();
  const { user } = useUserContext();
  const { isMobile, isTabletPortrait } = useWindowDimensions();
  const isMobileOrTabletPortrait = isMobile || isTabletPortrait;

  const items = [
    {
      label: "Account",
      key: "account",
      children: (
        <div className="profile-tab-content">
          <Account />
        </div>
      ),
    },
    {
      label: "Children",
      key: "child",
      children: (
        <div className="profile-tab-content">
          <Child />
        </div>
      ),
    },
    {
      label: "My Classes",
      key: "classes",
      children: (
        <div className="profile-tab-content">
          <AllClasses />
        </div>
      ),
    },
    {
      label: "Credit",
      key: "credit",
      children: (
        <div className="profile-tab-content">
          <Credits />
        </div>
      ),
    },
  ];

  const avatarSection = (
    <div className="profile-avatar-container">
      <Avatar
        size={isMobileOrTabletPortrait ? 64 : 80}
        src={user?.display_picture}
        alt={user?.name}
        className="profile-avatar"
      />
      {user?.name && <div className="profile-user-name">{user.name}</div>}
      {user?.email && <div className="profile-user-email">{user.email}</div>}
    </div>
  );

  return (
    <div className="profile-container">
      {isMobileOrTabletPortrait && avatarSection}
      <div className="profile-tabs">
        <Tabs
          defaultActiveKey={state || "child"}
          tabPosition={isMobileOrTabletPortrait ? "top" : "left"}
          tabBarExtraContent={
            isMobileOrTabletPortrait ? null : { top: avatarSection }
          }
          items={items}
          tabBarGutter={isMobileOrTabletPortrait ? 0 : 12}
        />
      </div>
    </div>
  );
};

export default Profile;
