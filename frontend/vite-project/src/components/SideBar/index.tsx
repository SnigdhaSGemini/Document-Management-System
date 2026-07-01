import { NavLink } from "react-router-dom";
import { CgFileDocument } from "react-icons/cg";
import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { IoMdCreate } from "react-icons/io";
import { LuUserRoundCog } from "react-icons/lu";
import { MdPendingActions, MdMenu } from "react-icons/md";
import { RiDraftLine, RiUserSharedLine } from "react-icons/ri";
import { TbLayoutDashboard } from "react-icons/tb";
import { VscPreview } from "react-icons/vsc";

const SideBar = ({ isCollapsed, setIsCollapsed }) => {
    const role = localStorage.getItem("role");

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const itemClass = "flex items-center gap-2 h-10 rounded-xl px-3 cursor-pointer hover:bg-gray-100 transition";
  const activeClass = "bg-gray-200";

  return (
    <div
      className={`h-full fixed bg-gray-50 transition-all duration-300 ${isCollapsed ? "w-16" : "w-56"} max-md:w-16`}>
      {/* Toggle */}
      <div
        className={`md:flex items-center gap-2 p-2 hidden ${ isCollapsed ? "justify-center" : "justify-end"}`}>
        <button onClick={toggleSidebar}>
          <MdMenu className="text-xl cursor-pointer" />
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 p-2">
        <img src="./icons/logo.png" alt="logo" className="h-5 w-5 mt-3 md:mt-0" />
        {!isCollapsed && (
          <span className="font-bold text-lg tracking-wide hidden md:block">
            DocuSystem
          </span>
        )}
      </div>

      <hr className="mx-3 my-2 border-gray-300" />

      {/* Menu */}
      <div className="flex flex-col gap-1 px-2">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <TbLayoutDashboard className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">Dashboard</span>}
        </NavLink>

      {role === "user" && (<>
        {/* Create Document */}
        <NavLink
          to="/create-document"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <IoMdCreate className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">Create Document</span>}
        </NavLink>

        {/* Drafts */}
        <NavLink
          to="/my-drafts"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <RiDraftLine className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">My Drafts</span>}
        </NavLink>

        {/* Pending */}
        <NavLink
          to="/pending-reviews"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdPendingActions className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">Pending Reviews</span>}
        </NavLink>

        {/* Review */}
        <NavLink
          to="/review-outcomes"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <VscPreview className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">Review Outcomes</span>}
        </NavLink>
      </>
      )}

      {role === "reviewer" && (<>
        {/* Assigned */}
        <NavLink
          to="/assigned-drafts"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <HiOutlineClipboardDocumentCheck className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">Assigned Drafts</span>}
        </NavLink>

        {/* Reviewed */}
        <NavLink
          to="/reviewed-documents"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <VscPreview className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">Reviewed Documents</span>}
        </NavLink>
      </>)}

        {role === "admin" && (<>
        {/* Users */}
        <NavLink
          to="/user-management"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <LuUserRoundCog className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">User Management</span>}
        </NavLink>

        {/* Docs */}
        <NavLink
          to="/all-documents"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? activeClass : ""}`
          }
        >
          <CgFileDocument className="text-lg" />
          {!isCollapsed && <span className="hidden md:block">All Documents</span>}
        </NavLink>
        </>)}

      </div>
    </div>
  );
};

export default SideBar;