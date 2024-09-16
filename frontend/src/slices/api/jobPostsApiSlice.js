import { JOBPOSTS_URL } from "../../constants";
import { apiSlice } from "./apiSlice";
import {
  setJobPostsByBoard,
  addJob,
  editJob,
  deleteJob,
} from "../jobBoardsSlice";

export const jobPostsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobPosts: builder.query({
      query: () => ({
        url: JOBPOSTS_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["JobPost"],
    }),

    getJobPostsByBoard: builder.query({
      query: (jobBoardId) => ({
        url: `${JOBPOSTS_URL}?jobBoardId=${jobBoardId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["JobPost"],
      onQueryStarted: async (jobBoardId, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setJobPostsByBoard(data.result));
        } catch (error) {
          console.error("Failed to fetch job posts:", error);
        }
      },
    }),
    addJobPost: builder.mutation({
      query: (body) => ({
        url: `${JOBPOSTS_URL}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobPost"],
      keepUnusedDataFor: 5,
      onQueryStarted: async (body, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(addJob(data.result));
        } catch (error) {
          console.error("Failed to fetch job posts:", error);
        }
      },
    }),

    editJobPost: builder.mutation({
      query: ({ jobId, boardId, oldColumnId, body }) => ({
        url: `${JOBPOSTS_URL}/${jobId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["JobPost"],
      keepUnusedDataFor: 5,
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            editJob({
              jobId: arg.jobId,
              boardId: arg.boardId,
              oldColumnId: arg.oldColumnId,
              ...arg.body,
            }),
          );
        } catch (error) {
          console.error("Failed to fetch job posts:", error);
        }
      },
    }),

    deleteJobPost: builder.mutation({
      query: ({ boardId, columnId, jobId }) => ({
        url: `${JOBPOSTS_URL}/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JobPost"],
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            deleteJob({
              boardId: arg.boardId,
              columnId: arg.columnId,
              jobId: arg.jobId,
            }),
          );
        } catch (error) {
          console.error("Failed to delete job post:", error);
        }
      },
    }),

    updateJobPostStatus: builder.mutation({
      query: ({ jobId, boardId, oldColumnId, status }) => ({
        url: `${JOBPOSTS_URL}/${jobId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["JobPost"],
    }),
  }),
});

export const {
  useGetAllJobPostsQuery,
  useGetJobPostsByBoardQuery,
  useAddJobPostMutation,
  useEditJobPostMutation,
  useDeleteJobPostMutation,
  useUpdateJobPostStatusMutation,
} = jobPostsApiSlice;
