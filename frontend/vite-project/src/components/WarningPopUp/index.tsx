import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";

const WarningPopUp = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Document",
  message = "Are you sure you want to delete this document?",
  action = "changeReviewer", // delete | approve | reject | changeReviewer
  selectedTitle = "",
  reviewersList = [],
  selectedReviewer = "",
  setSelectedReviewer = () => {}
}) => {
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setRemarks("");
      setError("");
    }
  }, [open]);

  // Handle confirm click
  const handleSubmit = () => {
  if ((action === "approve" || action === "reject") && !remarks.trim()) {
    setError("Remarks are required");
    return;
  }

  if (action === "changeReviewer" && !selectedReviewer) {
    setError("Please select a reviewer");
    return;
  }

  const payload =
    action === "approve"
      ? `Approval remarks: ${remarks}`
      : action === "reject"
      ? `Rejection remarks: ${remarks}`
      : action === "changeReviewer"
      ? selectedReviewer
      : null;

  onConfirm(payload);
};

  const isApprovalFlow = action === "approve" || action === "reject";
  const isReviewerChange = action === "changeReviewer";

  const dynamicTitle =
  action === "approve"
    ? "Approve Document"
    : action === "reject"
    ? "Reject Document"
    : action === "changeReviewer"
    ? "Assign/ Re-assign Reviewer"
    : action === "archive" 
    ? "Archive Document"
    : "Delete Document";

  const dynamicMessage =
  action === "approve"
    ? `You are approving document with title : "${selectedTitle}"`
    : action === "reject"
    ? `You are rejecting document with title : "${selectedTitle}"`
    : action === "changeReviewer"
    ? `Select a new reviewer for document "${selectedTitle}"`
    : `Are you sure you want to ${action} document with title : "${selectedTitle}"?`;

  const buttonLabel =
  action === "approve"
    ? "Approve"
    : action === "reject"
    ? "Reject"
    : action === "changeReviewer"
    ? "Save"
    : action=== "archive"
    ? "Archive"
    : "Delete";

  const buttonColor =
  action === "approve"
    ? "#16a34a"
    : action === "reject"
    ? "#ef4444"
    : action === "changeReviewer"
    ? "purple"
    : action === "archive"
    ? "grey"
    : "#ef4444";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          color: "#4B5563",
        }}
      >
        {dynamicTitle}

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent>
        <Typography sx={{ color: "#6b7280", fontSize: 14, mb: 2 }}>
          {dynamicMessage}
        </Typography>

        {/* Remarks section ONLY for approve/reject */}
        {isApprovalFlow && (
          <>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: "#4B5563",
                mb: 1,
              }}
            >
              {action === "approve"
                ? "Approval Remarks"
                : "Rejection Remarks"}
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              placeholder="Enter your remarks..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(37,99,235,0.05)",
                },
              }}
            />
          </>
        )}

        {isReviewerChange && (
          <TextField
            select
            fullWidth
            label="Reviewer"
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "rgba(37,99,235,0.05)",
              },
            }}
          >
            {reviewersList.map((r) => (
              <MenuItem key={r.id} value={r.id}>
                {r.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: buttonColor,
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          {buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningPopUp;