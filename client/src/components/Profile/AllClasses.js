import React from "react";
import { Segmented } from "antd";

const AllClasses = () => {
  return (
    <>
      <h1>All Classes</h1>
      <Segmented options={["Upcoming", "History", "Favourite"]} block />
    </>
  );
};

export default AllClasses;
