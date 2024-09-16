import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetFilesByJobPostQuery,
  useUpdateFileMutation,
  useGetAllFilesQuery,
} from "../../slices/api/filesApiSlice";
import Loader from "../../components/utils/Loader";
import FileCard from "../../components/addDocModal/FileCard";
import LinkDoc from "../../components/addDocModal/LinkDoc";
import toast from "react-hot-toast";

const JobDocuments = () => {
  const { jobId } = useParams();
  const {
    data: documents,
    isLoading,
    refetch,
  } = useGetFilesByJobPostQuery(jobId);

  const { data: allFiles } = useGetAllFilesQuery();

  const [updateFile] = useUpdateFileMutation();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const categories = ["Resume", "Cover Letter", "Transcript", "Default"];

  const [linkFile, setLinkFile] = useState("");

  useEffect(() => {
    if (documents) {
      if (selectedCategory === "") {
        setFilteredDocuments(documents.result);
      } else {
        const filtered = documents.result.filter(
          (doc) => doc.category === selectedCategory,
        );
        setFilteredDocuments(filtered);
      }
    } else {
      setFilteredDocuments([]);
    }
  }, [documents, selectedCategory]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
  };

  const handleLinkDoc = async () => {
    // find file that matches linkFile
    if (!linkFile) {
      toast.error("Please select a file to link");
      return;
    }

    const file = allFiles.result.find((doc) => doc._id === linkFile);
    if (!file) {
      toast.error("File not found");
      return;
    }
    const originalJobPostId = file.jobPostId;
    const updatedJobPostId = [...originalJobPostId, jobId];
    const updatedFile = { ...file, jobPostId: updatedJobPostId };

    toast.promise(updateFile({ id: linkFile, fileData: updatedFile }), {
      loading: "Linking file...",
      success: () => {
        setLinkFile("");
        refetch();
        return "File linked successfully";
      },
      error: (error) => error?.data?.error || "Failed to link file",
    });
  };

  return (
    <div className="mt-2 px-2">
      <div className="flex w-full items-center gap-2 md:w-1/2 md:flex-grow">
        <LinkDoc
          files={allFiles?.result ?? []}
          excludedFiles={documents?.result ?? []}
          linkFile={linkFile}
          setLinkFile={setLinkFile}
        />
        <button
          className="h-8 w-32 min-w-[100px] whitespace-nowrap rounded bg-light-purple-100 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-purple-950 dark:text-dark-purple-100 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
          onClick={handleLinkDoc}
        >
          Link Doc
        </button>
      </div>
      <div className="flex w-full items-center justify-between gap-6 py-2">
        {/* Select for category */}
        <div className="flex items-center">
          <select
            className="w-32 rounded-md border p-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-light-purple-200 dark:border-gray-700 dark:bg-dark-bgColor-300 dark:focus:ring-dark-purple-200"
            name="category"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span className="ml-2 rounded bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            Total: {filteredDocuments.length}
          </span>
        </div>

        {/* Add Document button */}
        <Link
          className="flex w-32 justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:text-dark-purple-300 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
          to={`/add-doc/${jobId}`}
        >
          + New Doc
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <FileCard doc={doc} key={doc._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobDocuments;
