import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ColumnSelect from "../../components/addJobModal/ColumnSelect";
import { MdDelete } from "react-icons/md";
import { useEditJobPostMutation } from "../../slices/api/jobPostsApiSlice";
import toast from "react-hot-toast";
import isEqual from "lodash/isEqual";

const JobEdit = () => {
  const dispatch = useDispatch();
  const { boardId, jobId } = useParams();
  const boards = useSelector((state) => state.jobBoards.jobBoards.boards);
  const board = boards[boardId];
  const job = useSelector((state) => state.jobBoards.jobBoards.jobs[jobId]);
  const findColumnIdForJob = (board, jobId) => {
    for (const columnId in board.columns) {
      if (board.columns[columnId].jobIds.includes(jobId)) {
        return columnId;
      }
    }
    return null;
  };

  const columnId = findColumnIdForJob(board, jobId);

  const [title, setTitle] = useState(job.title || "");
  const [company, setCompany] = useState(job.company || "");
  const [url, setUrl] = useState(job.url || "");
  const [description, setDescription] = useState(job.description || "");
  const [requirements, setRequirements] = useState(job.requirements || [""]);
  const [location, setLocation] = useState(job.location || "");
  const [salary, setSalary] = useState(job.salary || "");
  const [deadline, setDeadline] = useState(job.deadline || "");

  const [localColumnId, setLocalColumnId] = useState(columnId);

  const [editJobPost] = useEditJobPostMutation();

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, "New Requirements"]);
    handleSave({ requirements: [...requirements, "New Requirements"] });
  };

  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
      handleSave({ requirements: requirements.filter((_, i) => i !== index) });
    }
  };

  const handleSave = (update) => {
    // if required fields in updates are empty, return

    if (update.title?.trim() === "") {
      setTitle(job.title);
      return;
    }
    if (update.company?.trim() === "") {
      setCompany(job.company);
      return;
    }
    if (update.description?.trim() === "") {
      setDescription(job.description);
      return;
    }

    if (update.requirements) {
      const cleanedRequirements = update.requirements.filter(
        (req) => req.trim() !== "",
      );
      setRequirements(cleanedRequirements);
      update.requirements = cleanedRequirements;

      if (cleanedRequirements.length === 0) {
        setRequirements(job.requirements);
        return;
      }
    } else {
      setRequirements(job.requirements);
    }

    // if updates are same as current job, return
    const isSame = isEqual({ ...job, ...update }, job);
    if (isSame) return;

    // if deadine is changed, convert to UTC string
    if (update.deadline) {
      // if deadline is same as current deadline, return
      if (new Date(update.deadline).toISOString() === job.deadline) {
        return;
      }
      update.deadline = new Date(update.deadline).toISOString();
    }

    try {
      const data = editJobPost({
        jobId,
        boardId,
        oldColumnId: columnId,
        body: update,
      });
      toast.success("Job updated successfully");
    } catch (error) {
      console.error("Failed to edit job:", error);
      toast.error("Failed to edit job");
    }
  };

  // Handle onBlur for text inputs
  const handleBlur = (field, value) => {
    handleSave({ [field]: value });
  };

  // Handle onChange for ColumnSelect
  const handleSelectChange = (newColumnId) => {
    setLocalColumnId(newColumnId);
    const title = board.columns[newColumnId].title;
    handleSave({
      status: {
        id: newColumnId,
        statusName: title,
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="p-2"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="mb-4">
          <label htmlFor="jobTitle" className="input-label">
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            placeholder="Job Title"
            value={title}
            required
            className="input-field"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleBlur("title", title)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="company" className="input-label">
            Company *
          </label>
          <input
            type="text"
            id="company"
            placeholder="Company"
            value={company}
            required
            className="input-field"
            onChange={(e) => setCompany(e.target.value)}
            onBlur={() => handleBlur("company", company)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="jobUrl" className="input-label">
            Job URL
          </label>
          <input
            type="text"
            id="jobUrl"
            placeholder="Job URL"
            value={url}
            className="input-field"
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => handleBlur("url", url)}
          />
        </div>

        {/* More fields: Location, Salary, Deadline */}
        <div className="mb-4">
          <label htmlFor="location" className="input-label">
            Company Location
          </label>
          <input
            type="text"
            id="location"
            placeholder="Location"
            value={location}
            className="input-field"
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => handleBlur("location", location)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="salary" className="input-label">
            Salary
          </label>
          <input
            type="text"
            id="salary"
            placeholder="Salary"
            value={salary}
            className="input-field"
            onChange={(e) => setSalary(e.target.value)}
            onBlur={() => handleBlur("salary", salary)}
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
            onBlur={() => handleBlur("deadline", deadline)}
          />
        </div>

        {/* Column select */}
        <div className="mb-4 sm:col-span-2 lg:col-span-3">
          <label htmlFor="column" className="input-label">
            Column
          </label>
          <ColumnSelect
            key={boardId}
            setColumnId={handleSelectChange}
            boardId={boardId}
            columnId={localColumnId}
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Description */}
        <div className="mb-4 sm:col-span-2 lg:col-span-3">
          <label htmlFor="description" className="input-label">
            Description *
          </label>
          <textarea
            id="description"
            placeholder="Enter job description"
            value={description}
            required
            className="h-32 min-h-20 w-full resize-y rounded-md border p-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-light-purple-200 dark:border-slate-700 dark:bg-dark-bgColor-300 dark:focus:ring-light-purple-200"
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur("description", description)}
          />
        </div>

        {/* Requirements */}
        <div className="mb-4 sm:col-span-2 lg:col-span-3">
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
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                onBlur={() => handleBlur("requirements", requirements)}
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
            className="mt-2 box-border w-1/2 cursor-pointer rounded-lg px-2 py-1 shadow-md transition-colors duration-300 hover:bg-light-purple-100 dark:border dark:border-slate-700 dark:hover:bg-dark-bgColor-300"
            onClick={addRequirement}
          >
            +
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobEdit;
