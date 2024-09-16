import React from "react";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import DocMenu from "./DocMenu";
import { categoryColors, getFileExtensionColor } from "../utils/fileLabel";

const FileCard = ({ doc }) => {
  const { jobId } = useParams();

  return (
    <div
      key={doc._id}
      className="relative flex flex-col justify-center gap-1 rounded bg-white p-4 text-center shadow transition duration-300 hover:shadow-md hover:ring-2 hover:ring-light-purple-200 dark:bg-dark-bgColor-300 dark:hover:ring-dark-purple-200"
    >
      <span className="absolute right-2 top-2">
        <DocMenu jobId={jobId} doc={doc} />
      </span>

      <span
        className={`${categoryColors[doc.category]} absolute left-2 top-2 rounded px-2.5 py-0.5 text-xs font-medium`}
      >
        {doc.category}
      </span>
      <p
        className="mt-4 w-full overflow-hidden text-ellipsis font-semibold dark:text-white"
        title={doc.originalFileName}
      >
        {doc.originalFileName}
      </p>
      <p
        className={`${getFileExtensionColor(doc.storedFileName)} w-full overflow-hidden text-ellipsis text-sm uppercase`}
      >
        {doc.storedFileName.split(".").pop()}
      </p>
      <p className="w-full overflow-hidden text-ellipsis text-xs text-gray-500 dark:text-gray-400">
        Uploaded: {moment(doc.createdAt).format("YYYY-MM-DD HH:mm")}
      </p>
    </div>
  );
};

export default FileCard;
