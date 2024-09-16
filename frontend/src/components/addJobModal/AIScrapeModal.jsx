import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "../../components/utils/scrollbar.css";
import {
  useScrapeJDMutation,
  useExtractJDMutation,
} from "../../slices/api/aiApiSlice";
import toast from "react-hot-toast";
import {
  setJobUrl,
  setExtractedJD,
  setJobDescription,
  resetAIState,
  setSelectedMethod,
} from "../../slices/aiSlice";
import Loader from "../../components/utils/Loader";
import AIScrapeExtractModal from "./AIScrapeExtractModal";

const AIScrapeModal = () => {
  const dispatch = useDispatch();
  const jobUrl = useSelector((state) => state.ai.jobUrl);

  const [url, setUrl] = useState(jobUrl || "");
  const jobDescription = useSelector((state) => state.ai.jobDescription);
  const selectedMethod = useSelector((state) => state.ai.selectedMethod);

  const [scarpeJD, { isLoading: isLoadingScrapeJD, error: errorScrapeJD }] =
    useScrapeJDMutation();
  const [extractJD, { isLoading: isLoadingExtractJD, error: errorExtractJD }] =
    useExtractJDMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setJobUrl(url));

    toast.promise(scarpeJD({ jobUrl: url }).unwrap(), {
      loading: "Hang tight! Our AI is scraping the job description...",
      success: (data) => {
        dispatch(setJobDescription(data.scrappedText));
        dispatch(setSelectedMethod("ai-scrape-extract"));
        toast.promise(
          extractJD({ jobDescription: data.scrappedText }).unwrap(),
          {
            loading: "Hang tight! Our AI is extracting job details...",
            success: (data) => {
              dispatch(setExtractedJD(data));
              dispatch(setSelectedMethod("after-process"));
              return "Job details extracted successfully!";
            },
            error: (err) => {
              return (
                err?.data?.error ||
                "Failed to extract job details. Please try again!"
              );
            },
          },
        );

        return "Job description scrapped successfully!";
      },
      error: (err) => {
        return (
          err?.data?.error ||
          "Failed to scrape job description. Please try again!"
        );
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 dark:bg-white dark:bg-opacity-50">
        <div className="custom-scrollbar relative max-h-full min-h-fit w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-dark-bgColor-200">
          {selectedMethod === "ai-scrape" && (
            <>
              <h2 className="mb-4 border-b pb-2 text-center text-lg font-bold text-light-purple-300 dark:border-b-slate-700 dark:text-dark-purple-300">
                Job Description AI Scrapper
              </h2>
              <form onSubmit={handleSubmit} className="text-sm">
                <div className="mb-4">
                  <label htmlFor="jobUrl" className="input-label">
                    Job URL *
                  </label>
                  <input
                    id="jobUrl"
                    type="text"
                    placeholder="Job URL"
                    value={url}
                    className="input-field"
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="mb-4">
                    <label htmlFor="description" className="input-label">
                      Description (Scrapped)
                    </label>

                    {isLoadingScrapeJD ? (
                      <div className="flex h-96 max-h-96 min-h-60 items-center justify-center">
                        <Loader />
                      </div>
                    ) : (
                      <textarea
                        id="description"
                        placeholder="Scrape first to see job description"
                        value={jobDescription}
                        className="input-field h-96 max-h-96 min-h-60 cursor-not-allowed resize-y"
                        required
                        readOnly
                      />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-evenly">
                  <button
                    type="button"
                    className={`normal-btn ${isLoadingScrapeJD || isLoadingExtractJD ? "cursor-not-allowed" : ""}`}
                    onClick={() => {
                      dispatch(setSelectedMethod(null));
                      dispatch(resetAIState());
                    }}
                    disabled={isLoadingScrapeJD || isLoadingExtractJD}
                  >
                    Back
                  </button>

                  {isLoadingScrapeJD ? (
                    <button
                      className={`confirm-btn ${isLoadingScrapeJD ? "cursor-not-allowed" : ""}`}
                      disabled
                    >
                      Scraping...
                    </button>
                  ) : isLoadingExtractJD ? (
                    <button
                      className={`confirm-btn ${isLoadingExtractJD ? "cursor-not-allowed" : ""}`}
                      disabled
                    >
                      Extracting...
                    </button>
                  ) : (
                    <button type="submit" className="confirm-btn">
                      Scrape
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
          {selectedMethod === "ai-scrape-extract" && (
            <AIScrapeExtractModal isExtracting={isLoadingExtractJD} />
          )}
        </div>
      </div>
    </>
  );
};

export default AIScrapeModal;
