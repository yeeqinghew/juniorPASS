import React, { useEffect, useState } from "react";
import { Tabs, Typography } from "antd";
import StickyBox from "react-sticky-box";

const { Title, Text } = Typography;

const Profile = () => {
  const [name, setName] = useState(null);
  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/", {
          method: "GET",
          headers: {
            token: JSON.parse(localStorage.user).token,
          },
        });

        const parseRes = await response.json();
        setName(parseRes.name);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchName();
  }, []);

  const renderTabBar = (props, DefaultTabBar) => (
    <StickyBox
      offsetTop={64}
      offsetBottom={20}
      style={{
        zIndex: 1,
      }}
    >
      <DefaultTabBar {...props} />
    </StickyBox>
  );

  const items = [
    {
      label: "My Account",
      key: "account",
      children: (
        <>
          <h1>Profile</h1>
          <Text>{name}</Text>
        </>
      ),
    },
    {
      label: "Child(ren)",
      key: "child",
      children: `Content of My Child(ren)`,
    },
    {
      label: "Credit",
      key: "credit",
      children: `Content of Credit`,
    },
    {
      label: "My Classes",
      key: "classes",
      children: `Content of My Classes`,
    },
  ];
  return (
    <>
      <Tabs
        type="card"
        tabPosition={"left"}
        renderTabBar={renderTabBar}
        items={items}
        tabBarStyle={{
          height: "100%",
          color: "red",
        }}
        tabBarGutter={4}
      />
    </>
  );
};

export default Profile;
