import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { MdDelete } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import JSXMsgModal from "../utils/JSXMsgModal";
import { useNavigate } from "react-router-dom";
import { useDeleteJobPostMutation } from "../../slices/api/jobPostsApiSlice";
import toast from "react-hot-toast";

const Job = ({ job, index, columnId, boardId }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const navigate = useNavigate();

  const [deleteJobPost] = useDeleteJobPostMutation();

  return (
    <>
      <Draggable draggableId={job.id} index={index}>
        {(provided, snapshot) => {
          const styleOnDrag = snapshot.isDragging
            ? "bg-light-purple-100 dark:bg-dark-purple-100 border-indigo-800 dark:border-dark-purple-300 border shadow-md"
            : "bg-light-bgColor-200 dark:bg-dark-bgColor-200 ";
          return (
            <div
              onClick={() => {
                navigate(`/board/${boardId}/job/${job.id}/edit`);
              }}
              className={`mt-2 rounded border ${styleOnDrag} relative cursor-pointer p-2 transition duration-300 hover:bg-light-purple-100 dark:border-slate-700 dark:hover:bg-dark-purple-100`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {isHovering && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteModalOpen(true);
                    }}
                    className="absolute right-0 top-0 m-1 rounded border border-light-bgColor-100 p-1 text-sm text-light-bgColor-100 shadow hover:border-red-600 hover:text-red-600 dark:border-dark-bgColor-300 dark:text-dark-bgColor-300 dark:hover:border-red-600 dark:hover:text-red-600"
                  >
                    <MdDelete />
                  </button>
                  {job.url && (
                    <a
                      href={job.url}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-0 right-0 m-1 rounded border border-light-bgColor-100 p-1 text-sm text-light-bgColor-100 shadow hover:border-indigo-800 hover:text-indigo-800 dark:border-dark-bgColor-300 dark:text-dark-bgColor-300 dark:hover:border-indigo-800 dark:hover:text-indigo-800"
                    >
                      <FaLink />
                    </a>
                  )}
                </>
              )}
              <h3 className="overflow-hidden text-ellipsis font-semibold text-gray-800 dark:text-dark-purple-300">
                {job.title}
              </h3>
              <p className="overflow-hidden text-ellipsis text-sm text-gray-600 dark:text-gray-300">
                {job.company}
              </p>
            </div>
          );
        }}
      </Draggable>

      {isDeleteModalOpen && (
        <JSXMsgModal
          message={
            <>
              <p className="text-center text-lg">
                Are you sure you want to delete this job application?
              </p>
            </>
          }
          onConfirm={async () => {
            toast
              .promise(
                deleteJobPost({
                  boardId,
                  columnId,
                  jobId: job.id,
                }).unwrap(),
                {
                  loading: "Deleting job post...",
                  success: "Job post deleted successfully!",
                  error: "Failed to delete job post.",
                },
              )
              .catch((error) => {
                console.error("Failed to delete job post:", error);
              });
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default Job;
