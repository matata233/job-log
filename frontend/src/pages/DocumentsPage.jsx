import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetAllFilesQuery } from "../slices/api/filesApiSlice";
import Loader from "../components/utils/Loader";
import FileCard from "../components/addDocModal/FileCard";

const DocumentsPage = () => {
  const { data: documents, isLoading } = useGetAllFilesQuery();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const categories = ["Resume", "Cover Letter", "Transcript", "Default"];

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

  return (
    <div className="px-4">
      <h1 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-50">
        Documents
      </h1>
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
          to={"/add-doc"}
        >
          + New Doc
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <FileCard doc={doc} key={doc._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
