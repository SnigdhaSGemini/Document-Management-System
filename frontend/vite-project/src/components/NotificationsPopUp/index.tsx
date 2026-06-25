import { Box, Typography, Paper } from "@mui/material";
import dayjs from "dayjs";

const getTimeLabel = (date) => {
  const now = dayjs();
  const d = dayjs(date);

  const diffDays = now.diff(d, "day");

  if (diffDays > 30) {
    return d.format("DD MMM YYYY");
  }

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }

  const diffHours = now.diff(d, "hour");
  if (diffHours > 0) return `${diffHours} hr ago`;

  const diffMin = now.diff(d, "minute");
  if (diffMin > 0) return `${diffMin} min ago`;

  return "Just now";
};

const NotificationPopup = ({ notifications, onClose }) => {
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}/>
      <div className="absolute right-0 mt-2 z-[1500] w-80 bg-white rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <Box sx={{ p: 2, }}>
          <Typography sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          color: "#4B5563",
        }}>
            Notifications
          </Typography>
        </Box>

        <div className="max-h-96 overflow-y-auto">
        {/* Content */}
        
        {sortedNotifications.length === 0 ? (
          <Box sx={{ p: 2 }}>
            <Typography sx={{ color: "#6b7280", }}>
              <i>No notifications</i>
            </Typography>
          </Box>
        ) : (
          sortedNotifications.map((n) => (
            <Paper
              key={n.id}       
              elevation={0}  
              square    
              sx={{
                p: 2,
                borderRadius: 0,
                borderBottom: ".01px solid rgba(37,99,235,0.2)",
                backgroundColor:  "rgba(37,99,235,0.05)",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(37,99,235,0.1)",
                },
              }}
            >
              {/* Message */}
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "slategray" }}>
                {n.message}
              </Typography>

              {/* Time */}
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#6b7280",
                  mt: 0.5,
                }}
              >
                {getTimeLabel(n.createdAt)}
              </Typography>
            </Paper>
          ))
        )}
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;