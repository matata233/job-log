import React, { useState, useEffect } from "react";
import {
  useGetSecurityQuestionQuery,
  useUpdateMutation,
} from "../../slices/api/usersApiSlice";
import logoIcon from "../../assets/logo-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/utils/Loader";

const ResetPwdPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    data: userData,
    isLoading: isLoadingSecurityQuestion,
    isError,
    error,
  } = useGetSecurityQuestionQuery(username, {
    skip: !triggerFetch,
  });

  const [update, { isLoadingUpdate }] = useUpdateMutation();

  const validatePassword = (password) => {
    const errors = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    };
    setPasswordErrors(errors);
    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmitUsername = async (e) => {
    e.preventDefault();
    setTriggerFetch(true);
  };

  const handleResetPwd = async (e) => {
    e.preventDefault();
    const allValid = Object.values(passwordErrors).every(Boolean);
    if (!allValid) {
      toast.error("Please ensure all password requirements are met.");
      return;
    }

    const body = {
      username: userData?.result.userName,
      password,
      securityAnswer,
    };

    toast.promise(update(body).unwrap(), {
      loading: "Resetting password...",
      success: () => {
        navigate("/login", { replace: true });
        return "Password reset successfully!";
      },
      error: (error) => error?.data?.error || "Reset password failed!",
    });
  };

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.error || "An error occurred!");
      setTriggerFetch(false);
    }
  }, [isError, error]);

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div>
          <div className="mx-auto size-16">
            <Link to={"/"}>
              <img src={logoIcon} alt="JoBlog" />
            </Link>
          </div>
          <h2 className="mt-5 text-center text-2xl font-bold text-light-purple-300 dark:text-dark-purple-300">
            Reset your password
          </h2>
        </div>

        {isLoadingSecurityQuestion && <Loader />}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!userData && !isLoadingSecurityQuestion && (
            <form className="space-y-6" onSubmit={handleSubmitUsername}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-light-purple-300 dark:text-dark-purple-300"
                >
                  Username *
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    required
                    className="input-field"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800"
              >
                Continue
              </button>
            </form>
          )}

          {userData && (
            <form className="space-y-6" onSubmit={handleResetPwd}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium text-light-purple-300 dark:text-dark-purple-300"
                >
                  Username *
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    required
                    disabled
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-light-purple-300 dark:text-dark-purple-300"
                >
                  Password *
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    required
                    className="input-field pr-10"
                    onChange={handlePasswordChange}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-md px-2 text-light-purple-300 hover:text-light-purple-200 dark:text-dark-purple-300 dark:hover:text-dark-purple-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                </div>
                <ul className="mt-2 list-disc pl-5 text-xs">
                  <li
                    className={
                      passwordErrors.minLength
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    At least 8 characters
                  </li>
                  <li
                    className={
                      passwordErrors.uppercase
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    At least one uppercase letter
                  </li>
                  <li
                    className={
                      passwordErrors.number ? "text-green-500" : "text-red-500"
                    }
                  >
                    At least one number
                  </li>
                  <li
                    className={
                      passwordErrors.specialChar
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    At least one special character (!, @, #, $, %, ^, &, *)
                  </li>
                </ul>
              </div>

              <div>
                <label
                  htmlFor="securityQuestion"
                  className="mb-1 block text-sm font-medium text-light-purple-300 dark:text-dark-purple-300"
                >
                  Security Question *
                </label>
                <div className="mt-2">
                  <input
                    id="securityQuestion"
                    name="securityQuestion"
                    type="text"
                    value={userData?.result.securityQuestion}
                    required
                    disabled
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="securityAnswer"
                  className="mb-1 block text-sm font-medium text-light-purple-300 dark:text-dark-purple-300"
                >
                  Security Answer *
                </label>
                <div className="mt-2">
                  <input
                    id="securityAnswer"
                    name="securityAnswer"
                    type="text"
                    value={securityAnswer}
                    required
                    className="input-field"
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                  />
                </div>
              </div>

              <div>
                {isLoadingUpdate ? (
                  <button
                    disabled
                    className="flex w-full cursor-not-allowed justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                    type="submit"
                  >
                    Resetting password...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="dark:hover:boarder-dark-purple-300 flex w-full justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:text-dark-purple-300 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                  >
                    Reset Password
                  </button>
                )}
              </div>
            </form>
          )}
          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-300">
            Go back to{" "}
            <Link
              to="/login"
              className="ml-1 font-semibold leading-6 text-light-purple-300 transition-colors duration-500 ease-in-out hover:text-light-purple-200 dark:text-dark-purple-300 dark:hover:text-dark-purple-200"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPwdPage;
