import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children, showSideBar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSideBar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <NavBar />

          <main className="flex flex-1 overflow-y-auto bg-base-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
