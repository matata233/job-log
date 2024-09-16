import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { useParams, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const CommonLayout = () => {
  const { boardId } = useParams();
  const boards = useSelector((state) => state.jobBoards.jobBoards.boards);
  const board = boardId ? boards[boardId] : null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow py-4">
        {boardId && board ? <Navbar board={board} key={board.id} /> : null}
        <Outlet />
      </div>
    </div>
  );
};

export default CommonLayout;
