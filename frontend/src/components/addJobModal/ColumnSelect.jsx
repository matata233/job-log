import React, { useMemo } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import "../utils/select.css";

const ColumnSelect = ({ columnId, setColumnId, boardId }) => {
  const boardList = useSelector((state) => state.jobBoards.boardList);

  const onChange = (value) => setColumnId(value);

  // memoize the computed columns list to avoid re-computing it on every render
  const columnOptions = useMemo(() => {
    const board = boardList.find((board) => board.id === boardId);
    if (!board) return [];

    return board.statusOrder.map((status) => ({
      value: status.id,
      label: status.statusName,
    }));
  }, [boardId, boardList]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Select
      defaultValue={columnId}
      showSearch
      className="h-fit w-full"
      placeholder="Column"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      options={columnOptions}
    />
  );
};

export default ColumnSelect;
