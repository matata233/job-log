import React, { useState } from "react";
import { useSignupMutation } from "../../slices/api/usersApiSlice";
import logoIcon from "../../assets/logo-icon.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setCredentials } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import NProgress from "nprogress";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [signup, { isLoading }] = useSignupMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allValid = Object.values(passwordErrors).every(Boolean);
    if (!allValid) {
      toast.error("Please ensure all password requirements are met.");
      return;
    }
    NProgress.start();
    try {
      const userData = {
        username,
        password,
        securityQuestion,
        securityAnswer,
        firstName,
        lastName,
        // email: "fakeemail@gmail.com",
      };
      const response = await signup(userData).unwrap();
      const token = response.result;
      const decodedToken = jwtDecode(token);
      dispatch(setCredentials({ ...decodedToken, token }));
      navigate(from, { replace: true });
      NProgress.done();
    } catch (error) {
      toast.error(error?.data?.error || "Signup failed!");
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
            Create a new account
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

            {/* <div>
              <label
                htmlFor="email"
                className="input-label"
              >
                Email *
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  required
                  className="input-field"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div> */}

            <div>
              <label htmlFor="password" className="input-label">
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
                    passwordErrors.minLength ? "text-green-500" : "text-red-500"
                  }
                >
                  At least 8 characters
                </li>
                <li
                  className={
                    passwordErrors.uppercase ? "text-green-500" : "text-red-500"
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
              <label htmlFor="securityQuestion" className="input-label">
                Security Question *
              </label>
              <div className="mt-2">
                <input
                  id="securityQuestion"
                  name="securityQuestion"
                  type="text"
                  value={securityQuestion}
                  required
                  className="input-field"
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="securityAnswer" className="input-label">
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
              {isLoading ? (
                <button
                  disabled
                  className="flex w-full cursor-not-allowed justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                  type="submit"
                >
                  Creating account...
                </button>
              ) : (
                <button
                  type="submit"
                  className="dark:hover:boarder-dark-purple-300 flex w-full justify-center rounded bg-light-purple-100 py-1.5 text-indigo-800 transition-colors duration-500 ease-in-out hover:border-2 hover:border-indigo-800 hover:bg-white dark:bg-dark-purple-100 dark:text-dark-purple-300 dark:hover:border-dark-purple-100 dark:hover:bg-dark-bgColor-300"
                >
                  Create an account
                </button>
              )}
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-300">
            Already have an account?{" "}
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

export default SignupPage;
