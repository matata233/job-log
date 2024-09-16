import { FILES_URL } from "../../constants";
import { apiSlice } from "./apiSlice";

export const filesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFiles: builder.query({
      query: () => ({
        url: `${FILES_URL}`,
        method: "GET",
      }),
      providesTags: ["File"],
    }),

    getFilesByJobPost: builder.query({
      query: (jobPostId) => ({
        url: `${FILES_URL}?jobPostId=${jobPostId}`,
        method: "GET",
      }),
      providesTags: ["File"],
    }),

    getFileById: builder.query({
      query: (fileId) => ({
        url: `${FILES_URL}/${fileId}`,
        method: "GET",
      }),
      providesTags: ["File"],
    }),

    uploadFile: builder.mutation({
      query: (fileData) => ({
        url: `${FILES_URL}`,
        method: "POST",
        body: fileData,
      }),
      invalidatesTags: ["File"],
    }),
    updateFile: builder.mutation({
      query: ({ id, fileData }) => ({
        url: `${FILES_URL}/${id}`,
        method: "PUT",
        body: fileData,
      }),

      invalidatesTags: ["File"],
    }),

    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: `${FILES_URL}/${fileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["File"],
    }),
  }),
});

export const {
  useGetAllFilesQuery,
  useGetFilesByJobPostQuery,
  useGetFileByIdQuery,
  useUpdateFileMutation,
  useUploadFileMutation,
  useDeleteFileMutation,
} = filesApiSlice;
