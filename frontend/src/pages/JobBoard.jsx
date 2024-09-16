import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Outlet } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { moveJobWithinBoard, addColumn } from "../slices/jobBoardsSlice";
import StatusColumn from "../components/kanban/StatusColumn";
import AddColumn from "../components/kanban/AddColumn";
import {
  useGetJobBoardByIdQuery,
  useAddColumnMutation,
  useUpdateColumnOrderMutation,
} from "../slices/api/jobBoardsApiSlice";
import {
  useGetJobPostsByBoardQuery,
  useUpdateJobPostStatusMutation,
} from "../slices/api/jobPostsApiSlice";
import Alert from "../components/utils/Alert";
import NProgress from "nprogress";
import JSXMsgModal from "../components/utils/JSXMsgModal";
import { toast } from "react-hot-toast";
import Loader from "../components/utils/Loader";

const JobBoard = () => {
  const { boardId } = useParams();
  const board = useSelector(
    (state) => state.jobBoards.jobBoards.boards[boardId],
  );

  const {
    data: jobBoard,
    isLoading: isLoadingBoard,
    error: boardError,
  } = useGetJobBoardByIdQuery(boardId, {
    skip: !boardId,
  });

  const {
    data: jobPosts,
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetJobPostsByBoardQuery(boardId, {
    skip: !board || isLoadingBoard,
  });

  const [addColumn] = useAddColumnMutation();
  const [updateColumnOrder] = useUpdateColumnOrderMutation();
  const [updateJobPostStatus] = useUpdateJobPostStatusMutation();

  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  if (isLoadingBoard || isLoadingPosts) {
    NProgress.start();
  } else {
    NProgress.done();
  }

  const allJobs = useSelector((state) => state.jobBoards.jobBoards.jobs);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Call API based on type
    if (type === "job") {
      const columnTitle = board.columns[destination.droppableId].title;

      updateJobPostStatus({
        jobId: draggableId,
        boardId,
        oldColumnId: source.droppableId,
        status: {
          _id: destination.droppableId,
          statusName: columnTitle,
        },
      })
        .unwrap()
        .catch((error) => {
          console.error("Failed to update job status:", error);
        });
    } else if (type === "column") {
      const newOrder = [...board.columnOrder];
      newOrder.splice(source.index, 1);
      newOrder.splice(destination.index, 0, draggableId);

      // return {_id, statusName} pairs based on new order
      const columnIdTitleArray = newOrder.map((id) => ({
        _id: id,
        statusName: board.columns[id].title,
      }));

      updateColumnOrder({ boardId, statusOrder: columnIdTitleArray })
        .unwrap()
        .catch((error) => {
          console.error("Failed to update column order:", error);
        });
    }

    dispatch(
      moveJobWithinBoard({
        source,
        destination,
        draggableId,
        type,
        boardId,
      }),
    );
  };

  return (
    <>
      <div
        className="mt-24 flex flex-grow md:mt-12"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        {boardError || postsError ? (
          <Alert
            type="error"
            message={
              boardError && postsError
                ? `${boardError?.error} ${postsError?.error}`
                : boardError
                  ? `${boardError?.error}`
                  : `${postsError?.error}`
            }
          />
        ) : isLoadingBoard || isLoadingPosts ? (
          <Loader />
        ) : (
          <div className="flex-grow pt-2">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="all-columns"
                direction="horizontal"
                type="column"
              >
                {(provided) => (
                  <div
                    className="flex divide-x divide-gray-300 dark:divide-slate-700"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {board?.columnOrder.map((columnId, index) => {
                      const column = board.columns[columnId];
                      const jobs = column.jobIds.map((jobId) => allJobs[jobId]);
                      return (
                        <StatusColumn
                          key={column.id}
                          column={column}
                          index={index}
                          boardId={boardId}
                        />
                      );
                    })}
                    <AddColumn
                      onAddColumn={() => setIsAddColumnModalOpen(true)}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
      <Outlet />
      {isAddColumnModalOpen && (
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
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
            </>
          }
          onConfirm={async () => {
            if (!newColumnTitle.trim()) {
              toast.error("Please enter a title for the column.");
              return;
            }

            //title already exists
            const isTitleExists = Object.values(board.columns).some(
              (col) => col.title === newColumnTitle,
            );

            if (isTitleExists) {
              toast.error("Column title already exists");
              return;
            }

            // return {_id, statusName} pairs
            const columnIdTitleArray = Object.entries(board.columns).map(
              ([id, { title }]) => ({ _id: id, statusName: title }),
            );

            toast.promise(
              addColumn({
                boardId,
                statusOrder: [
                  ...columnIdTitleArray,
                  { statusName: newColumnTitle },
                ],
              }).unwrap(),
              {
                loading: "Adding column...",
                success: "Column added successfully",
                error: "Error adding column",
              },
            );
            setIsAddColumnModalOpen(false);
            setNewColumnTitle("");
          }}
          onCancel={() => {
            setIsAddColumnModalOpen(false);
            setNewColumnTitle("");
          }}
        />
      )}
    </>
  );
};

export default JobBoard;
