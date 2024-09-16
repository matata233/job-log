import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { LuFileType2 } from "react-icons/lu";
import { BsFiletypeAi } from "react-icons/bs";
import { TfiUnlink } from "react-icons/tfi";
import "../../components/utils/scrollbar.css";
import AddJobModal from "../../components/addJobModal/AddJobModal";
import AIExtractModal from "../../components/addJobModal/AIExtractModal";
import AIScrapeModal from "../../components/addJobModal/AIScrapeModal";
import { setSelectedMethod, resetAIState } from "../../slices/aiSlice";

const AddJobMethodSelectModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { boardId, columnId } = useParams();

  const selectedMethod = useSelector((state) => state.ai.selectedMethod);

  useEffect(() => {
    return () => {
      dispatch(resetAIState());
    };
  }, []);

  return (
    <>
      {selectedMethod === null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 dark:bg-white dark:bg-opacity-50">
          <div className="custom-scrollbar relative max-h-full w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-dark-bgColor-200">
            <h2 className="mb-4 border-b pb-2 text-center text-lg font-bold text-light-purple-300 dark:border-b-slate-700 dark:text-dark-purple-300">
              Add New Job
            </h2>

            <div className="flex flex-col items-center justify-center gap-2 border-b py-2 dark:border-b-slate-700">
              {/* Manual Job Info Input */}
              <div
                onClick={() => dispatch(setSelectedMethod("manual"))}
                className="flex w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-gray-800 shadow-sm transition duration-300 hover:bg-light-purple-100 dark:text-gray-300 dark:hover:bg-dark-bgColor-300"
              >
                <div className="flex items-center gap-4">
                  <LuFileType2 className="flex-shrink-0 text-2xl text-light-purple-300 dark:text-dark-purple-300" />
                  <div className="flex flex-col">
                    <div className="text-lg font-medium text-light-purple-300 dark:text-dark-purple-300">
                      Manual Job Entry
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Manually input job details like title, company,
                      description, and requirements.
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Extracted Job Info */}
              <div
                onClick={() => dispatch(setSelectedMethod("ai-extract"))}
                className="flex w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-gray-800 shadow-sm transition duration-300 hover:bg-light-purple-100 dark:text-gray-300 dark:hover:bg-dark-bgColor-300"
              >
                <div className="flex items-center gap-4">
                  <BsFiletypeAi className="flex-shrink-0 text-2xl text-light-purple-300 dark:text-dark-purple-300" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium text-light-purple-300 dark:text-dark-purple-300">
                        AI-Assisted Extraction{" "}
                      </div>
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        Beta
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Use AI to automatically categorize job information from a
                      single description.
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Scrapped Job Info */}
              <div
                onClick={() => dispatch(setSelectedMethod("ai-scrape"))}
                className="flex w-full cursor-pointer rounded-lg px-4 py-3 font-medium text-gray-800 shadow-sm transition duration-300 hover:bg-light-purple-100 dark:text-gray-300 dark:hover:bg-dark-bgColor-300"
              >
                <div className="flex items-center gap-4">
                  <TfiUnlink className="flex-shrink-0 text-2xl text-light-purple-300 dark:text-dark-purple-300" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium text-light-purple-300 dark:text-dark-purple-300">
                        AI-Scrapped Job Info
                      </div>
                      <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        Beta
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">
                      Use AI to scrape job information from a job posting URL.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-evenly">
              <button
                type="button"
                className="normal-btn"
                onClick={() => navigate(`/board/${boardId}`)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(selectedMethod === "manual" || selectedMethod === "after-process") && (
        <AddJobModal />
      )}
      {selectedMethod === "ai-extract" && <AIExtractModal />}

      {(selectedMethod === "ai-scrape" ||
        selectedMethod === "ai-scrape-extract") && <AIScrapeModal />}
    </>
  );
};

export default AddJobMethodSelectModal;
