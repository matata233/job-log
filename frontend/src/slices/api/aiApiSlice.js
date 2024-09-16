import { apiSlice } from "./apiSlice";

export const aiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    extractJD: builder.mutation({
      query: (jobDescription) => ({
        url: `/jobDescriptionScanner`,
        method: "POST",
        body: jobDescription,
      }),
    }),
    scrapeJD: builder.mutation({
      query: (jobUrl) => ({
        url: `/jobDescriptionScraper`,
        method: "POST",
        body: jobUrl,
      }),
    }),
  }),
});

export const { useExtractJDMutation, useScrapeJDMutation } = aiApiSlice;
