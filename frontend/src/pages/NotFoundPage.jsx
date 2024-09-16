import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="flex w-full flex-col items-center gap-8">
        <h1 className="md:text-16xl w-full select-none text-center text-9xl font-bold text-light-purple-300 dark:text-dark-purple-300">
          404
        </h1>

        <p className="text-center text-2xl md:px-12">
          This page could not be found.
        </p>
        <div className="flex flex-row justify-between gap-8">
          <Link
            to="/"
            className="h-8 cursor-pointer items-center justify-center rounded-md bg-light-purple-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors duration-300 ease-in-out hover:bg-light-purple-100 dark:bg-dark-purple-100 dark:text-black dark:hover:bg-dark-purple-300 md:h-10 md:text-base"
          >
            Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
