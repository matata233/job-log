import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFileByIdQuery,
  useUpdateFileMutation,
} from "../slices/api/filesApiSlice";
import Loader from "../components/utils/Loader";
import toast from "react-hot-toast";
import { categoryColors } from "../components/utils/fileLabel";

const DocumentDetailsModal = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();
  const { data: document, isLoading } = useGetFileByIdQuery(documentId);
  const [updateFile] = useUpdateFileMutation();

  const [displayName, setDisplayName] = useState("");
  const [displayCategory, setDisplayCategory] = useState("");

  const [inputName, setInputName] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  useEffect(() => {
    if (document) {
      setDisplayName(document.result.originalFileName);
      setDisplayCategory(document.result.category);
      setInputName(document.result.originalFileName);
      setInputCategory(document.result.category);
    }
  }, [document]);

  const handleUpdateName = async () => {
    if (inputName === displayName) return;
    const fileData = { originalFileName: inputName };
    toast
      .promise(updateFile({ id: documentId, fileData }).unwrap(), {
        loading: "Updating file name...",
        success: "File name updated successfully",
        error: "Failed to update file name",
      })
      .then((res) => {
        setDisplayName(inputName);
      })
      .catch((error) => {
        console.error("Error updating file name: ", error); // reset input to display value on error
        setInputName(displayName);
      });
  };

  const handleUpdateCategory = async () => {
    if (inputCategory === displayCategory) return;
    const fileData = { category: inputCategory };
    toast
      .promise(updateFile({ id: documentId, fileData }).unwrap(), {
        loading: "Updating category...",
        success: "Category updated successfully",
        error: "Failed to update category",
      })
      .then((res) => {
        setDisplayCategory(inputCategory);
      })
      .catch((error) => {
        console.error("Error updating category: ", error);
        setInputCategory(displayCategory); // reset input to display value on error
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 dark:bg-white dark:bg-opacity-50">
      <div className="custom-scrollbar relative h-full w-full max-w-7xl overflow-y-auto rounded bg-white p-2 dark:bg-dark-bgColor-200">
        <div className="flex flex-col">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="border-b pb-2 dark:border-b-slate-700">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-light-purple-300 dark:text-dark-purple-300">
                    {displayName}
                  </h2>
                  <div
                    className={`${categoryColors[displayCategory]} max-w-fit rounded px-2.5 py-0.5 text-xs font-medium`}
                  >
                    {displayCategory}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="normal-btn" onClick={() => navigate(-1)}>
                    Close
                  </button>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-2/3">
                  <a
                    href={document?.result.fileUrl}
                    target="_blank"
                    download={document?.result.originalFileName}
                    className="text-light-purple-300 hover:underline dark:text-dark-purple-300"
                  >
                    Download
                  </a>
                  <iframe
                    title="document"
                    src={`https://docs.google.com/gview?url=${document?.result.fileUrl}&embedded=true`}
                    width="100%"
                    height="580"
                  ></iframe>
                </div>

                <div className="w-1/2 md:w-1/3">
                  <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="name" className="input-label">
                        File Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="input-field"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        onBlur={handleUpdateName}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="category" className="input-label">
                        Category *
                      </label>
                      <select
                        id="category"
                        className="input-field"
                        value={inputCategory}
                        onChange={(e) => setInputCategory(e.target.value)}
                        onBlur={handleUpdateCategory}
                      >
                        <option value="Default">Default</option>
                        <option value="Resume">Resume</option>
                        <option value="Cover Letter">Cover Letter</option>
                        <option value="Transcript">Transcript</option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsModal;
