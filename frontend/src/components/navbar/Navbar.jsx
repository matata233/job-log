import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsKanban } from "react-icons/bs";
import { IoAnalyticsSharp } from "react-icons/io5";
import SearchBar from "./SearchBar";
import "../utils/scrollbar.css";
import { useUpdateJobBoardTitleMutation } from "../../slices/api/jobBoardsApiSlice";
import BoardMenu from "./BoardMenu";
import toast from "react-hot-toast";

const Navbar = ({ board }) => {
  const location = useLocation();
  const expanded = useSelector((state) => state.sidebar.expanded);
  const isMobile = useSelector((state) => state.mobile.isMobile);
  const { boardId } = useParams();
  const isBoard = location.pathname === `/board/${boardId}`;
  const isDocuments = location.pathname === `/board/${boardId}/documents`;
  const isReports = location.pathname === `/board/${boardId}/reports`;

  const [isEditing, setIsEditing] = useState(false);
  const [boardTitle, setBoardTitle] = useState(board?.title);

  const [updateJobBoardTitle] = useUpdateJobBoardTitleMutation();

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setBoardTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditing(false);
    if (boardTitle == "") {
      setBoardTitle(board.title);
      return;
    }

    if (boardTitle !== board.title) {
      toast.promise(
        updateJobBoardTitle({
          boardId,
          title: boardTitle,
        }).unwrap(),
        {
          loading: "Updating board title...",
          success: "Board title updated successfully",
          error: (error) => {
            return error?.data?.error || "Failed to update board title";
          },
        },
      );
    }
  };

  return (
    <>
      {/* larger than md */}
      <div
        className={`fixed hidden ${expanded ? (isMobile ? "left-0" : "left-64") : "left-20"} right-0 top-0 z-30 items-center justify-between gap-6 border-b bg-light-bgColor-200 p-4 transition-all duration-300 dark:border-b-slate-700 dark:bg-dark-bgColor-200 sm:flex`}
      >
        <div className="flex items-center gap-2">
          <BoardMenu boardId={boardId} />
          {isEditing ? (
            <input
              type="text"
              value={boardTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              placeholder="Board Title"
              autoFocus
              className="w-32 min-w-32 rounded bg-gray-200 py-1 text-center text-lg font-medium text-gray-800 focus:outline-none dark:bg-dark-bgColor-300 dark:text-gray-300"
            />
          ) : (
            <div
              onClick={handleTitleClick}
              className="w-32 min-w-32 cursor-pointer overflow-hidden text-ellipsis rounded py-1 text-center text-lg font-medium text-gray-800 transition duration-300 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-dark-bgColor-300"
            >
              {boardTitle}
            </div>
          )}
        </div>

        <div className="scrollbar-hide overflow-x-auto">
          <ul className="flex items-center gap-x-8">
            <Link to={`/board/${boardId}`}>
              <li
                className={`nav-link text-gray-600 ${isBoard ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
              >
                <BsKanban className="size-5" />
                <span>Board</span>
              </li>
            </Link>

            <Link to={`/board/${boardId}/reports`}>
              <li
                className={`nav-link text-gray-600 ${isReports ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
              >
                <IoAnalyticsSharp className="size-5" />
                <span>Reports</span>
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex-shrink-0">
          <SearchBar />
        </div>
      </div>

      {/* smaller than md */}
      <div
        className={`fixed sm:hidden ${expanded ? (isMobile ? "left-0" : "left-64") : "left-20"} right-0 top-0 z-30 flex flex-col items-center justify-between gap-4 border-b bg-light-bgColor-200 p-4 transition-all duration-300 dark:border-b-slate-700 dark:bg-dark-bgColor-200`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="ml-10">
              <BoardMenu boardId={boardId} />
            </div>

            {isEditing ? (
              <input
                type="text"
                value={boardTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                placeholder="Board Title"
                autoFocus
                className="w-32 min-w-32 rounded bg-gray-200 py-1 text-center text-lg font-medium text-gray-800 focus:outline-none dark:bg-dark-bgColor-300 dark:text-gray-300"
              />
            ) : (
              <div
                onClick={handleTitleClick}
                className="w-32 min-w-32 cursor-pointer overflow-hidden text-ellipsis rounded py-1 text-center text-lg font-medium text-gray-800 transition duration-300 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-dark-bgColor-300"
              >
                {boardTitle}
              </div>
            )}
          </div>
          <div>
            <SearchBar />
          </div>
        </div>

        <div className="scrollbar-hide overflow-x-auto">
          <ul className="flex items-center gap-x-8">
            <Link to={`/board/${boardId}`}>
              <li
                className={`nav-link text-gray-600 ${isBoard ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
              >
                <BsKanban className="size-5" />
                <span>Board</span>
              </li>
            </Link>

            <Link to={`/board/${boardId}/reports`}>
              <li
                className={`nav-link text-gray-600 ${isReports ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
              >
                <IoAnalyticsSharp className="size-5" />
                <span>Reports</span>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
