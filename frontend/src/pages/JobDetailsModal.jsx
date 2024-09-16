import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import JobDetailsNavbar from "../components/jobDetails/jobDetailsNavbar";
import "../components/utils/scrollbar.css";
import { useGetJobBoardByIdQuery } from "../slices/api/jobBoardsApiSlice";
import { useGetJobPostsByBoardQuery } from "../slices/api/jobPostsApiSlice";
import Loader from "../components/utils/Loader";

const JobDetailsModal = () => {
  const navigate = useNavigate();
  const { boardId, jobId } = useParams();
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

  const job = useSelector((state) => state.jobBoards.jobBoards.jobs[jobId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 dark:bg-white dark:bg-opacity-50">
      <div className="custom-scrollbar relative h-full w-full max-w-4xl overflow-y-auto rounded bg-white p-2 dark:bg-dark-bgColor-200">
        {isLoadingBoard || isLoadingPosts ? (
          <Loader />
        ) : (
          <div>
            <div className="flex flex-col">
              {/* Title + close button*/}
              <div className="border-b pb-2 dark:border-b-slate-700">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-light-purple-300 dark:text-dark-purple-300">
                      {job.title}
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300">
                      {job.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="normal-btn" onClick={() => navigate(-1)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
              {/* Navbar */}
              <div className="border-b p-2 dark:border-b-slate-700">
                <JobDetailsNavbar />
              </div>

              {/* Content */}
              <Outlet />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
