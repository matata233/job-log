export const categoryColors = {
  Resume:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  "Cover Letter": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  Transcript:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export const getFileExtensionColor = (fileName) => {
  const extension = fileName.split(".").pop();
  switch (extension) {
    case "pdf":
      return "text-red-400";
    case "doc":
      return "text-violet-400";
    case "docx":
      return "text-blue-400";
    case "png":
      return "text-yellow-400";
    case "jpg":
      return "text-orange-400";
    default:
      return "text-gray-500";
  }
};
