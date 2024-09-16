import React from "react";
import { Alert } from "antd";
const App = ({ message, type }) => (
  <>
    <Alert message={message} type={type} showIcon />
  </>
);
export default App;
