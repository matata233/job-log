import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaEdit, FaRegFileAlt } from "react-icons/fa";
import "../utils/scrollbar.css";

const jobDetailsNavbar = () => {
  const navigate = useNavigate();
  const { boardId, jobId } = useParams();
  const location = useLocation();

  const navigateReplace = (path) => {
    navigate(path, { replace: true });
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="scrollbar-hide overflow-x-auto">
      <ul className="flex gap-x-8 whitespace-nowrap text-sm md:text-base">
        <li
          className={`nav-link text-gray-600 ${isActive("edit") ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
          onClick={() => navigateReplace(`/board/${boardId}/job/${jobId}/edit`)}
        >
          <FaEdit className="size-5" />
          <span>Edit</span>
        </li>

        <li
          className={`nav-link text-gray-600 ${isActive("documents") ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
          onClick={() =>
            navigateReplace(`/board/${boardId}/job/${jobId}/documents`)
          }
        >
          <FaRegFileAlt className="size-5" />
          <span>Documents</span>
        </li>
      </ul>
    </div>
  );
};

export default jobDetailsNavbar;
