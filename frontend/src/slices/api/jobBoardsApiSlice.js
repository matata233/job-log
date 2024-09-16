import { JOBBOARDS_URL } from "../../constants";
import { apiSlice } from "./apiSlice";
import {
  setJobBoard,
  setBoardList,
  addBoard,
  updateBoardTitle,
  deleteBoard,
  addColumn,
  updateColumnTitle,
  deleteColumn,
} from "../jobBoardsSlice";

export const jobBoardsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobBoards: builder.query({
      query: () => ({
        url: `${JOBBOARDS_URL}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["JobBoard"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBoardList(data.result));
        } catch (error) {
          console.error("Failed to fetch job boards data:", error);
        }
      },
    }),

    getJobBoardById: builder.query({
      query: (boardId) => ({
        url: `${JOBBOARDS_URL}/${boardId}`,
        method: "GET",
      }),
      providesTags: ["JobBoard"],
      keepUnusedDataFor: 5,
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setJobBoard(data.result));
        } catch (error) {
          console.error("Failed to fetch job board data:", error);
        }
      },
    }),

    addJobBoard: builder.mutation({
      query: (body) => ({
        url: `${JOBBOARDS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobBoard"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addBoard(data.result));
        } catch (error) {
          console.error("Failed to add job board:", error);
        }
      },
    }),

    updateJobBoardTitle: builder.mutation({
      query: ({ boardId, title }) => ({
        url: `${JOBBOARDS_URL}/${boardId}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["JobBoard"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateBoardTitle(data.result));
        } catch (error) {
          console.error("Failed to update job board title:", error);
        }
      },
    }),

    deleteJobBoard: builder.mutation({
      query: (boardId) => ({
        url: `${JOBBOARDS_URL}/${boardId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobBoard"],
      onQueryStarted: async (boardId, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(deleteBoard(boardId));
        } catch (error) {
          console.error("Failed to delete job board:", error);
        }
      },
    }),

    addColumn: builder.mutation({
      query: ({ boardId, statusOrder }) => ({
        url: `${JOBBOARDS_URL}/${boardId}`,
        method: "PUT",
        body: { statusOrder },
      }),
      invalidatesTags: ["JobBoard"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addColumn(data.result));
        } catch (error) {
          console.error("Failed to add column:", error);
        }
      },
    }),

    updateColumnTitle: builder.mutation({
      query: ({ boardId, oldStatus, newStatus }) => ({
        url: `${JOBBOARDS_URL}/${boardId}/status`,
        method: "PUT",
        body: { oldStatus, newStatus },
      }),
      invalidatesTags: ["JobBoard"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            updateColumnTitle({
              boardId: data.result._id,
              oldStatus: arg.oldStatus,
              newStatus: arg.newStatus,
            }),
          );
        } catch (error) {
          console.error("Failed to update column title:", error);
        }
      },
    }),

    deleteColumn: builder.mutation({
      query: ({ boardId, oldStatus }) => ({
        url: `${JOBBOARDS_URL}/${boardId}/status`,
        method: "PUT",
        body: { oldStatus },
      }),
      invalidatesTags: ["JobBoard"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            deleteColumn({
              boardId: arg.boardId,
              oldStatus: arg.oldStatus,
            }),
          );
        } catch (error) {
          console.error("Failed to delete column:", error);
        }
      },
    }),

    updateColumnOrder: builder.mutation({
      query: ({ boardId, statusOrder }) => ({
        url: `${JOBBOARDS_URL}/${boardId}`,
        method: "PUT",
        body: { statusOrder },
      }),
      invalidatesTags: ["JobBoard"],
    }),
  }),
});

export const {
  useGetJobBoardsQuery,
  useGetJobBoardByIdQuery,
  useAddJobBoardMutation,
  useUpdateJobBoardTitleMutation,
  useDeleteJobBoardMutation,
  useAddColumnMutation,
  useUpdateColumnTitleMutation,
  useDeleteColumnMutation,
  useUpdateColumnOrderMutation,
} = jobBoardsApiSlice;
