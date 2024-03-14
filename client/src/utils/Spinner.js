import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 285px - 100px - 40px)",
      }}
    >
      <Spin
        indicator={
          <LoadingOutlined
            style={{ fontSize: 100, textAlign: "center" }}
            spin
          />
        }
      ></Spin>
    </div>
  );
};
