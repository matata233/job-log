import React, { useState, useEffect } from "react";
import { useGetAllJobPostsQuery } from "../slices/api/jobPostsApiSlice";
import { useGetAllFilesQuery } from "../slices/api/filesApiSlice";
import { useGetJobBoardsQuery } from "../slices/api/jobBoardsApiSlice";
import StatsCard from "../components/stats/StatsCard";
import DueTable from "../components/stats/DueTable";
import TopFilesTable from "../components/stats/TopFilesTable";
import { MdOutlineFileCopy } from "react-icons/md";
import { FaSuitcase, FaClipboardList } from "react-icons/fa6";
import {
  barChartSpec,
  wordCloudSpec,
  chartSpec,
} from "../components/utils/chartSpec";
import { VChart } from "@visactor/react-vchart";
import countWords from "count-words";

const DashboardPage = () => {
  const [jobPostCountsByBoard, setJobPostCountsByBoard] = useState([]);
  const [jobCountsByTitle, setJobCountsByTitle] = useState([]);
  const [documentCounts, setDocumentCounts] = useState([]);

  const {
    data: jobPosts,
    isLoading: jobPostsLoading,
    error: jobPostsError,
  } = useGetAllJobPostsQuery();
  const {
    data: files,
    isLoading: filesLoading,
    error: filesError,
  } = useGetAllFilesQuery();

  const {
    data: jobBoards,
    isLoading: jobBoardsLoading,
    error: jobBoardsError,
  } = useGetJobBoardsQuery();

  const unArchivedJobPosts = jobPosts?.result.filter(
    (post) => !post.isArchived,
  );

  useEffect(() => {
    if (jobPosts?.result && jobBoards?.result) {
      const jobPostCountsByBoard = jobBoards?.result.map((board) => {
        const count = jobPosts?.result.filter(
          (post) => post.jobBoardId === board._id && post.isArchived === false,
        ).length;
        return {
          title: board.title,
          count,
        };
      });
      setJobPostCountsByBoard(jobPostCountsByBoard);

      const JobCountsByTitle = categorizeJobCountsByTitle();
      setJobCountsByTitle(JobCountsByTitle);
    }
  }, [jobPosts, jobBoards]);

  useEffect(() => {
    if (files?.result) {
      const documentCounts = categorizeDocuments(files);
      setDocumentCounts(documentCounts);
    }
  }, [files]);

  const jobPostCountsByBoardSpec = {
    ...barChartSpec,
    data: [
      {
        id: "jobPostCountsByBoard",
        values: jobPostCountsByBoard,
      },
    ],
    title: {
      ...barChartSpec.title,
      text: "Job Counts by Job Board",
    },
  };

  const categorizeJobCountsByTitle = () => {
    const categoryMap = {};
    unArchivedJobPosts?.forEach((post) => {
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

  const categorizeDocuments = (files) => {
    const categoryMap = files?.result.reduce((acc, file) => {
      const category = file.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += 1;
      return acc;
    }, {});

    return Object.entries(categoryMap).map(([type, value]) => ({
      type,
      value,
    }));
  };

  // Chart specification for document counts by category
  const documentCountsSpec = {
    ...chartSpec,
    data: [
      {
        id: "documentCounts",
        values: documentCounts,
      },
    ],
    title: {
      ...chartSpec.title,
      text: "Document Counts by Category",
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          data={unArchivedJobPosts}
          Icon={FaSuitcase}
          title="Job Added"
        />
        <StatsCard
          data={jobBoards?.result}
          Icon={FaClipboardList}
          title="Job Board Added"
        />
        <StatsCard
          data={files?.result}
          Icon={MdOutlineFileCopy}
          title="File Added"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        <DueTable jobPosts={jobPosts?.result} />
        <div className="stats-vchart">
          <VChart spec={jobPostCountsByBoardSpec} />
        </div>
        <div className="stats-vchart">
          <VChart spec={jobCountsByTitleSpec} />
        </div>
        <TopFilesTable files={files?.result} />
        <div className="stats-vchart lg:col-span-2">
          <VChart spec={documentCountsSpec} />
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
