import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/logo-icon.svg";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../slices/themeSlice";

const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const getModeIcon = () => {
    switch (theme) {
      case "light":
        return <FaSun />;
      case "dark":
        return <FaMoon />;
      case "system":
        return <FaDesktop />;
      default:
        return <FaDesktop />;
    }
  };

  const [top, setTop] = useState(true);

  const scrollHandler = () => {
    window.scrollY > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between rounded-2xl bg-white bg-white/90 px-3 shadow-sm backdrop-blur-sm dark:bg-slate-800 dark:bg-slate-800/90">
          {/* Icon */}
          <div className="flex items-center">
            <div className="mx-auto size-16">
              <Link to={"/"}>
                <img src={logoIcon} alt="JoBlog" />
              </Link>
            </div>
          </div>

          {/* Sign up and login button */}
          <ul className="flex items-center gap-3">
            <li className="mr-4 flex items-center">
              <button
                onClick={() =>
                  dispatch(
                    setTheme(
                      theme === "light"
                        ? "dark"
                        : theme === "dark"
                          ? "system"
                          : "light",
                    ),
                  )
                }
                className="transition-colors duration-300 ease-in-out hover:text-light-purple-300 hover:dark:text-dark-purple-300"
              >
                {getModeIcon()}
              </button>
            </li>
            <li>
              <Link
                to={"/login"}
                className="rounded p-1 text-sm shadow transition-colors duration-500 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-bgColor-200 md:p-2 md:text-base"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to={"/signup"}
                className="normal-btn p-1 text-sm md:p-2 md:text-base"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
