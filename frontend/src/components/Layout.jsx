import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSideBar = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {showSideBar && <Sidebar />}
        <div className="flex flex-col flex-1">
          <NavBar />
          <main className="flex flex-1 overflow-hidden bg-base-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
