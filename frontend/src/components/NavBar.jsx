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
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-2">
          {/* Logo Only if we in the chat page */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  Chatterly
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4  lg:hidden">
            <Link to="/" className={"btn btn-ghost btn-circle"}>
              <HomeIcon className="h-6 w-6 text-base-content opacity-70" />
            </Link>
          </div>

          <div className="flex items-center gap-3 relative sm:gap-4">
            <Link to="/notifications" className={"btn btn-ghost btn-circle"}>
              <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              {userFriendRequest?.incomingRequest?.length > 0 && (
                <span className="badge badge-primary badge-sm absolute -right-1.5 top-1">
                  {userFriendRequest?.incomingRequest?.length}
                </span>
              )}
            </Link>
          </div>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>

          {/* Logout Button */}

          <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
