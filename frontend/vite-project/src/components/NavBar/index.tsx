import { BiSolidCalendarAlt } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DateRangeFilter from "../DateRangeFilter"; 
import { useDispatch } from "react-redux";
import { setDateRange } from "../../redux/dateRangeSlice";
import NotificationPopup from "../NotificationsPopUp";
import { Badge } from "@mui/material";
import { resetDateRange } from "../../redux/dateRangeSlice";

const NavBar = ({ isCollapsed, header }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openPicker, setOpenPicker] = useState(false);

  const [openNotifications, setOpenNotifications] = useState(false);

const notifications = [
  {
    id: 1,
    message: "Document approved successfully",
    createdAt: "2026-06-22T10:30:00",
    read: false,
  },
  {
    id: 2,
    message: "Reviewer assigned",
    createdAt: "2026-06-20T12:00:00",
    read: true,
  },
  {
    id: 3,
    message: "Document rejected",
    createdAt: "2026-05-10T09:00:00",
    read: false,
  },
  {
    id: 1,
    message: "Document approved successfully",
    createdAt: "2026-06-22T10:30:00",
    read: false,
  },
  {
    id: 2,
    message: "Reviewer assigned",
    createdAt: "2026-06-20T12:00:00",
    read: true,
  },
  {
    id: 3,
    message: "Document rejected",
    createdAt: "2026-05-10T09:00:00",
    read: false,
  },
  {
    id: 1,
    message: "Document approved successfully",
    createdAt: "2026-06-22T10:30:00",
    read: false,
  },
  {
    id: 2,
    message: "Reviewer assigned",
    createdAt: "2026-06-20T12:00:00",
    read: true,
  },
  {
    id: 3,
    message: "Document rejected",
    createdAt: "2026-05-10T09:00:00",
    read: false,
  },
];

const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    console.log("handle log out");
    localStorage.removeItem("token");
    dispatch(resetDateRange());
    navigate("/sign-in");
  };

  return (
    <>
      <div
        className={`fixed top-0 z-[1500] ${
          isCollapsed ? "left-16" : "left-56"
        } transition-all duration-300 max-md:left-16 right-0 h-16 flex justify-between items-center bg-gray-600 px-3`}
      >
        <h1 className="font-bold text-xl text-white">{header}</h1>

        <div className="h-10 flex flex-row gap-4 items-center">
          
          {/* Calendar */}
          <div className="relative group">
            <BiSolidCalendarAlt
              className="text-gray-50 h-10 w-6 cursor-pointer"
              onClick={() => setOpenPicker((prev) => !prev)}
            />

            <span
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 
              bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 
              group-hover:opacity-100 transition whitespace-nowrap"
            >
              Select date range
            </span>

            {openPicker && (
              <div
                className="absolute right-0 mt-2z-99 bg-white rounded-lg shadow-lg p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <DateRangeFilter
                    onChange={(range) => {
                        console.log("Selected range:", range);
                        dispatch(setDateRange(range));
                    }}
                    onClose={() => setOpenPicker(false)}  
                    />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative group">
                <Badge badgeContent={unreadCount} 
                    sx={{
                        "& .MuiBadge-badge": {
                        backgroundColor: "#2563eb",
                        color: "#fff",                          
                        right: "-6px",             
                        transform: "scale(0.9)",   
                        },
                    }}
                >
                    <MdNotifications
                    className="text-gray-50 h-10 w-6 cursor-pointer"
                    onClick={() => {
                        setOpenNotifications((prev) => !prev);
                        setOpenPicker(false); 
                    }}
                    />
                </Badge>

                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 
                    bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 
                    group-hover:opacity-100 transition whitespace-nowrap">
                    Notifications
                </span>

                {openNotifications && (
                    <NotificationPopup
                    notifications={notifications}
                    onClose={() => setOpenNotifications(false)}
                    />
                )}
                </div>

          {/* Logout */}
          <div className="relative group" onClick={handleLogout}>
            <TbLogout className="text-red-400 h-10 w-6 cursor-pointer" />
            <span
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 
              bg-gray-500 text-white text-xs px-2 py-1 rounded opacity-0 
              group-hover:opacity-100 transition whitespace-nowrap"
            >
              Logout
            </span>
          </div>
        </div>
      </div>

      {openPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenPicker(false)}
        />
      )}
    </>
  );
};

export default NavBar;
