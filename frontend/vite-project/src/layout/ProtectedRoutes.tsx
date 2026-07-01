import { useState } from "react";
import { Navigate, Outlet, useLocation} from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useLoader } from "../context/loaderContext";
import Loader from "../components/Loader";

const ProtectedRoutes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const {loading} = useLoader();

  const routeTitles = {
    "/dashboard": "Dashboard",
    "/create-document": "Create Document",
    "/user-management": "User Management",
    "/my-drafts": "My Drafts",
    "/draft-details": "Draft Details",
    "/pending-reviews": "Pending Reviews",
    "/review-outcomes": "Review Outcomes",
    "/assigned-drafts": "Assigned Drafts",
    "/reviewed-documents": "Reviewed Documents",
    "/all-documents": "All Documents",
  };

  const roleAccess = {
  user: [
    "/create-document",
    "/my-drafts",
    "/pending-reviews",
    "/review-outcomes",
  ],

  reviewer: [
    "/assigned-drafts",
    "/reviewed-documents",
  ],

  admin: [
    "/user-management",
    "/all-documents",
  ],
};

  const header = routeTitles[location.pathname] || "Dashboard";

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    
    if (!token) {
        return <Navigate to="/unauthorized" replace />;
      }

      const commonRoutes = ["/dashboard",  "/draft-details", "/history", "/audit-logs"];

      const allowedRoutes = [
        ...commonRoutes,
        ...(roleAccess[role] || []),
      ];

      if (!allowedRoutes.includes(location.pathname)) {
        return <Navigate to="/unauthorized" replace />;
      }



  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[2000] bg-black/20 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <SideBar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <NavBar isCollapsed={isCollapsed} header={header} />

      <section
        className={`pt-16 transition-all duration-300 
        ${isCollapsed ? "ml-16" : "ml-56"} 
        max-md:ml-16`}
      >
        <Outlet />
      </section>
    </>
  );
};

export default ProtectedRoutes;