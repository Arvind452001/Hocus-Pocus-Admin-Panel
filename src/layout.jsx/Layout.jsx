import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../App";



function Layout() {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="admin-app">
      <Sidebar />
      <div className="content">
        <Header title="Dashboard" />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export default Layout;