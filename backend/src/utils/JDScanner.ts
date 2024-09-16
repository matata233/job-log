import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

export async function extractJD(jobDescription: string, retryCount: number = 5) {
  while (retryCount > 0) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a scanner that extracts title, company, location, salary, deadline, description, and a list of requirements from job descriptions. If a field is not present in the job description, return an empty string for that field. For the requirements field, return a list of 1 to 3 strings, each representing a requirement. Return the extracted information in JSON format. The JSON must be complete and valid."
          },
          {
            role: "user",
            content: jobDescription
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "print_job_description",
              description:
                "prints the extracted title, company, location, salary, deadline, description and a list of requirements from the job description.",
              strict: true,
              parameters: {
                type: "object",
                properties: {
                  title: {type: "string"},
                  company: {type: "string"},
                  location: {type: "string"},
                  salary: {type: "string"},
                  deadline: {type: "string"},
                  description: {type: "string"},
                  requirements: {type: "array", items: {type: "string"}}
                },
                required: ["title", "company", "location", "salary", "deadline", "description", "requirements"]
              }
            }
          }
        ],
        tool_choice: "required",
        parallel_tool_calls: false
      });

      const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
      let result = toolCall ? toolCall.function.arguments : response.choices?.[0]?.message?.content;
      if (!result) throw new Error("Result is undefined");
      // Clean the result from Markdown JSON code block delimiters
      result = result.replace(/^```json\n?|```$/g, "").trim();
      if (!isValidJsonString(result)) throw new Error("Invalid JSON string received");
      return JSON.parse(result);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      retryCount--;
      if (retryCount === 0) throw new Error("Failed to extract job description after several attempts.");
    }
  }
}

function isValidJsonString(str: string) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
