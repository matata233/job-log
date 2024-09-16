import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import Job from "./Job";
import "../utils/scrollbar.css";
import { useSelector } from "react-redux";
import { RiDragMove2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import JSXMsgModal from "../utils/JSXMsgModal";
import { selectFilteredJobs } from "../../slices/jobBoardsSlice";
import {
  useUpdateColumnTitleMutation,
  useDeleteColumnMutation,
} from "../../slices/api/jobBoardsApiSlice";

import { toast } from "react-hot-toast";

const StatusColumn = ({ column, index, boardId }) => {
  const board = useSelector(
    (state) => state.jobBoards.jobBoards.boards[boardId],
  );
  const [columnHeight, setColumnHeight] = useState(window.innerHeight - 200);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [updateColumnTitle] = useUpdateColumnTitleMutation();
  const [deleteColumn] = useDeleteColumnMutation();

  const filteredJobsInColumn = useSelector((state) =>
    selectFilteredJobs(state, boardId, column.id),
  );

  useEffect(() => {
    const handleResize = () => {
      setColumnHeight(window.innerHeight - 200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    setIsEditing(false);
    if (title == "") {
      setTitle(column.title);
      return;
    }

    if (title !== column.title) {
      // check if column title already exists
      const isTitleExists = Object.values(board.columns).some(
        (col) => col.title === title && col.id !== column.id,
      );

      if (isTitleExists) {
        toast.error("Column title already exists");
        setTitle(column.title);
        return;
      }

      toast
        .promise(
          updateColumnTitle({
            boardId,
            oldStatus: {
              id: column.id,
              statusName: column.title,
            },
            newStatus: {
              id: column.id,
              statusName: title,
            },
          }).unwrap(),
          {
            loading: "Updating column title...",
            success: "Column title updated successfully",
            error: "Error updating column title",
          },
        )
        .catch((error) => {
          console.error("Failed to update column title:", error);
          setTitle(column.title);
        });
    }
  };

  return (
    <>
      <Draggable draggableId={column.id} index={index} type="column">
        {(provided, snapshot) => (
          <div
            className={`bg-light-bgColor-100 dark:bg-dark-bgColor-100 ${snapshot.isDragging ? "bg-violet-100 dark:bg-dark-purple-200" : ""}`}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className="flex flex-col items-center justify-center border-b py-2 dark:border-b-slate-700">
              <div className="flex w-full items-center justify-between">
                <div {...provided.dragHandleProps}>
                  <RiDragMove2Fill className="ml-3 size-5 cursor-move text-gray-400 hover:text-light-purple-200 dark:text-gray-300 dark:hover:text-dark-purple-200" />
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    placeholder="Column Title"
                    autoFocus
                    className="w-[60%] rounded bg-gray-200 py-1 text-center text-lg font-medium text-gray-800 focus:outline-none dark:bg-dark-bgColor-300 dark:text-gray-300"
                  />
                ) : (
                  <div
                    onClick={handleTitleClick}
                    className="w-[60%] cursor-pointer rounded py-1 text-center text-lg font-medium text-gray-800 transition duration-300 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-dark-bgColor-300"
                  >
                    {title}
                  </div>
                )}

                <MdDelete
                  className="mr-3 size-5 cursor-pointer text-gray-400 hover:text-light-purple-200 dark:text-gray-300 dark:hover:text-dark-purple-200"
                  onClick={() => setIsDeleteModalOpen(true)}
                />
              </div>

              <div className="p-2 text-center text-sm text-gray-600">
                {filteredJobsInColumn.length}{" "}
                {filteredJobsInColumn.length === 1 ? "Job" : "Jobs"}
              </div>

              <Link
                to={`/board/${boardId}/column/${column.id}/add-job`}
                className="box-border w-4/5 cursor-pointer rounded-lg px-2 py-1 text-center shadow-md transition-colors duration-300 hover:bg-light-purple-100 dark:border dark:border-slate-700 dark:hover:bg-dark-bgColor-300"
              >
                +
              </Link>
            </div>
            <Droppable droppableId={column.id} type="job">
              {(provided, snapshot) => (
                <div
                  className={`custom-scrollbar mt-2 min-h-[100px] w-64 overflow-y-auto rounded p-2 ${snapshot.isDraggingOver ? "bg-gray-200 dark:bg-dark-bgColor-300" : ""}`}
                  style={{ height: `${columnHeight}px` }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {filteredJobsInColumn.map((job, index) => (
                    <Job
                      key={job.id}
                      job={job}
                      index={index}
                      columnId={column.id}
                      boardId={boardId}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>

      {isDeleteModalOpen && (
        <JSXMsgModal
          message={
            <>
              <p className="text-lg">
                Are you sure you want to delete this column?
              </p>
              <p className="text-yellow-400">
                <strong>Warning:</strong> Jobs in this column will be archived
              </p>
            </>
          }
          onConfirm={async () => {
            toast
              .promise(
                deleteColumn({
                  boardId,
                  oldStatus: {
                    id: column.id,
                    statusName: column.title,
                  },
                }),
                {
                  loading: "Deleting column...",
                  success: "Column deleted successfully",
                  error: "Failed to delete column",
                },
              )
              .catch((error) => {
                console.error("Failed to delete column:", error);
              });

            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default StatusColumn;
