import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 48, color: "#6E57D6" }} spin />
        }
      />
    </div>
  );
};

export default Loader;
