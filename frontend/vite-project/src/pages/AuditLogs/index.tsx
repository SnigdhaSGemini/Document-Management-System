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
import { useCallback, useEffect, useState } from "react";
import { BiChevronLeftCircle } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../context/loaderContext";
import { getAuditLogs } from "../../api/services/documentService";


const AuditLogs = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState();
    const {withLoader} = useLoader();
    const location = useLocation();

    const documentId = location.state?.documentId;

const actionConfig = {
  CREATE_DOCUMENT: {
    label: "Created",
    color: "#3b82f6", // 🔵 blue
  },

  UPDATE_DOCUMENT: {
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
  DELETE_DOCUMENT: {
    label: "Deleted",
    color: "purple",
  },
};

  const getLogs = useCallback(async () => {
    const response = await withLoader(async () => await getAuditLogs(documentId, false));

    if (response.data.success) {
      console.log("Audit logs fetched successfully");
      setLogs(response.data.data);
  }}, []);

useEffect(() => {
 getLogs();
}, [getLogs]);


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
          {(logs|| []).map((log, index) => {
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
                    {log.user.name}
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