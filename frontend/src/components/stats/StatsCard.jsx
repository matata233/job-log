import React from "react";
import { FaArrowUp, FaArrowDown, FaGripLines } from "react-icons/fa6";

const StatsCard = ({ data, Icon, title }) => {
  const isDateInMonth = (dateString, year, month) => {
    const date = new Date(dateString);
    return date.getFullYear() === year && date.getMonth() === month;
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthData = data?.filter((singleData) =>
    isDateInMonth(singleData.createdAt, currentYear, currentMonth),
  );
  const previousMonthData = data?.filter((singleData) =>
    isDateInMonth(singleData.createdAt, previousMonthYear, previousMonth),
  );

  const currentMonthCount = currentMonthData?.length;
  const previousMonthCount = previousMonthData?.length;

  const absoluteChange = currentMonthCount - previousMonthCount;
  const rateOfChange =
    previousMonthCount > 0 ? (absoluteChange / previousMonthCount) * 100 : null; // Avoid division by zero

  // Determine color based on rate of change
  const isIncrease = rateOfChange > 0;
  const isDecrease = rateOfChange < 0;
  const colorClass = isIncrease ? "green" : isDecrease ? "red" : "gray";
  const bgColor = `bg-${colorClass}-100`;
  const textColor = `text-${colorClass}-800`;
  const darkBgColor = `dark:bg-${colorClass}-900`;
  const darkTextColor = `dark:text-${colorClass}-300`;

  return (
    <div className="rounded-lg bg-white ring-2 ring-white transition duration-300 ease-in-out hover:shadow-lg hover:ring-light-purple-300 dark:bg-[#16161a] dark:ring-[#16161a] dark:hover:ring-dark-purple-300">
      <div className="flex flex-col justify-center rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {currentMonthCount}
            </p>
          </div>

          <div className="rounded-full bg-light-purple-300 p-3 dark:bg-dark-purple-300">
            <Icon className="text-2xl text-light-bgColor-100 dark:text-dark-bgColor-300" />
          </div>
        </div>

        <div className="mt-4 flex items-center">
          {rateOfChange !== null ? (
            <>
              <div
                className={`flex items-center gap-1 rounded ${bgColor} ${textColor} ${darkBgColor} ${darkTextColor} px-2.5 py-0.5 text-sm font-medium`}
              >
                {isIncrease ? (
                  <FaArrowUp />
                ) : isDecrease ? (
                  <FaArrowDown />
                ) : (
                  <FaGripLines />
                )}
                <p>{`${Math.abs(rateOfChange).toFixed(2)}%`}</p>
              </div>

              <p className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                Since last month
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Since last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
