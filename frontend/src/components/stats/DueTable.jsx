import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import "../utils/scrollbar.css";

const DueTable = ({ jobPosts }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // cleanup interval on component unmount
  }, []);

  const formatTimeLeft = (deadline) => {
    const timeLeft = deadline - currentTime;
    if (timeLeft <= 0) {
      return "Time's up!";
    }
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const jobsDueSoon = jobPosts
    ?.filter((job) => job.deadline)
    // filter out jobs without a deadline
    .filter((job) => {
      // filter jobs that are due within the next 24 hours
      const deadline = new Date(job.deadline);
      return (
        deadline > currentTime && deadline - currentTime <= 24 * 60 * 60 * 1000
      );
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // sort by deadline

  return (
    <div className="rounded-lg bg-white ring-2 ring-white transition duration-300 ease-in-out hover:shadow-lg hover:ring-light-purple-300 dark:bg-[#16161a] dark:ring-[#16161a] dark:hover:ring-dark-purple-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Jobs Due Soon
          </h3>
          <span className="ml-2 rounded bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Total: {jobsDueSoon?.length}
          </span>
        </div>
        <div className="rounded-full bg-light-purple-300 p-3 dark:bg-dark-purple-300">
          <FaClock className="text-2xl text-light-bgColor-100 dark:text-dark-bgColor-300" />
        </div>
      </div>
      {jobsDueSoon?.length > 0 ? (
        <div className="custom-scrollbar flex max-h-96 min-h-96 flex-col gap-2 overflow-y-auto p-4">
          {jobsDueSoon?.map((job) => (
            <Link
              to={`/board/${job.jobBoardId}/job/${job._id}/edit`}
              key={job._id}
              className="flex cursor-pointer flex-col rounded-lg bg-light-bgColor-100 p-2 transition duration-300 hover:bg-light-purple-100 dark:border-slate-700 dark:bg-dark-bgColor-300 dark:hover:bg-dark-purple-100"
            >
              <h3 className="overflow-hidden text-ellipsis font-semibold text-gray-800 dark:text-dark-purple-300">
                {job.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="overflow-hidden text-ellipsis text-sm text-gray-600 dark:text-gray-300">
                  {job.company}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Due in {formatTimeLeft(new Date(job.deadline))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex max-h-96 min-h-96 items-center justify-center p-4 text-gray-800 dark:text-gray-50">
          Nothing is due in the next 24 hours.
        </div>
      )}
    </div>
  );
};

export default DueTable;
