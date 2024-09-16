import React from "react";
import { Dropdown, Space } from "antd";
import { HiDotsVertical } from "react-icons/hi";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import { setTheme } from "../../slices/themeSlice";
import { useNavigate } from "react-router-dom";
import "./userMenu.css";

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const theme = useSelector((state) => state.theme.theme);

  const onClick = ({ key }) => {
    switch (key) {
      case "logout":
        dispatch(logout());
        navigate("/");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "light":
      case "dark":
      case "system":
        dispatch(setTheme(key));
        break;
      default:
        console.log("No key found");
    }
  };

  const getModeIcon = () => {
    switch (theme) {
      case "light":
        return <FaSun />;
      case "dark":
        return <FaMoon />;
      case "system":
        return <FaDesktop />;
      default:
        return <FaDesktop />;
    }
  };

  const items = [
    {
      label: (
        <div className="flex flex-col items-start">
          <span className="font-semibold text-light-purple-300">
            {userInfo.firstName} {userInfo.lastName}
          </span>
          <span className="text-sm text-gray-600">
            username: {userInfo.username}{" "}
          </span>
        </div>
      ),
      key: "userInfo",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      label: "Settings",
      key: "settings",
    },
    {
      label: (
        <div className="flex items-center justify-start gap-2">
          {getModeIcon()} Mode
        </div>
      ),
      key: "mode",
      children: [
        {
          label: (
            <div
              className={`flex items-center justify-start gap-2 ${theme == "light" ? "text-light-purple-300 dark:text-dark-purple-300" : " "}`}
            >
              <FaSun /> Light
            </div>
          ),
          key: "light",
        },
        {
          label: (
            <div
              className={`flex items-center justify-start gap-2 ${theme == "dark" ? "text-light-purple-300 dark:text-dark-purple-300" : " "}`}
            >
              <FaMoon /> Dark
            </div>
          ),
          key: "dark",
        },
        {
          label: (
            <div
              className={`flex items-center justify-start gap-2 ${theme == "system" ? "text-light-purple-300 dark:text-dark-purple-300" : " "}`}
            >
              <FaDesktop /> System
            </div>
          ),
          key: "system",
        },
      ],
    },
    {
      label: "Logout",
      key: "logout",
      danger: true,
    },
  ];

  return (
    <>
      <Dropdown menu={{ items, onClick }} placement="bottomRight">
        <a
          className="flex cursor-pointer items-center p-2 text-xl hover:text-light-purple-100 dark:text-dark-purple-300"
          onClick={(e) => e.preventDefault()}
        >
          <Space>
            <HiDotsVertical />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default UserMenu;
