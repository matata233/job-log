import React from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../slices/jobBoardsSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.jobBoards.searchQuery);

  const handleSearch = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className="relative flex items-center">
      <HiOutlineSearch className="absolute left-3 text-gray-500" />
      <input
        value={query}
        type="text"
        className="w-full rounded-lg border border-gray-300 py-1 pl-10 pr-4 shadow-sm focus:border-light-purple-300 focus:outline-none dark:border-slate-700 dark:bg-dark-bgColor-300 dark:focus:border-dark-purple-300"
        placeholder="Filter..."
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
