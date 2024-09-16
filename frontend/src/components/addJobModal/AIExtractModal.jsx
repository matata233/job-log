import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../components/utils/scrollbar.css";
import { useExtractJDMutation } from "../../slices/api/aiApiSlice";
import toast from "react-hot-toast";
import {
  setExtractedJD,
  setJobDescription,
  setSelectedMethod,
  resetAIState,
} from "../../slices/aiSlice";

const AIExtractModal = () => {
  const dispatch = useDispatch();

  const jobDescription = useSelector((state) => state.ai.jobDescription);

  const [description, setDescription] = useState(jobDescription || "");

  const [extractJD, { isLoading, error }] = useExtractJDMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setJobDescription(description));

    toast.promise(extractJD({ jobDescription: description }).unwrap(), {
      loading: "Hang tight! Our AI is extracting job details...",
      success: (data) => {
        dispatch(setExtractedJD(data));
        dispatch(setSelectedMethod("after-process"));
        return "Job details extracted successfully!";
      },
      error: (err) => {
        return (
          err?.data?.error || "Failed to extract job details. Please try again!"
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 dark:bg-white dark:bg-opacity-50">
      <div className="custom-scrollbar relative max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-dark-bgColor-200">
        <h2 className="mb-4 border-b pb-2 text-center text-lg font-bold text-light-purple-300 dark:border-b-slate-700 dark:text-dark-purple-300">
          Job Description AI Extractor
        </h2>
        <form onSubmit={handleSubmit} className="text-sm">
          <div className="mb-4">
            <label htmlFor="description" className="input-label">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Enter job description"
              value={description}
              className="input-field h-96 max-h-96 min-h-60 resize-y"
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-evenly">
            <button
              type="button"
              className={`normal-btn ${isLoading ? "cursor-not-allowed" : ""}`}
              onClick={() => {
                dispatch(setSelectedMethod(null));
                dispatch(resetAIState());
              }}
              disabled={isLoading}
            >
              Back
            </button>
            {isLoading ? (
              <button className="confirm-btn cursor-not-allowed" disabled>
                Extracting...
              </button>
            ) : (
              <button type="submit" className="confirm-btn">
                Extract
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIExtractModal;
