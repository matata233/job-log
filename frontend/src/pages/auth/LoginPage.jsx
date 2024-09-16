import React, { useState } from "react";
import { useLoginMutation } from "../../slices/api/usersApiSlice";
import logoIcon from "../../assets/logo-icon.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setCredentials } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import NProgress from "nprogress";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    NProgress.start();
    try {
      const userData = { username, password };
      const response = await login(userData).unwrap();
      const token = response.result;
      const decodedToken = jwtDecode(token);
      dispatch(setCredentials({ ...decodedToken, token }));
      navigate(from, { replace: true });

      NProgress.done();
    } catch (error) {
      toast.error(error?.data?.error || "Login failed!");
      NProgress.done();
    }
  };

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
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="input-label">
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

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-light-purple-300 dark:text-dark-purple-300"
              >
                <div className="flex justify-between">
                  Password *
                  <Link
                    to="/reset-pwd"
                    className="text-xs text-light-purple-300 transition-colors duration-500 ease-in-out hover:text-light-purple-200 hover:underline dark:text-dark-purple-300 dark:hover:text-dark-purple-200"
                  >
                    Reset password
                  </Link>
                </div>
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  className="input-field pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-md px-2 text-light-purple-300 hover:text-light-purple-200 dark:text-dark-purple-300 dark:hover:text-dark-purple-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>
            </div>

            <div>
              {isLoading ? (
                <button
                  disabled
                  className="flex w-full cursor-not-allowed justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                  type="submit"
                >
                  Logging in...
                </button>
              ) : (
                <button
                  type="submit"
                  className="dark:hover:boarder-dark-purple-300 flex w-full justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:text-dark-purple-300 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                >
                  Log in
                </button>
              )}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="ml-1 font-semibold leading-6 text-light-purple-300 transition-colors duration-500 ease-in-out hover:text-light-purple-200 dark:text-dark-purple-300 dark:hover:text-dark-purple-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
