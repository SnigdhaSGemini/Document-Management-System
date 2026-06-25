import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import { BiChevronLeftCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const logs = [
  {
    action: "CREATE_DOCUMENT",
    user: "Joey Bonn",
    metadata: "Document created with title: Doc-2",
    createdAt: "2026-06-09T12:58:48.118Z",
  },
  {
    action: "EDIT_DOCUMENT",
    user: "Joey Bonn",
    metadata: "Updated content in section 1",
    createdAt: "2026-06-09T01:30:00Z",
  },
  {
    action: "ADD_COMMENT",
    user: "Joey Bonn",
    metadata: "Added comment: Please review this section",
    createdAt: "2026-06-09T02:00:00Z",
  },
  {
    action: "SUBMIT_DOCUMENT",
    user: "Joey Bonn",
    metadata: "Submitted for review",
    createdAt: "2026-06-10T09:00:00Z",
  },
  {
    action: "ASSIGN_DOCUMENT",
    user: "Admin",
    metadata: "Assigned to Manager",
    createdAt: "2026-06-10T09:30:00Z",
  },
  {
    action: "REASSIGN_DOCUMENT",
    user: "Admin",
    metadata: "Re-assigned to Senior Manager",
    createdAt: "2026-06-10T10:00:00Z",
  },
  {
    action: "DELEGATE_TO_ADMIN",
    user: "Manager",
    metadata: "Delegated back to Admin",
    createdAt: "2026-06-10T11:00:00Z",
  },
  {
    action: "APPROVE_DOCUMENT",
    user: "Admin",
    metadata: "Document approved",
    createdAt: "2026-06-11T12:00:00Z",
  },
  {
    action: "ARCHIVE_DOCUMENT",
    user: "System",
    metadata: "Document archived after approval",
    createdAt: "2026-06-12T09:00:00Z",
  },
];


const AuditLogs = () => {
    const navigate = useNavigate();
const actionConfig = {
  CREATE_DOCUMENT: {
    label: "Created",
    color: "#3b82f6", // 🔵 blue
  },

  EDIT_DOCUMENT: {
    label: "Edited",
    color: "#8b5cf6", // 🟣 violet 
  },

  ADD_COMMENT: {
    label: "Added Comment",
    color: "#ec4899", // 🌸 pink
  },

  SUBMIT_DOCUMENT: {
    label: "Submitted",
    color: "#eab308", // 🟡 yellow
  },

  ASSIGN_DOCUMENT: {
    label: "Assigned",
    color: "#14b8a6", // 🟢 teal 
  },

  REASSIGN_DOCUMENT: {
    label: "Re-assigned",
    color: "#f59e0b", // 🟠 orange 
  },

  DELEGATE_TO_ADMIN: {
    label: "Delegated to Admin",
    color: "#a16207", // 🟤 brown
  },

  APPROVE_DOCUMENT: {
    label: "Approved",
    color: "#22c55e", // 🟢 green
  },

  REJECT_DOCUMENT: {
    label: "Rejected",
    color: "#ef4444", // 🔴 red
  },

  ARCHIVE_DOCUMENT: {
    label: "Archived",
    color: "#334155", // ⚫ slate 
  },
};
  return (
    <Box sx={{ p: 3 }}>

  {/*Header */}
  <Typography
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#4B5563",
      fontWeight: 600,
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "row", gap: -3 }}>
      
      {/* Back Button */}
      <Box
        sx={{
          position: "relative",
          cursor: "pointer",
          bottom: -3,
          right: 10,
          color: "#6b7280",
          "&:hover span": { opacity: 1 },
        }}
      >
        <BiChevronLeftCircle
          className="h-6 w-5"
          onClick={() => navigate(-1)}
        />

        <Box
          component="span"
          sx={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#6B7280",
            color: "#fff",
            fontSize: 12,
            fontWeight: 400,
            px: 1,
            py: 0.5,
            borderRadius: "6px",
            opacity: 0,
            transition: "0.2s",
            whiteSpace: "nowrap",
          }}
        >
          Go Back
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 3, color: "#4B5563" }}
      >
        Audit Logs
      </Typography>

    </Box>
  </Typography>

    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
      }}
    >
      <Table>

        {/* HEADER */}
        <TableHead>
          <TableRow sx={{ backgroundColor: "#6B7280" }}>
            <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
              User
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
              Action
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
              Date & Time
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
              Description
            </TableCell>
          </TableRow>
        </TableHead>

        {/* BODY */}
        <TableBody>
          {logs.map((log, index) => {
            const config = actionConfig[log.action] || {
              label: log.action,
              color: "#6b7280",
            };

            return (
              <TableRow
                key={index}
                hover
                sx={{
                  backgroundColor: "rgba(37,99,235,0.03)",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(37,99,235,0.01)",
                  },
                }}
              >

                {/* USER */}
                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>
                    {log.user}
                  </Typography>
                </TableCell>

                {/* ACTION */}
                <TableCell>
                  <Chip
                    label={config.label}
                    size="small"
                    sx={{
                      backgroundColor: `${config.color}20`,
                      color: config.color,
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                {/* DATE */}
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>
                    {new Date(log.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "#6b7280" }}
                  >
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </Typography>
                </TableCell>

                {/* DESCRIPTION */}
                <TableCell>
                  <Typography sx={{ fontSize: 13 }}>
                    {log.metadata}
                  </Typography>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>

      </Table>
    </TableContainer>

  </Box>
  );
};

export default AuditLogs;