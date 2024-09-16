import React from "react";
import { Dropdown, Space } from "antd";
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import {
  useUpdateFileMutation,
  useDeleteFileMutation,
} from "../../slices/api/filesApiSlice";
import toast from "react-hot-toast";

const DocMenu = ({ jobId, doc }) => {
  const navigate = useNavigate();
  const [updateFile] = useUpdateFileMutation();
  const [deleteFile] = useDeleteFileMutation();

  const onClick = async ({ key }) => {
    switch (key) {
      case "edit":
        navigate(`/documents/${doc._id}`);
        break;
      case "unlink":
        toast.promise(
          updateFile({
            id: doc._id,
            fileData: {
              ...doc,
              jobPostId: doc.jobPostId.filter((id) => id !== jobId),
            },
          }).unwrap(),
          {
            loading: "Unlinking document...",
            success: "Document unlinked successfully",
            error: (error) => error?.data?.error || "Failed to unlink document",
          },
        );
        break;
      case "delete":
        toast.promise(deleteFile(doc._id).unwrap(), {
          loading: "Deleting file...",
          success: "File deleted successfully",
          error: (error) => error?.data?.error || "Failed to delete file",
        });
        break;
      default:
        console.log("No key found");
    }
  };

  const items = jobId
    ? [
        {
          label: "Edit Document",
          key: "edit",
        },
        {
          label: "Unlink Document",
          key: "unlink",
        },
        {
          label: "Delete",
          key: "delete",
          danger: true,
        },
      ]
    : [
        {
          label: "Edit Document",
          key: "edit",
        },
        {
          label: "Delete",
          key: "delete",
          danger: true,
        },
      ];

  return (
    <>
      <Dropdown menu={{ items, onClick }} placement="bottomRight">
        <a
          className="flex cursor-pointer items-center p-2 text-xl hover:text-light-purple-100 dark:text-dark-purple-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Space>
            <HiDotsHorizontal />
          </Space>
        </a>
      </Dropdown>
    </>
  );
};

export default DocMenu;
