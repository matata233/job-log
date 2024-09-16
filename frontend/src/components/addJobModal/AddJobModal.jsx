import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import BoardSelect from "./BoardSelect";
import ColumnSelect from "./ColumnSelect";
import "../../components/utils/scrollbar.css";
import { MdDelete } from "react-icons/md";
import { useAddJobPostMutation } from "../../slices/api/jobPostsApiSlice";
import toast from "react-hot-toast";
import {
  resetAIState,
  setExtractedJD,
  setSelectedMethod,
  setJobDescription,
} from "../../slices/aiSlice";

const AddJobModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedMethod = useSelector((state) => state.ai.selectedMethod);

  const { boardId, columnId } = useParams();

  const extractedJD = useSelector((state) => state.ai.extractedJD);
  const jobUrl = useSelector((state) => state.ai.jobUrl);

  const [title, setTitle] = useState(
    selectedMethod === "manual" ? "" : extractedJD.title,
  );
  const [company, setCompany] = useState(
    selectedMethod === "manual" ? "" : extractedJD.company,
  );
  const [location, setLocation] = useState(
    selectedMethod === "manual" ? "" : extractedJD.location,
  );
  const [url, setUrl] = useState(jobUrl || "");

  const [description, setDescription] = useState(
    selectedMethod === "manual" ? "" : extractedJD.description,
  );
  const [requirements, setRequirements] = useState(
    selectedMethod === "manual" ? [""] : extractedJD.requirements,
  );
  const [salary, setSalary] = useState(
    selectedMethod === "manual" ? "" : extractedJD.salary,
  );
  const [deadline, setDeadline] = useState(
    selectedMethod === "manual" ? "" : extractedJD.deadline,
  );

  const [board, setBoard] = useState(boardId);
  const [column, setColumn] = useState(columnId);

  const boardList = useSelector((state) => state.jobBoards.boardList);

  const [addJobPost] = useAddJobPostMutation();

  const handleBoardChange = (value) => {
    setBoard(value);
    const currentBoard = boardList.find((board) => board.id === value);

    // set the column to the first column in the board
    if (currentBoard && currentBoard.statusOrder.length > 0) {
      setColumn(currentBoard.statusOrder[0].id);
    } else {
      setColumn("");
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (job) => {
    toast
      .promise(addJobPost({ ...job }).unwrap(), {
        loading: "Adding job...",
        success: "Job added successfully",
        error: (error) => error?.data?.error || "Failed to add job",
      })
      .then(() => {
        navigate(`/board/${boardId}`);
        dispatch(resetAIState());
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 dark:bg-white dark:bg-opacity-50">
      <div className="custom-scrollbar relative max-h-full w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-dark-bgColor-200">
        <h2 className="mb-4 border-b pb-2 text-center text-lg font-bold text-light-purple-300 dark:border-b-slate-700 dark:text-dark-purple-300">
          {selectedMethod === "manual"
            ? "Add New Job"
            : "Review AI Extracted Job Details"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const status = boardList
              .find((b) => b.id === board)
              ?.statusOrder.find((c) => c.id === column);

            handleSubmit({
              title,
              company,
              url,
              description,
              requirements,
              salary,
              location,
              deadline: deadline ? new Date(deadline).toISOString() : "",
              jobBoardId: board,
              status: { _id: status.id, statusName: status.statusName },
            });
          }}
          className="text-sm"
        >
          <div className="mb-4">
            <label htmlFor="jobTitle" className="input-label">
              Job Title *
            </label>
            <input
              id="jobTitle"
              type="text"
              placeholder="Job Title"
              value={title}
              className="input-field"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="company" className="input-label">
              Company *
            </label>
            <input
              id="company"
              type="text"
              placeholder="Company"
              value={company}
              className="input-field"
              required
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="company location" className="input-label">
              Company Location
            </label>
            <input
              id="company location"
              type="text"
              placeholder="Company Location"
              value={location}
              className="input-field"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobUrl" className="input-label">
              Job URL
            </label>
            <input
              id="jobUrl"
              type="text"
              placeholder="Job URL"
              value={url}
              className="input-field"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="input-label">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Enter job description"
              value={description}
              className="input-field h-32 max-h-44 min-h-20 resize-y"
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="requirements" className="input-label">
              Requirements *
            </label>
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  placeholder="Enter requirement"
                  value={requirement}
                  className="input-field my-2"
                  required
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                />
                {index > 0 && (
                  <button
                    type="button"
                    className="ml-2 transition-colors duration-300 hover:text-red-500"
                    onClick={() => removeRequirement(index)}
                  >
                    <MdDelete />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 box-border w-full cursor-pointer rounded-lg px-2 py-1 shadow-md transition-colors duration-300 hover:bg-light-purple-100 dark:border dark:border-slate-700 dark:hover:bg-dark-bgColor-300"
              onClick={addRequirement}
            >
              +
            </button>
          </div>

          <div className="flex justify-between">
            <div className="mb-4">
              <label htmlFor="salary" className="input-label">
                Salary
              </label>
              <input
                id="salary"
                type="text"
                placeholder="Job Salary"
                value={salary}
                className="input-field"
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="deadline" className="input-label">
                Deadline
              </label>
              <input
                type="datetime-local"
                id="deadline"
                value={deadline}
                className="input-field"
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <div className="mb-4 w-1/2">
              <label className="input-label">Board *</label>
              <div>
                <BoardSelect
                  handleBoardChange={handleBoardChange}
                  boardId={board}
                />
              </div>
            </div>

            <div className="mb-4 w-1/2">
              <label className="input-label">Column *</label>
              <div>
                <ColumnSelect
                  key={board}
                  setColumnId={setColumn}
                  boardId={board}
                  columnId={column}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-evenly">
            {/* scrape -> extract -> add job modal */}
            {jobUrl ? (
              <>
                <button
                  type="button"
                  className="normal-btn"
                  onClick={() => {
                    dispatch(setSelectedMethod("ai-scrape"));
                    dispatch(setJobDescription(""));
                    dispatch(setExtractedJD({}));
                  }}
                >
                  To Scrape
                </button>
                <button
                  type="button"
                  className="normal-btn"
                  onClick={() => {
                    dispatch(setSelectedMethod("ai-extract"));
                    dispatch(setExtractedJD({}));
                  }}
                >
                  To Extract
                </button>
              </>
            ) : Object.keys(extractedJD).length > 0 ? ( // extract -> add job modal
              <button
                type="button"
                className="normal-btn"
                onClick={() => {
                  dispatch(setSelectedMethod("ai-extract"));
                  dispatch(setExtractedJD({}));
                }}
              >
                To Extract
              </button>
            ) : (
              // add job modal
              <button
                type="button"
                className="normal-btn"
                onClick={() => {
                  dispatch(setSelectedMethod(null));
                  dispatch(resetAIState());
                }}
              >
                Back
              </button>
            )}

            <button type="submit" className="confirm-btn">
              {selectedMethod === "manual" ? "Add Job" : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobModal;
