import { createSlice, createSelector } from "@reduxjs/toolkit";
import moment from "moment-timezone";

function initializeFilteredJobIds(state) {
  const boards = state.jobBoards.boards;
  state.filteredJobIds = {};

  Object.keys(boards).forEach((boardId) => {
    const board = boards[boardId];
    state.filteredJobIds[boardId] = {};
    Object.keys(board.columns).forEach((columnId) => {
      const column = board.columns[columnId];
      state.filteredJobIds[boardId][columnId] = column.jobIds.filter(
        (jobId) => {
          const job = state.jobBoards.jobs[jobId];
          return matchesFilter(job, state.searchQuery);
        },
      );
    });
  });
}
// filteredJobIds format
// {
//   board1 :{
//     column1: [job1, job10, job11],
//     column2: [job3, job12, job13],
//   }
// }

function matchesFilter(job, query) {
  if (!query) return true;
  const queryLowerCase = query.toLowerCase();
  return (
    job.title.toLowerCase().includes(queryLowerCase) ||
    job.description.toLowerCase().includes(queryLowerCase) ||
    job.company.toLowerCase().includes(queryLowerCase) ||
    job.location?.toLowerCase().includes(queryLowerCase) ||
    job.salary?.toLowerCase().includes(queryLowerCase) ||
    job.deadline?.toLowerCase().includes(queryLowerCase) ||
    job.requirements?.some((requirement) =>
      requirement.toLowerCase().includes(queryLowerCase),
    )
  );
}

const initialState = {
  searchQuery: "",
  boardList: [],
  jobBoards: {
    boards: {},
    jobs: {},
  },
  filteredJobIds: {},
};

const jobBoardsSlice = createSlice({
  name: "jobBoards",
  initialState,
  reducers: {
    setBoardList: (state, action) => {
      const boards = action.payload;
      state.boardList = boards.map(({ _id, title, statusOrder }) => ({
        id: _id,
        title,
        statusOrder: statusOrder.map((status) => ({
          id: status._id,
          statusName: status.statusName,
        })),
      }));
    },

    setJobBoard: (state, action) => {
      const boardData = action.payload;

      const columns = boardData.statusOrder.reduce(
        (acc, { _id, statusName }) => {
          acc[_id] = {
            id: _id,
            title: statusName,
            jobIds:
              state.jobBoards.boards[boardData._id]?.columns[_id]?.jobIds || [],
          };
          return acc;
        },
        {},
      );

      // Set or update the board
      state.jobBoards.boards[boardData._id] = {
        id: boardData._id,
        title: boardData.title,
        description: boardData.description,
        columnOrder: boardData.statusOrder.map(({ _id }) => _id),
        columns,
        createdAt: boardData.createdAt,
        updatedAt: boardData.updatedAt,
      };

      initializeFilteredJobIds(state);
    },

    setJobPostsByBoard: (state, action) => {
      const jobs = action.payload;

      jobs.forEach((job) => {
        const board = state.jobBoards.boards[job.jobBoardId];
        if (!board) return;

        const column = Object.values(board.columns).find(
          (column) => column.id === job.status._id,
        );

        if (!column) return;
        // check if job is already in the column
        if (column.jobIds.includes(job._id)) return;
        column.jobIds.push(job._id);

        // convert utc time to local time
        const localDeadline = moment(job.deadline).format("YYYY-MM-DD HH:mm");

        state.jobBoards.jobs[job._id] = {
          id: job._id,
          title: job.title,
          company: job.company,
          url: job.url,
          location: job.location,
          salary: job.salary,
          deadline: localDeadline,
          description: job.description,
          requirements: job.requirements,
          status: {
            id: job.status._id,
            statusName: job.status.statusName,
          },
          isArchived: job.isArchived,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        };
      });

      initializeFilteredJobIds(state);
    },

    moveJobWithinBoard(state, action) {
      const { source, destination, draggableId, type, boardId } =
        action.payload;

      const board = state.jobBoards.boards[boardId];

      if (type === "column") {
        // Reordering columns
        const newColumnOrder = Array.from(board.columnOrder);
        newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, draggableId);
        board.columnOrder = newColumnOrder;
        return;
      }

      const startColumn = board.columns[source.droppableId];
      const finishColumn = board.columns[destination.droppableId];
      const job = state.jobBoards.jobs[draggableId];

      // Check if job matches the filter before moving
      const isJobFiltered = matchesFilter(job, state.searchQuery);

      // Remove job from the source column
      const sourceIndex = startColumn.jobIds.indexOf(draggableId);
      if (sourceIndex !== -1) {
        startColumn.jobIds.splice(sourceIndex, 1);

        // Handle filtered jobs if the job was visible in the filter
        if (
          isJobFiltered &&
          state.filteredJobIds[boardId][source.droppableId]
        ) {
          const filteredSourceIndex =
            state.filteredJobIds[boardId][source.droppableId].indexOf(
              draggableId,
            );
          if (filteredSourceIndex !== -1) {
            state.filteredJobIds[boardId][source.droppableId].splice(
              filteredSourceIndex,
              1,
            );
          }
        }
      }

      // Add job to the destination column
      finishColumn.jobIds.splice(destination.index, 0, draggableId);

      // Handle filtered jobs if the job is visible in the filter
      if (isJobFiltered) {
        if (!state.filteredJobIds[boardId][destination.droppableId]) {
          state.filteredJobIds[boardId][destination.droppableId] = [];
        }
        state.filteredJobIds[boardId][destination.droppableId].splice(
          destination.index,
          0,
          draggableId,
        );
      }
    },

    addBoard(state, action) {
      const { title, description, statusOrder, _id, createdAt, updatedAt } =
        action.payload;
      const newBoard = {
        id: _id,
        title,
        description,
        columnOrder: statusOrder.map((status) => status._id),
        columns: statusOrder.reduce((acc, { _id, statusName }) => {
          acc[_id] = {
            id: _id,
            title: statusName,
            jobIds: [],
          };
          return acc;
        }, {}),
        createdAt,
        updatedAt,
      };
      state.jobBoards.boards[newBoard.id] = newBoard;
    },

    updateBoardTitle(state, action) {
      const boardId = action.payload._id;
      const newTitle = action.payload.title;
      const board = state.jobBoards.boards[boardId];
      if (board) {
        board.title = newTitle;
      }
    },

    deleteBoard(state, action) {
      const boardId = action.payload;
      // archive all jobs in the board
      const board = state.jobBoards.boards[boardId];
      Object.keys(board.columns).forEach((columnId) => {
        const column = board.columns[columnId];
        column.jobIds.forEach((jobId) => {
          state.jobBoards.jobs[jobId].isArchived = true;
        });
      });
      delete state.jobBoards.boards[boardId];
    },

    addColumn(state, action) {
      const boardId = action.payload._id;
      const board = state.jobBoards.boards[boardId];
      const statusOrder = action.payload.statusOrder;
      const newStatus = statusOrder[statusOrder.length - 1];
      const newColumn = {
        id: newStatus._id,
        title: newStatus.statusName,
        jobIds: [],
      };
      board.columns[newStatus._id] = newColumn;
      board.columnOrder.push(newStatus._id);
    },

    updateColumnTitle(state, action) {
      const { boardId, oldStatus, newStatus } = action.payload;
      const board = state.jobBoards.boards[boardId];

      const columnId = oldStatus.id;

      if (!columnId) return;

      board.columns[columnId].title = newStatus.statusName;
    },

    deleteColumn(state, action) {
      const { boardId, oldStatus } = action.payload;
      const board = state.jobBoards.boards[boardId];
      const columnId = oldStatus.id;
      const column = board.columns[columnId];

      if (column) {
        // archive all jobs in the column
        column.jobIds.forEach((jobId) => {
          state.jobBoards.jobs[jobId].isArchived = true;
        });

        delete board.columns[columnId];
        board.columnOrder = board.columnOrder.filter((id) => id !== columnId);
      }
    },

    addJob(state, action) {
      const {
        title,
        company,
        url,
        description,
        requirements,
        location,
        salary,
        deadline,
        jobBoardId: boardId,
        _id: id,
      } = action.payload;

      const columnId = action.payload.status._id;
      let utcDeadline = deadline;
      if (deadline) {
        utcDeadline = moment(deadline).format("YYYY-MM-DD HH:mm");
      }
      const newJob = {
        id,
        title,
        company,
        url,
        description,
        requirements,
        location,
        salary,
        deadline: utcDeadline,
        boardId,
        columnId,
      };
      state.jobBoards.jobs[id] = newJob;
      const board = state.jobBoards.boards[boardId];
      if (!board) return;
      const column = board.columns[columnId];

      if (!column.jobIds.includes(id)) {
        column.jobIds.push(id);
      }

      // if the job matches the search query, add it to the filtered job ids
      const isJobFiltered = matchesFilter(newJob, state.searchQuery);

      if (isJobFiltered) {
        state.filteredJobIds[boardId][columnId].push(id);
      }
    },

    deleteJob(state, action) {
      const { jobId, boardId, columnId } = action.payload;
      const board = state.jobBoards.boards[boardId];
      const column = board.columns[columnId];
      column.jobIds = column.jobIds.filter((id) => id !== jobId);
      delete state.jobBoards.jobs[jobId];
      if (state.filteredJobIds[boardId][columnId].includes(jobId)) {
        state.filteredJobIds[boardId][columnId] = state.filteredJobIds[boardId][
          columnId
        ].filter((id) => id !== jobId);
      }
    },

    editJob(state, action) {
      const { jobId, boardId, oldColumnId, ...update } = action.payload;
      const newColumnId = update.status?.id || oldColumnId;

      if (update.deadline) {
        update.deadline = moment(update.deadline).format("YYYY-MM-DD HH:mm");
      }

      // update job details
      const job = state.jobBoards.jobs[jobId];
      if (job) {
        // avoid putting column info in job object
        delete update.status;
        Object.assign(job, update);
      }

      const isJobFiltered = matchesFilter(job, state.searchQuery);

      // if columnId has changed, move the job to the new column
      if (newColumnId !== oldColumnId) {
        const startColumn =
          state.jobBoards.boards[boardId].columns[oldColumnId];
        const finishColumn =
          state.jobBoards.boards[boardId].columns[newColumnId];

        const sourceIndex = startColumn.jobIds.indexOf(jobId);
        if (sourceIndex !== -1) {
          startColumn.jobIds.splice(sourceIndex, 1);
        }

        // update filtered jobs list if job is visible and moving out of the column
        if (state.filteredJobIds[boardId][oldColumnId]) {
          const filteredSourceIndex =
            state.filteredJobIds[boardId][oldColumnId].indexOf(jobId);
          if (filteredSourceIndex !== -1) {
            state.filteredJobIds[boardId][oldColumnId].splice(
              filteredSourceIndex,
              1,
            );
          }
        }

        finishColumn.jobIds.push(jobId);
        if (isJobFiltered) {
          state.filteredJobIds[boardId][newColumnId].push(jobId);
        }
      } else {
        // if job is filtered and columnId has not changed, update the filtered list
        const filteredIndex =
          state.filteredJobIds[boardId][newColumnId].indexOf(jobId);
        const filteredJobs = state.filteredJobIds[boardId][newColumnId];

        if (isJobFiltered && filteredIndex === -1) {
          filteredJobs.push(jobId);
        } else if (!isJobFiltered && filteredIndex > -1) {
          filteredJobs.splice(filteredIndex, 1);
        }
      }
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      initializeFilteredJobIds(state);
    },
  },
});

export const {
  setBoardList,
  setJobBoard,
  setJobPostsByBoard,
  moveJobWithinBoard,
  addColumn,
  updateColumnTitle,
  deleteColumn,
  addJob,
  deleteJob,
  editJob,
  updateBoardTitle,
  addBoard,
  deleteBoard,
  setSearchQuery,
} = jobBoardsSlice.actions;
export default jobBoardsSlice.reducer;

export const selectFilteredJobs = createSelector(
  [
    (state, boardId, columnId) =>
      state.jobBoards.filteredJobIds[boardId]?.[columnId] || [],
    (state) => state.jobBoards.jobBoards.jobs,
  ],
  (filteredJobIds, allJobs) => {
    return filteredJobIds.map((jobId) => allJobs[jobId]);
  },
);
