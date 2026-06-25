import {
  Typography,
  Box,
  Button,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions
} from "@mui/material";
import { History, ReceiptLong } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiChevronLeftCircle } from "react-icons/bi";
import WarningPopUp from "../../components/WarningPopUp";

const ROLE = {
  CREATOR: "creator",
  REVIEWER: "reviewer",
  ADMIN: "admin",
};

const STATUS = {
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  ARCHIVED: "archived",
};

const DetailsPage = () => {
  
 const navigate = useNavigate();
  const location = useLocation();

  // Role + Status 
const [userRole] = useState(ROLE.ADMIN); 
const [documentStatus, setDocumentStatus] = useState(STATUS.IN_REVIEW);

// Reviewer modal state
const [reviewerModalOpen, setReviewerModalOpen] = useState(false);

// Reviewer selection
const [selectedReviewer, setSelectedReviewer] = useState("");

// Current reviewer
const [currentReviewer, setCurrentReviewer] = useState({
  id: "rev1",
  name: "Reviewer 1",
});

const [actionType, setActionType] = useState("");
const [dialogOpen, setDialogOpen] = useState(false);

// Reviewers list
const [reviewersList] = useState([
  { id: "rev1", name: "Reviewer 1" },
  { id: "rev2", name: "Reviewer 2" },
  { id: "rev3", name: "Reviewer 3" },
]);

 useEffect(() => {
  if (!currentReviewer?.id) return;

  const timeout = setTimeout(() => {
    setSelectedReviewer((prev) =>
      prev === currentReviewer.id ? prev : currentReviewer.id
    );
  }, 0);

  return () => clearTimeout(timeout);
}, [currentReviewer]);

const btnPrimary = {
  borderRadius: "10px",
  textTransform: "none",
  borderColor: "#2563eb",
  color: "#2563eb",
  "&:hover": {
    backgroundColor: "rgba(37,99,235,0.08)",
  },
};

const btnRounded = {
  borderRadius: "10px",
  textTransform: "none",
};

const btnPurple = {
  borderRadius: "10px",
  textTransform: "none",
  borderColor: "#9333ea",
  color: "#9333ea",
};

const btnGray = {
  borderRadius: "10px",
  textTransform: "none",
  borderColor: "#6b7280",
  color: "#6b7280",
};



  const draft = location.state?.draft;

const timeline = [
  {
    type: "Draft",
    user: "You",
    date: "25 Jun 2026, 4:01PM",
  },
  {
    type: "Submitted",
    user: "You",
    date: "25 Jun 2026, 4:02 PM",
  },

];

const formatLabel = (key) => {
  const withSpaces = key.replace(/([A-Z])/g, " $1").trim();
  if((documentStatus === STATUS.APPROVED || 
    documentStatus === STATUS.REJECTED || documentStatus === STATUS.ARCHIVED) && key === "updatedAt") return "Reviewed On";

  return withSpaces
    .split(" ")
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1) 
        : word
    )
    .join(" ");
};

const [comment, setComment] = useState("");

const [comments, setComments] = useState([
  {
    id: 1,
    user: "You",
    text: "Initial draft created.",
    time: "19 Jun 2026, 10:00 AM",
  },
  {
    id: 2,
    user: "Admin",
    text: "Please update section 2.",
    time: "20 Jun 2026, 02:30 PM",
  },
]);

const handleAddComment = () => {
  if (!comment.trim()) return;

  const newComment = {
    id: Date.now(),
    user: "You",
    text: comment,
    time: new Date().toLocaleString(),
  };

  setComments([...comments, newComment]);
  setComment("");
};

const updateDocumentStatus = async (newStatus) => {
  try {
    console.log("Updating status to:", newStatus);

    setDocumentStatus(newStatus);
  } catch (err) {
    console.error(err);
  }
};

const handleSubmitForReview = () => {
  const documentData = {
    title: draft.title,
    draftNo: draft.draftNo,
    status: "Submitted",
    reviewer: draft.reviewer,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,

    submittedAt: new Date().toISOString(),
  };

  console.log("📄 Document Submitted:");
  console.log(JSON.stringify(documentData, null, 2));
  updateDocumentStatus(STATUS.IN_REVIEW);
  navigate("/pending-reviews")

};

const handleApprove = () => {
  updateDocumentStatus(STATUS.APPROVED);
  navigate('/reviewed-documents')
};

const handleReject = () => {
  updateDocumentStatus(STATUS.REJECTED);
  navigate('/reviewed-documents')
};

const handleArchive = () => {
  updateDocumentStatus(STATUS.ARCHIVED);
  //document reload
};

const handleChangeReviewer = () => {
  setActionType("changeReviewer");
  setDialogOpen(true);
};

const handleSaveReviewer = async () => {
  try {
    const selected = reviewersList.find(
      (r) => r.id === selectedReviewer
    );

    setCurrentReviewer(selected);

    console.log("Reviewer changed to:", selected);

    setReviewerModalOpen(false);
  } catch (e) {
    console.error(e);
  }
};


  if (!draft) return <Typography>No draft data</Typography>;
  return (
      
    <Box
      sx={{
        p: 3,
      }}
    >

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
            sx={{ fontWeight: 600, mb: 1, color: "#4B5563" }}
          >
          {draft.title}
          </Typography>
      </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          
          {[{ icon: <History onClick={()=> navigate("/history")}/>, label: "View History" },
            { icon: <ReceiptLong onClick={()=> navigate("/audit-logs")}/>, label: "Audit Logs" }].map((item, i) => (
            <Box
              key={i}
              sx={{
                position: "relative",
                cursor: "pointer",
                color: "#6b7280",
                "&:hover span": { opacity: 1 },
              }}
            >
              {item.icon}

              {/* Tooltip */}
              <Box
                component="span"
                sx={{
                  position: "absolute",
                  bottom: "-26px",
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
                {item.label}
              </Box>
            </Box>
          ))}
        </Box>
      </Typography>

      <Box>

        {/* DETAILS */}
        <Typography sx={{ fontWeight: 600, mb: 2, color: "#334155" }}>
          Details
        </Typography>
        <Box
          sx={{
            border: "1px solid rgba(37,99,235,0.25)", // blue border
            borderRadius: 3,
            p: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
           
      {Object.entries(draft)
            .filter(([_, value]) => value !== null && _ !== "title" && _ !== "content") 
            .map(([key, value], i) => (
              <Box key={i}>
                
                {/* HEADING (BLUE + LARGER) */}
                <Typography
                  sx={{
                    color: "#5a75d6",
                    fontWeight: 600,
                    fontSize: 14,
                    mb: 0.5,
                  }}
                >
                  {formatLabel(key)}
                </Typography>

                <Typography
                  sx={{
                    color: "#6b7280",
                    fontSize: 13,
                  }}
                >
                  {value}
                </Typography>

              </Box>
            ))}
          </Box>
        </Box>

        <Typography sx={{ fontWeight: 600, mb: 2, color: "#334155" }}>
            Content
        </Typography>
        <Box  sx={{
            border: "1px solid rgba(37,99,235,0.25)", // blue border
            borderRadius: 3,
            p: 3,
            mb: 4,
          }}>
            {draft.content}
        </Box>

        {/* TIMELINE */}
        <Typography sx={{ fontWeight: 600, mb: 2, color: "#334155" }}>
            Timeline
        </Typography>
        <Box sx={{ mb: 4, overflowX: "scroll",  borderRadius: 2, p: 4,
          backgroundColor: "#f9fafb" }}>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "10px", 
            }}
          >
            {timeline.map((item, index) => {
              const currentColor =
                {
                  Draft: "#6b7280",
                  Submitted: "#3b82f6",
                  Assigned: "#2563eb",
                  "Re-assigned": "#8b5cf6",
                  "Delegated to Admin": "#14b8a6",
                  Approved: "#16a34a",
                  Rejected: "#ef4444",
                  Archived: "#9ca3af",
                }[item.type] || "#6b7280";

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >

                  {index !== 0 && (<>
                    <Box
                      sx={{
                        position: "relative",
                        height: "3px",
                        backgroundColor: currentColor,
                        width: 10,
                        left: -55,
                        bottom: 43
                      }}
                    />
                    <Box
                      sx={{
                        position: "relative",
                        height: "3px",
                        backgroundColor: currentColor,
                        width: 10,
                        left: -20,
                        bottom: 43
                      }}
                    />
                    <Box
                      sx={{
                        position: "relative",
                        height: "3px",
                        backgroundColor: currentColor,
                        width: 10,
                        right: -57,
                        bottom: 43
                      }}
                    />
                    <Box
                      sx={{
                        position: "relative",
                        height: "3px",
                        backgroundColor: currentColor,
                        width: 10,
                        right: -6,
                        bottom: 43
                      }}
                    /></>
                  )}

                  {/* CIRCLE */}
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        border: `3px solid ${currentColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: currentColor,
                        }}
                      />
                    </Box>

                    {/* Label */}
                    <Typography
                      sx={{
                        fontSize: 14,
                        mt: 1,
                        color: "#374151",
                        fontWeight: 600,
                        width: 150,
                        height: "auto"
                      }}
                    >
                      {item.type}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        mt: 1,
                        color: "#6b7280",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        width: 150,
                        height: "auto"
                      }}
                    >
                      {item.user}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        mt: 1,
                        color: "#5a75d6",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        width: 150,
                        height: "auto"
                      }}
                    >
                      {item.date}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
        <Box sx={{ mb: 4, display: "flex", gap: 2 }}>

  {/* CREATOR */}
  {userRole === ROLE.CREATOR &&
    documentStatus === STATUS.DRAFT && (
      <Button variant="outlined" sx={btnPrimary} onClick={handleSubmitForReview}>
        Submit for Review
      </Button>
    )}

  {/* REVIEWER  */}
  {userRole === ROLE.REVIEWER &&
    documentStatus === STATUS.IN_REVIEW && (
      <>
        <Button
          variant="contained"
          color="success"
          sx={btnRounded}
          onClick={handleApprove}
        >
          Approve
        </Button>

        <Button
          variant="outlined"
          color="error"
          sx={btnRounded}
          onClick={handleReject}
        >
          Reject
        </Button>
      </>
    )}

  {/* ADMIN */}
  {userRole === ROLE.ADMIN && 
    documentStatus === STATUS.IN_REVIEW && (
      <Button
        variant="outlined"
        sx={btnPurple}
        onClick={handleChangeReviewer}
      >
        Change Reviewer
      </Button>
    )}

  {userRole === ROLE.ADMIN &&
    documentStatus === STATUS.APPROVED && (
      <Button
        variant="outlined"
        sx={btnGray}
        onClick={handleArchive}
      >
        Archive
      </Button>
    )}

</Box>

        {/* Comments */}
        <br/><hr className="text-slate-300"/><br/><br/>
        <Box>
  <Typography sx={{ fontWeight: 600, mb: 1, color: "#334155" }}>
    Comments
  </Typography>

  <TextField
    fullWidth
    multiline
    rows={3}
    placeholder="Add comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "rgba(37,99,235,0.05)",
      },
    }}
  />

  <Box sx={{ mt: 1, textAlign: "right" }}>
    <Button
      variant="contained"
      onClick={handleAddComment}
      sx={{
        backgroundColor: "#2563eb",
        textTransform: "none",
        borderRadius: "8px",
        px: 2,
        "&:hover": {
          backgroundColor: "#1d4ed8",
        },
      }}
    >
      Add Comment
    </Button>
  </Box>

  {/* Comments List */}
  <Box sx={{ mt: 3 }}>
    {comments.map((c) => (
      <Box
        key={c.id}
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#f9fafb",
        }}
      >

        <Avatar sx={{ width: 32, height: 32 }}>
          {c.user[0]}
        </Avatar>

        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            {c.user}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 400,
              color: "#9ca3af",
              mb: 0.5,
            }}
          >
            {c.time}
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "#4b5563",
            }}
          >
            {c.text}
          </Typography>
        </Box>
      </Box>
    ))}
  </Box>
</Box>

      </Box>
      <WarningPopUp
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      action={actionType}
      selectedTitle={draft.title}
      reviewersList={reviewersList}
      selectedReviewer={selectedReviewer}
      setSelectedReviewer={setSelectedReviewer}
      onConfirm={(value) => {
        const selected = reviewersList.find((r) => r.id === value);
        setCurrentReviewer(selected);

        console.log("Reviewer changed to:", selected);

        setDialogOpen(false);
      }}
    />

    </Box>
  );
};

export default DetailsPage;