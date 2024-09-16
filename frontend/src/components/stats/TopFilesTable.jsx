import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRankingStar, FaMedal } from "react-icons/fa6";
import "../utils/scrollbar.css";
import moment from "moment-timezone";
import { categoryColors, getFileExtensionColor } from "../utils/fileLabel";

const TopFilesTable = ({ files }) => {
  // find top 3 used files

  const getTopUsedFiles = (files) => {
    if (!files) return [];
    const sortedFiles = [...files].sort(
      (a, b) => b.jobPostId.length - a.jobPostId.length,
    );

    const topUsedFiles = [];
    let lastCount = null;
    let rank = 0;

    for (const file of sortedFiles) {
      const currentCount = file.jobPostId.length;
      if (lastCount !== currentCount) {
        rank++;
        lastCount = currentCount;
      }
      if (rank > 3) break;
      topUsedFiles.push({
        ...file,
        rank,
      });
    }

    return topUsedFiles;
  };

  const topUsedFiles = getTopUsedFiles(files);

  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-orange-400";
      default:
        return "text-blue-400";
    }
  };

  return (
    <div className="rounded-lg bg-white ring-2 ring-white transition duration-300 ease-in-out hover:shadow-lg hover:ring-light-purple-300 dark:bg-[#16161a] dark:ring-[#16161a] dark:hover:ring-dark-bgColor-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Top Used Documents
          </h3>
        </div>
        <div className="rounded-full bg-light-purple-300 p-3 dark:bg-dark-purple-300">
          <FaRankingStar className="text-2xl text-light-bgColor-100 dark:text-dark-bgColor-300" />
        </div>
      </div>
      {files?.length > 0 ? (
        <div className="custom-scrollbar flex max-h-96 min-h-96 flex-col gap-2 overflow-y-auto p-2">
          {topUsedFiles?.map((file) => (
            <Link
              to={`/documents/${file._id}`}
              key={file._id}
              className="relative flex flex-col justify-center gap-1 rounded bg-white p-4 text-center shadow transition duration-300 hover:bg-light-purple-100 hover:shadow-md dark:bg-dark-bgColor-300 dark:hover:bg-dark-bgColor-200"
            >
              <span
                className={`${categoryColors[file.category]} absolute left-2 top-2 rounded px-2.5 py-0.5 text-xs font-medium`}
              >
                {file.category}
              </span>
              <span className="absolute right-2 top-2">
                <FaMedal className={`${getMedalColor(file.rank)} text-lg`} />
              </span>

              <p
                className="mt-4 w-full overflow-hidden text-ellipsis font-semibold dark:text-white"
                title={file.originalFileName}
              >
                {file.originalFileName}
              </p>
              <p
                className={`${getFileExtensionColor(file.storedFileName)} w-full overflow-hidden text-ellipsis text-sm uppercase`}
              >
                {file.storedFileName.split(".").pop()}
              </p>
              <p className="w-full overflow-hidden text-ellipsis text-xs text-gray-500 dark:text-gray-400">
                Uploaded: {moment(file.createdAt).format("YYYY-MM-DD HH:mm")}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex max-h-96 min-h-96 items-center justify-center p-4 text-gray-800 dark:text-gray-50">
          No documents available.
        </div>
      )}
    </div>
  );
};

export default TopFilesTable;
