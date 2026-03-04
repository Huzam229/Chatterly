import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSideBar = false }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {showSideBar && <Sidebar />}
        <div className="flex flex-col flex-1 min-h-0">
          <NavBar />
          <main
            className={`flex flex-1 min-h-0 bg-base-100 ${showSideBar ? "overflow-y-auto" : "overflow-hidden"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
