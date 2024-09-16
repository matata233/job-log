import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateMutation } from "../slices/api/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");

  const [update, { isLoading }] = useUpdateMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName === userInfo.firstName && lastName === userInfo.lastName) {
      toast.error("No changes detected!");
      return;
    }

    const body = {
      firstName,
      lastName,
    };

    toast.promise(update(body).unwrap(), {
      loading: "Updating profile...",
      success: (response) => {
        dispatch(
          setCredentials({
            ...userInfo,
            firstName: response.result.firstName,
            lastName: response.result.lastName,
          }),
        );
        return "Profile updated successfully!";
      },
      error: (error) => {
        return error?.data?.error || "Profile update failed!";
      },
    });
  };

  return (
    <>
      <h1 className="ml-4 text-2xl font-semibold text-gray-800 dark:text-gray-300">
        Settings
      </h1>
      <div className="mx-auto mt-10 w-4/5 sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="firstName" className="input-label">
              First Name *
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                required
                className="input-field"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="input-label">
              Last Name *
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                required
                className="input-field"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            {isLoading ? (
              <button
                disabled
                className="flex w-full cursor-not-allowed justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                type="submit"
              >
                Saving
              </button>
            ) : (
              <button
                type="submit"
                className="dark:hover:boarder-dark-purple-300 flex w-full justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:text-dark-purple-300 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default SettingsPage;
