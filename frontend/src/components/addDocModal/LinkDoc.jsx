import React, { useMemo } from "react";
import { Select } from "antd";
import "../utils/select.css";
import moment from "moment-timezone";

const LinkDoc = ({ files, excludedFiles, linkFile, setLinkFile }) => {
  const excludedFileIds = useMemo(
    () => excludedFiles.map((file) => file._id),
    [excludedFiles],
  );

  const fileOptions = useMemo(() => {
    return files
      ?.filter((file) => !excludedFileIds.includes(file._id))
      .map((file) => ({
        value: file._id,
        label: `${file.originalFileName} - ${moment(file.createdAt).format("YYYY-MM-DD HH:mm")}`,
      }));
  }, [files, excludedFileIds]);

  const onChange = (value) => setLinkFile(value);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Select
      value={linkFile}
      showSearch
      className="h-fit w-full"
      placeholder="Select a file"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={filterOption}
      options={fileOptions}
    />
  );
};

export default LinkDoc;
