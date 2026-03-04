import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSideBar = false }) => {
  const isChatPage = !showSideBar;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {showSideBar && <Sidebar />}
        <div className="flex flex-col flex-1 min-h-0">
          <NavBar showSideBar={false} />
          <main
            className={`flex flex-1 min-h-0 bg-base-100 ${isChatPage ? "overflow-hidden" : "overflow-y-auto"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
