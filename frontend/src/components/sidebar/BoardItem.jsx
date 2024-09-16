import React from "react";
import { Tooltip } from "react-tooltip";
import { Link, useParams } from "react-router-dom";

const BoardItem = ({ board, expanded, onClick }) => {
  const { boardId } = useParams();
  const isActive = boardId === board.id;

  return (
    <>
      <Link to={`/board/${board.id}`} onClick={onClick}>
        <li
          key={board.id}
          className={`group relative my-2 flex cursor-pointer items-center justify-center rounded-md border p-2 text-gray-600 hover:bg-light-purple-100 hover:text-indigo-800 dark:border-slate-700 dark:hover:bg-dark-purple-100 dark:hover:text-dark-purple-300 ${expanded ? "text-sm" : "text-[10px]"} ${isActive ? "border border-indigo-800 bg-light-purple-100 text-indigo-800 dark:border-dark-purple-300 dark:bg-dark-purple-100 dark:text-dark-purple-300" : ""}`}
          data-tooltip-id="boardItem-tooltip"
          data-tooltip-content={board.title}
        >
          <div
            className={`flex items-center overflow-hidden truncate whitespace-nowrap`}
          >
            {board.title}
          </div>
        </li>
      </Link>

      {!expanded && <Tooltip id="boardItem-tooltip" />}
    </>
  );
};

export default BoardItem;
