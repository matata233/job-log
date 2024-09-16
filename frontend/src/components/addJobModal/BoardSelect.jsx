import React from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import "../utils/select.css";

const BoardSelect = ({ boardId, handleBoardChange }) => {
  const boardList = useSelector((state) => state.jobBoards.boardList);
  const onChange = (value) => {
    handleBoardChange(value);
  };

  const options = boardList.map((board) => ({
    value: board.id,
    label: board.title,
  }));

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  return (
    <Select
      defaultValue={boardId}
      showSearch
      className="h-fit w-full"
      placeholder="Board"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      options={options}
    />
  );
};

export default BoardSelect;
