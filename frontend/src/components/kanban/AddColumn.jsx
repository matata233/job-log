import React from "react";

const AddColumn = ({ onAddColumn }) => {
  return (
    <div className="flex min-h-[100px] w-64 items-center justify-center px-2">
      <button
        className="h-10 w-full rounded transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        onClick={onAddColumn}
      >
        + ADD COLUMN
      </button>
    </div>
  );
};

export default AddColumn;
