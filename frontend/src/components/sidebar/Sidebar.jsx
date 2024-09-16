import React, { useEffect } from "react";
import {
  PiArrowLineLeftBold,
  PiArrowLineRightBold,
  PiXBold,
} from "react-icons/pi";
import { MdOutlineDashboard, MdOutlineFileCopy } from "react-icons/md";
import UserMenu from "./UserMenu";
import { BiMenuAltLeft } from "react-icons/bi";
import logo from "../../assets/logo.svg";
import logoIcon from "../../assets/logo-icon.svg";
import SidebarItem from "./SidebarItem";
import BoardList from "./BoardList";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarExpand } from "../../slices/siderbarSlice";
import { setIsMobile, setIsMobileMenuOpen } from "../../slices/mobileSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const expanded = useSelector((state) => state.sidebar.expanded);
  const isMobile = useSelector((state) => state.mobile.isMobile);
  const isMobileMenuOpen = useSelector(
    (state) => state.mobile.isMobileMenuOpen,
  );
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const handleResize = () => {
      const isMobileDevice = window.matchMedia("(max-width: 640px)").matches;
      dispatch(setIsMobile(isMobileDevice));
      if (isMobileDevice) {
        dispatch(setSidebarExpand(true)); // always expand sidebar on mobile
      } else {
        dispatch(setIsMobileMenuOpen(false));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("aside")) {
        dispatch(setIsMobileMenuOpen(false));
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      dispatch(setIsMobileMenuOpen(!isMobileMenuOpen));
    } else {
      dispatch(setSidebarExpand(!expanded));
    }
  };

  // close sidebar on mobile when clicking on sidebar item
  const closeSidebar = () => {
    if (isMobile) {
      dispatch(setIsMobileMenuOpen(false));
    }
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-50 h-full border-r bg-light-bgColor-200 shadow-sm transition-all duration-300 dark:border-r-slate-700 dark:bg-dark-bgColor-200 ${expanded || isMobileMenuOpen ? "w-64" : "w-20"} ${isMobileMenuOpen ? "block" : "hidden sm:block"}`}
      >
        <nav className="flex h-full flex-col">
          <div
            className={`flex items-center justify-between p-3 pb-2 ${!expanded && !isMobileMenuOpen ? "flex-col items-center" : ""}`}
          >
            {expanded || isMobileMenuOpen ? (
              <img
                src={logo}
                alt="Logo"
                className="w-32 overflow-hidden transition-all"
              />
            ) : (
              <img
                src={logoIcon}
                alt="Logo Icon"
                className="mb-2 w-10 overflow-hidden transition-all"
              />
            )}
            <button
              onClick={toggleSidebar}
              className="rounded-lg bg-gray-50 p-2 transition-all duration-300 hover:bg-light-purple-100 dark:bg-dark-bgColor-100 dark:hover:bg-dark-purple-100 dark:hover:text-dark-bgColor-100"
            >
              {isMobileMenuOpen ? (
                <PiXBold />
              ) : expanded ? (
                <PiArrowLineLeftBold />
              ) : (
                <PiArrowLineRightBold />
              )}
            </button>
          </div>

          <ul className="px-3">
            <SidebarItem
              icon={<MdOutlineDashboard className="size-6" />}
              text="Dashboard"
              expanded={expanded}
            />
            <SidebarItem
              icon={<MdOutlineFileCopy className="size-6" />}
              text="Documents"
              expanded={expanded}
            />

            <hr className="my-3 dark:border-slate-700" />
          </ul>

          <div className="flex-1 overflow-auto px-3">
            <BoardList onClick={closeSidebar} />
          </div>

          <div className="flex items-center justify-center border-t p-3 dark:border-t-slate-700">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded bg-light-purple-200 text-lg font-bold text-white dark:bg-dark-purple-100 dark:text-dark-purple-300`}
            >
              {`${userInfo?.firstName?.charAt(0).toUpperCase()}${userInfo?.lastName?.charAt(0).toUpperCase()}`}
            </div>
            {expanded && (
              <div className="ml-3 flex w-44 items-center transition-all">
                <div
                  className="flex-grow truncate font-semibold"
                  title={userInfo?.username}
                >
                  {userInfo?.firstName} {userInfo?.lastName}
                </div>
                <div className="ml-2 flex-shrink-0">
                  <UserMenu />
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div
        className={`transition-all duration-300 ${!isMobile ? (expanded ? "ml-64" : "ml-20") : "ml-0"}`}
      ></div>

      {isMobile && !isMobileMenuOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed left-2 top-2 z-50 cursor-pointer rounded border border-light-purple-300 bg-light-bgColor-100 p-2 text-light-purple-300 hover:bg-light-purple-100 dark:border-dark-purple-300 dark:bg-dark-bgColor-200 dark:text-dark-purple-300 dark:hover:bg-dark-purple-100 dark:hover:text-dark-purple-300"
        >
          <BiMenuAltLeft className="size-6" />
        </button>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 opacity-50"></div>
      )}
    </>
  );
};

export default Sidebar;
