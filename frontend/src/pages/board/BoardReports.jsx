import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { VChart } from "@visactor/react-vchart";
import {
  chartSpec,
  lineChartSpec,
  wordCloudSpec,
} from "../../components/utils/chartSpec.js";
import { useGetJobBoardByIdQuery } from "../../slices/api/jobBoardsApiSlice.js";
import { useGetJobPostsByBoardQuery } from "../../slices/api/jobPostsApiSlice.js";
import countWords from "count-words";
import StatsCard from "../../components/stats/StatsCard.jsx";
import DueTable from "../../components/stats/DueTable.jsx";
import Loader from "../../components/utils/Loader.jsx";
import { FaSuitcase } from "react-icons/fa6";

const BoardReports = () => {
  const { boardId } = useParams();
  const [jobCountsByStatus, setJobCountsByStatus] = useState([]);
  const [jobCountsByDate, setJobCountsByDate] = useState([]);
  const [jobCountsByTitle, setJobCountsByTitle] = useState([]);

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

  useEffect(() => {
    if (jobPosts?.result) {
      const jobCountsByStatus = categorizeJobCountsByStatus();
      setJobCountsByStatus(jobCountsByStatus);
      const jobCountsByDate = categorizeJobCountsByDate();
      setJobCountsByDate(jobCountsByDate);
      const jobCountsByTitle = categorizeJobCountsByTitle();
      setJobCountsByTitle(jobCountsByTitle);
    }
  }, [jobPosts, boardId]);

  const unArchivedJobPosts = jobPosts?.result.filter(
    (post) => !post.isArchived,
  );

  // Categorize job counts by status
  const categorizeJobCountsByStatus = () => {
    const categoryMap = unArchivedJobPosts.reduce((acc, post) => {
      const status = post.status.statusName;
      if (!acc[status]) {
        acc[status] = 0;
      }
      acc[status] += 1;
      return acc;
    }, {});

    return Object.entries(categoryMap).map(([type, value]) => ({
      type,
      value,
    }));
  };

  const categorizeJobCountsByDate = () => {
    const categoryMap = new Map();

    unArchivedJobPosts.forEach((post) => {
      const date = new Date(post.createdAt);
      const yearMonthDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const status = post.status.statusName;
      const key = `${yearMonthDay}-${status}`;

      if (!categoryMap.has(key)) {
        categoryMap.set(key, { date: yearMonthDay, status, count: 0 });
      }
      const entry = categoryMap.get(key);
      entry.count += 1;
    });

    return Array.from(categoryMap.values()).map(({ date, status, count }) => ({
      type: date,
      country: status,
      value: count,
    }));
  };

  const categorizeJobCountsByTitle = () => {
    const categoryMap = {};

    unArchivedJobPosts.forEach((post) => {
      const word_counts = countWords(post.title, true);
      Object.entries(word_counts).forEach(([key, value]) => {
        categoryMap[key] = (categoryMap[key] || 0) + value;
      });
    });

    return Object.entries(categoryMap).map(([challenge_name, sum_count]) => ({
      challenge_name,
      sum_count,
    }));
  };

  // Chart specification for job counts by status
  const jobCountsByStatusSpec = {
    ...chartSpec,
    data: [
      {
        id: "jobCountsByStatus",
        values: jobCountsByStatus,
      },
    ],
    title: {
      ...chartSpec.title,
      text: "Job Counts by Status",
    },
  };

  // Chart specification for job counts by creation date
  const jobCountsByCreationDateSpec = {
    ...lineChartSpec,
    data: [
      {
        id: "jobCountsByDate",
        values: jobCountsByDate,
      },
    ],
    title: {
      ...lineChartSpec.title,
      text: "Job Counts by Creation Date",
    },
  };

  // Chart specification for job counts by title
  const jobCountsByTitleSpec = {
    ...wordCloudSpec,
    data: [
      {
        id: "jobCountsByTitle",
        values: jobCountsByTitle,
      },
    ],
    title: {
      ...wordCloudSpec.title,
      text: "Word Cloud of Job Titles",
    },
  };

  if (jobPosts?.result.length === 0) {
    return (
      <div className="mt-24 flex items-center p-4 sm:mt-12">
        <h1 className="font-semibold text-gray-800 dark:text-gray-50">
          No job posts available, please add them{" "}
          <Link
            className="text-blue-500 underline dark:text-blue-300"
            to={`/board/${boardId}`}
          >
            here
          </Link>
        </h1>
      </div>
    );
  }

  return (
    <>
      {isLoadingBoard || isLoadingPosts ? (
        <Loader />
      ) : (
        <div className="mt-24 grid grid-cols-1 gap-4 p-4 sm:mt-12 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <StatsCard
              data={unArchivedJobPosts}
              Icon={FaSuitcase}
              title="Job Added"
            />
            <DueTable jobPosts={unArchivedJobPosts} />
          </div>
          <div className="stats-vchart">
            <VChart spec={jobCountsByStatusSpec} />
          </div>
          <div className="stats-vchart">
            <VChart spec={jobCountsByCreationDateSpec} />
          </div>
          <div className="stats-vchart">
            <VChart spec={jobCountsByTitleSpec} />
          </div>
        </div>
      )}
    </>
  );
};

export default BoardReports;
