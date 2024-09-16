import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ icon, text, expanded }) => {
  const location = useLocation();
  const isActive = location.pathname === `/${text.toLowerCase()}`;
  return (
    <Link to={`/${text.toLowerCase()}`}>
      <li
        className={`group relative my-1 flex cursor-pointer items-center justify-center rounded-md px-3 py-2 font-medium text-gray-600 transition-colors ${isActive ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-indigo-300" : "hover:bg-light-purple-100 dark:text-gray-50 dark:hover:bg-dark-purple-100"}`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${expanded ? "ml-3 w-52" : "w-0"}`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`invisible absolute left-full ml-2 rounded-md bg-light-purple-100 px-2 py-1 text-sm text-indigo-800 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-x-2 group-hover:opacity-100 dark:bg-dark-purple-100 dark:text-dark-purple-300`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
};

export default SidebarItem;
