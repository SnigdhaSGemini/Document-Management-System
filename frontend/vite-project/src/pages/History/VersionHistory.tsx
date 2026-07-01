import { Box, Typography, Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { BiChevronLeftCircle } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoader } from "../../context/loaderContext";
import { getDocumentVersions } from "../../api/services/documentService";

const VersionHistory = () => {
    const {withLoader} = useLoader();
    const navigate = useNavigate();
    const [versions, setVersions] = useState();
    const location = useLocation();

    const documentId = location.state?.documentId;

    const getDocVersions = useCallback(async () => {
        const response = await withLoader(async () => await getDocumentVersions(documentId, false));
    
        if (response.data.success) {
          console.log("Document versions successfully");
          setVersions(response.data.data);
    }}, []);

    useEffect(() => {
    getDocVersions();
    }, [getDocVersions]);

  return (
    <Box sx={{ p: 3 }}>

        {/* Header */}
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#4B5563",
                fontWeight: 600,
              }}
            >
            <Box sx={{display: "flex", flexDirection: "row", gap: -3}}>
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
                    <BiChevronLeftCircle className="h-6 w-5" onClick={() => navigate(-1)}/>
      
                    {/* Tooltip */}
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
               <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 4, color: "#4B5563" }}
                >
                Version History
                </Typography>
            </Box>
            </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {(versions||[])
          .sort((a, b) => b.version - a.version)
          .map((v, index) => {

            const isLatest = index === 0;

            return (
              <Paper
                key={v.version}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: isLatest
                    ? "1px solid rgba(37,99,235,0.4)" // highlight latest
                    : "1px solid #e5e7eb",
                  backgroundColor: isLatest
                    ? "rgba(37,99,235,0.06)"
                    : "#fff",
                }}
              >
                {/* Header Row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#3b5bcc",
                    }}
                  >
                    Version {v.version}
                    {isLatest && " (Latest)"}
                  </Typography>

                  <Typography
                    sx={{ fontSize: 12, color: "#6b7280" }}
                  >
                    Created: {new Date(v.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                {/* Title */}
                <Typography
                  sx={{
                    fontWeight: 500,
                    mb: 1,
                    color: "#374151",
                  }}
                >
                  {v.title}
                </Typography>

                {/* Content */}
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                  }}
                >
                  {v.content}
                </Typography>
              </Paper>
            );
          })}
        {(!versions || versions.length === 0 ) && (<span className="flex justify-center items-center italic">No version history yet.</span>)}
      </Box>
    </Box>
  );
};

export default VersionHistory;