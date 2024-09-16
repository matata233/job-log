import { USERS_URL } from "../../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        // userData includes username, password, securityQuestion, securityAnswer
        url: `${USERS_URL}`,
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        // userData includes username, password
        url: `${USERS_URL}/login`,
        method: "POST",
        body: userData,
      }),
    }),
    update: builder.mutation({
      query: (body) => ({
        url: `${USERS_URL}`,
        method: "PUT",
        body,
      }),
    }),

    getSecurityQuestion: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/?userName=${username}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useUpdateMutation,
  useGetSecurityQuestionQuery,
} = usersApiSlice;
