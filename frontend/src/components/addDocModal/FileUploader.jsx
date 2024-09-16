import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useUploadFileMutation } from "../../slices/api/filesApiSlice";
import { toast } from "react-hot-toast";
import JSXMsgModal from "../utils/JSXMsgModal";
import Loader from "../utils/Loader";

const FileUploader = ({ addedFile, setAddedFile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadFile, { isLoadingUpload }] = useUploadFileMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileChange = (event) => {
    const file =
      (event.target.files && event.target.files[0]) ||
      (event.dataTransfer &&
        event.dataTransfer.files &&
        event.dataTransfer.files[0]);

    if (file) {
      if (file.size <= MAX_FILE_SIZE) {
        setSelectedFile(file);
        setIsModalOpen(true);
      } else {
        toast.error("File size exceeds 2MB");
      }
    } else {
      toast.error("No file selected or dropped");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFileChange(event);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    setIsModalOpen(false);
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    toast
      .promise(uploadFile(formData).unwrap(), {
        loading: "Uploading file...",
        success: "File uploaded successfully",
        error: (err) => err?.data?.error || "Failed to upload file",
      })
      .then((response) => {
        setAddedFile(response.result);
        setSelectedFile(null);
      })
      .catch((err) => {
        console.error("Failed to upload file:", err);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <label
          htmlFor="file-upload"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors duration-500 ease-in-out hover:border-light-purple-300 hover:bg-gray-100 dark:border-gray-600 dark:bg-dark-bgColor-300 dark:hover:border-dark-purple-300 dark:hover:bg-gray-700"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            {isLoadingUpload || isProcessing ? (
              <Loader />
            ) : (
              <>
                <FaCloudUploadAlt className="mb-2 size-8 text-gray-400 dark:text-gray-300" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-300">
                  Max file size: 2MB
                </p>
              </>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      {isModalOpen && selectedFile && (
        <JSXMsgModal
          message={
            <p>
              Are you sure you want to add{" "}
              <span className="font-semibold">{selectedFile.name}</span>?
            </p>
          }
          onConfirm={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedFile(null);
          }}
        />
      )}
    </>
  );
};

export default FileUploader;
