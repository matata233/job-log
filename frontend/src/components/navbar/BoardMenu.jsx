import React, { useState } from "react";
import { Dropdown, Space } from "antd";
import { HiDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import JSXMsgModal from "../utils/JSXMsgModal";
import { toast } from "react-hot-toast";
import { useDeleteJobBoardMutation } from "../../slices/api/jobBoardsApiSlice";

const BoardMenu = ({ boardId }) => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteJobBoard] = useDeleteJobBoardMutation();

  const onClick = ({ key }) => {
    if (key === "delete") {
      setIsDeleteModalOpen(true);
    }
  };
  const items = [
    {
      label: "Delete",
      danger: true,
      key: "delete",
    },
  ];

  return (
    <>
      <Dropdown menu={{ items, onClick }} placement="bottomLeft">
        <a
          className="cursor-pointer hover:text-light-purple-100 dark:hover:text-dark-purple-300"
          onClick={(e) => e.preventDefault()}
        >
          <Space>
            <HiDotsVertical />
          </Space>
        </a>
      </Dropdown>

      {isDeleteModalOpen && (
        <JSXMsgModal
          title="Delete Board"
          message={
            <>
              <p className="text-lg">
                Are you sure you want to delete this board?
              </p>
              <p className="text-yellow-400">
                <strong>Warning:</strong> Jobs in this board will be archived
              </p>
            </>
          }
          onConfirm={async () => {
            toast.promise(deleteJobBoard(boardId).unwrap(), {
              loading: "Deleting board...",
              success: (response) => {
                navigate("/dashboard");
                return "Board deleted successfully";
              },
              error: (error) => error?.data?.error || "Failed to delete board",
            });

            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default BoardMenu;
