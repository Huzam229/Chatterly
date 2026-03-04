import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import useFriendRequest from "../hooks/useFriendRequest";

const NavBar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout(); // custom hook
  const { userFriendRequest } = useFriendRequest();

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center shrink-0">
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-1 sm:gap-2">
          {/* Logo on chat page */}
          {isChatPage && (
            <div className="shrink-0 mr-auto">
              <div className="flex items-center gap-1 sm:gap-2.5 cursor-pointer">
                <ShipWheelIcon className="size-5 sm:size-9 text-primary shrink-0" />
                <span className="text-base sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Chatterly
                </span>
              </div>
            </div>
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

          {/* Notifications */}
          <div className="relative">
            <Link
              to="/notifications"
              className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            >
              <BellIcon className="h-5 w-5 text-base-content opacity-70" />
              {userFriendRequest?.incomingRequest?.length > 0 && (
                <span className="badge badge-primary badge-sm absolute -right-1 top-0">
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
