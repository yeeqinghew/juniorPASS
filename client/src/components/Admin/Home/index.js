import React, { useEffect } from "react";
import toast from "react-hot-toast";

const AdminHome = () => {
  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await fetch(
          "http://localhost:5000/admin/getAllUsers",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const parseRes = await response.json();
        console.log("praseRes", parseRes);
      } catch (err) {
        console.error(err.message);
        toast.error("ERROR in /admin/getAllUsers");
      }
    }

    getAllUsers();
  }, []);
  return <>Users</>;
};

export default AdminHome;
