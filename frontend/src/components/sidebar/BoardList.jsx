import React, { useState } from "react";
import { FaRegSquarePlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import BoardItem from "./BoardItem";
import "./sidebar.css";
import { useGetJobBoardsQuery } from "../../slices/api/jobBoardsApiSlice";
import NProgress from "nprogress";
import Alert from "../../components/utils/Alert";
import { useAddJobBoardMutation } from "../../slices/api/jobBoardsApiSlice";
import toast from "react-hot-toast";
import JSXMsgModal from "../utils/JSXMsgModal";
import { useNavigate } from "react-router-dom";

const BoardList = ({ onClick }) => {
  const navigate = useNavigate();
  const boardList = useSelector((state) => state.jobBoards.boardList);

  const expanded = useSelector((state) => state.sidebar.expanded);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const { data: jobBoards, error, isLoading, refetch } = useGetJobBoardsQuery();
  const [addJobBoard] = useAddJobBoardMutation();

  // use nprogress to show loading state
  if (isLoading) {
    NProgress.start();
  } else {
    NProgress.done();
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div
          className={`flex items-center ${expanded ? "justify-between" : "flex-col justify-center gap-2 text-center text-sm"}`}
        >
          <h3 className="font-semibold text-gray-400 dark:text-gray-300">
            Job Boards
          </h3>
          <div
            className="box-border cursor-pointer rounded-lg p-2 shadow-md hover:bg-light-purple-100 dark:border dark:border-slate-700 dark:text-gray-300 dark:hover:bg-dark-purple-100 dark:hover:text-dark-purple-300"
            onClick={() => setIsAddBoardModalOpen(true)}
          >
            <FaRegSquarePlus />
          </div>
        </div>
        <div className="scrollbar-hide mt-2 overflow-y-auto">
          {error ? (
            <Alert message={error?.error} type="error" />
          ) : (
            <ul>
              {boardList.map((board) => (
                <BoardItem
                  key={board.id}
                  board={board}
                  expanded={expanded}
                  onClick={onClick}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      {isAddBoardModalOpen && (
        <JSXMsgModal
          message={
            <>
              <label htmlFor="title" className="input-label">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="input-field"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
              />
            </>
          }
          onConfirm={async () => {
            if (!newBoardTitle.trim()) {
              toast.error("Please enter a title for the board.");
              return;
            }

            toast.promise(
              addJobBoard({
                title: newBoardTitle,
                description: "New Board Description",
              }).unwrap(),
              {
                loading: "Adding board...",
                success: (response) => {
                  refetch();
                  navigate(`/board/${response.result._id}`);
                  return "Board added successfully";
                },
                error: (error) => {
                  console.log(error);
                  return "Error adding board";
                },
              },
            );
            setIsAddBoardModalOpen(false);
            setNewBoardTitle(""); // Reset the title after adding
          }}
          onCancel={() => {
            setIsAddBoardModalOpen(false);
            setNewBoardTitle("");
          }}
        />
      )}
    </>
  );
};

export default BoardList;
