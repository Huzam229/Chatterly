import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  ShipWheelIcon,
  UserIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import useFriendRequest from "../hooks/useFriendRequest";
import { useEffect, useState } from "react";

const NavBar = ({ showSideBar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout(); // custom hook
  const { userFriendRequest } = useFriendRequest();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showLogo = showSideBar || isMobile;

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shrink-0">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-1 sm:gap-2">
          {/* Logo on chat page */}
          {(showLogo || isChatPage) && (
            <>
              <div className="shrink-0 mr-auto">
                <Link to="/" className="flex items-center gap-1 sm:gap-2.5">
                  <ShipWheelIcon className="size-5 sm:size-9 text-primary shrink-0" />
                  <span className="text-base sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    Chatterly
                  </span>
                </Link>
              </div>
              <div className="h-6 w-px bg-primary opacity-70 sm:hidden" />
            </>
          )}

          {/* Home button */}
          {isChatPage ? (
            <Link to="/" className="btn btn-ghost btn-circle btn-sm sm:btn-md">
              <HomeIcon className="h-5 w-5 text-base-content opacity-70" />
            </Link>
          ) : (
            <div className="lg:hidden">
              <Link
                to="/"
                className="btn btn-ghost btn-circle btn-sm sm:btn-md"
              >
                <HomeIcon className="h-5 w-5 text-base-content opacity-70" />
              </Link>
            </div>
          )}

          <div className="lg:hidden">
            <Link
              to="/friends"
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            >
              <UserIcon className="h-5 w-5 text-base-content opacity-70" />
            </Link>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Link
              to="/notifications"
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            >
              <BellIcon className="h-5 w-5 text-base-content opacity-70" />
              {userFriendRequest?.incomingRequest?.length > 0 && (
                <span className="badge badge-primary badge-sm absolute -right-3 -top-0.5 sm:-right-1 sm:top-1">
                  {" "}
                  {userFriendRequest?.incomingRequest?.length}
                </span>
              )}
            </Link>
          </div>

          <ThemeSelector />

          {/* Avatar */}
          <div className="avatar shrink-0">
            <div className="w-7 sm:w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

          {/* Logout */}
          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-5 w-5 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
