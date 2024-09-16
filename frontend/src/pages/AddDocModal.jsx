import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FileUploader from "../components/addDocModal/FileUploader";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "../components/utils/scrollbar.css";
import {
  useDeleteFileMutation,
  useUpdateFileMutation,
} from "../slices/api/filesApiSlice";
import toast from "react-hot-toast";

const AddDocModal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Default");

  const [addedFile, setAddedFile] = useState(null);

  const [deleteFile, { isLoadingDeleteFile }] = useDeleteFileMutation();
  const [updateFile] = useUpdateFileMutation();

  // delete the file from s3 and database
  const handleDeleteFile = () => {
    setAddedFile(null);
    try {
      deleteFile(addedFile._id);
    } catch (error) {
      toast.error("Error removing file");
      console.error("Error removing file: ", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!addedFile) {
      toast.error("Please select a file");
      return;
    }
    if (!name) {
      toast.error("Please enter a name");
      return;
    }

    const fileData = {
      originalFileName: name,
      category,
    };

    if (jobId) {
      fileData.jobPostId = [jobId];
    }

    toast
      .promise(
        updateFile({
          id: addedFile._id,
          fileData,
        }).unwrap(),
        {
          loading: "Uploading file...",
          success: "File uploaded successfully",
          error: (err) => err?.data?.error || "Failed to upload file",
        },
      )
      .then(() => {
        navigate(-1);
      })
      .catch((err) => {
        console.error("Failed to upload file:", err);
      });
  };

  useEffect(() => {
    if (addedFile) {
      setName(addedFile.originalFileName);
    }
  }, [addedFile]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 dark:bg-white dark:bg-opacity-50">
      <div className="custom-scrollbar relative max-h-full w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-dark-bgColor-200">
        <div>
          <div className="flex flex-col">
            {/* Title + close button*/}
            <div className="border-b pb-2 dark:border-b-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-light-purple-300 dark:text-dark-purple-300">
                  Add Document
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="normal-btn"
                    onClick={() => {
                      if (addedFile) {
                        handleDeleteFile();
                      }
                      navigate(-1);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <FileUploader addedFile={addedFile} setAddedFile={setAddedFile} />
            </div>

            {/* Form */}

            <div className="mt-4">
              <form onSubmit={handleUpload}>
                <label htmlFor="file" className="input-label mt-2">
                  Document *
                </label>
                {addedFile ? (
                  <div className="mt-2 flex items-center text-sm text-light-purple-300 dark:text-dark-purple-300">
                    <a
                      href={addedFile.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {addedFile.originalFileName}
                      <FaExternalLinkAlt className="ml-1 inline-block" />
                    </a>

                    <button
                      className="ml-2 transition-colors duration-300 hover:text-red-500"
                      onClick={handleDeleteFile}
                    >
                      <MdDelete />
                    </button>
                  </div>
                ) : isLoadingDeleteFile ? (
                  <div className="text-center text-light-purple-300 dark:text-dark-purple-300">
                    Deleting...
                  </div>
                ) : (
                  <div className="input-field text-sm leading-6 text-gray-400">
                    No file selected
                  </div>
                )}
                <input
                  type="text"
                  id="addedFile"
                  className="hidden"
                  readOnly
                  value={addedFile ? addedFile._id : ""}
                />

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="input-label">
                      File Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="input-field"
                      value={name}
                      onChange={(e) => setName(e.target.value)} // Add this line
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="category" className="input-label">
                      Category *
                    </label>
                    <select
                      id="category"
                      className="input-field"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Default">Default</option>
                      <option value="Resume">Resume</option>
                      <option value="Cover Letter">Cover Letter</option>
                      <option value="Transcript">Transcript</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex justify-evenly">
                  <button type="submit" className="confirm-btn">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDocModal;
