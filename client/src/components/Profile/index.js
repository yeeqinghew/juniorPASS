import React, { useEffect, useState } from "react";
import { Typography } from "antd";
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

  return (
    <>
      <h1>Profile</h1>
      <Text>{name}</Text>
    </>
  );
};

export default Profile;
