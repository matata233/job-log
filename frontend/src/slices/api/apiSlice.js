// parent to other API slices (needed for api/backend request)
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { logout } from "../authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.userInfo?.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const userInfo = api.getState().auth?.userInfo;
  if (result.error && result.error.status === 401) {
    if (userInfo && userInfo.token) {
      toast.error("Session expired. Please login again.");
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "JobBoard", "JobPost", "File"],
  endpoints: (builder) => ({}),
  keepUnusedDataFor: 5,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
});
