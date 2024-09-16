import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../../components/utils/scrollbar.css";
import { useExtractJDMutation } from "../../slices/api/aiApiSlice";
import toast from "react-hot-toast";
import {
  setExtractedJD,
  setJobDescription,
  setSelectedMethod,
} from "../../slices/aiSlice";

const AIScrapeExtractModal = ({ isExtracting }) => {
  const dispatch = useDispatch();
  console.log("isExtracting", isExtracting);

  const jobDescription = useSelector((state) => state.ai.jobDescription);
  const jobUrl = useSelector((state) => state.ai.jobUrl);

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
    <>
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
            className={`normal-btn ${isLoading || isExtracting ? "cursor-not-allowed" : ""}`}
            onClick={() => {
              dispatch(setSelectedMethod("ai-scrape"));
              dispatch(setExtractedJD({}));
            }}
            disabled={isLoading || isExtracting}
          >
            Back
          </button>
          {isLoading || isExtracting ? (
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
    </>
  );
};

export default AIScrapeExtractModal;
