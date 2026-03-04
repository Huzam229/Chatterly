import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSideBar = false }) => {
  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "100dvh" }}>
      <div className="flex flex-1 min-h-0">
        {showSideBar && <Sidebar />}
        <div className="flex flex-col flex-1 min-h-0">
          <NavBar showSideBar={showSideBar} />
          <main
            className={`flex flex-1 min-h-0 bg-base-100 ${!showSideBar ? "overflow-hidden" : "overflow-y-auto"}`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
