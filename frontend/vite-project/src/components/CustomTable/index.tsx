import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  Chip,
  TableContainer,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import WarningPopUp from "../../components/WarningPopUp";
import { FaRegCircleCheck } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";
import { LuUserRoundPen } from "react-icons/lu";
import { IoArchiveOutline } from "react-icons/io5";
import dayjs from "dayjs";
import { addComment, changeReviewers, deleteDocument, submitDocument, updateDocument } from "../../api/services/documentService";
import { useLoader } from "../../context/loaderContext";
import { getAllReviewers } from "../../api/services/userService";

const CustomTable = ({
  data,
  totalCount,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  status = null,
  page, 
  setPage,
  rowsPerPage, setRowsPerPage,
  fetchDocuments,
}) => {

  const navigate = useNavigate();
  const {startLoading, stopLoading, withLoader} = useLoader();
  const role = localStorage.getItem("role");

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    title: "",
    content: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userRole] = useState(role); 
  const [actionType, setActionType] = useState(""); // "delete" | "approve" | "reject" | changeReviewer
  const [reviewersList, setReviewersList] = useState([]);

const [selectedReviewer, setSelectedReviewer] = useState("");

  useEffect(() => {
    setPage(0);
  }, [totalCount, rowsPerPage]);


  const displayValue = (value) => {
      return value === null || value === undefined || value === ""
        ? "-"
        : value;
    };


  const handleEditClick = (row) => {
    setEditData({
      id: row._id,
      title: row.title,
      content: row.content || "",
    });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    console.log("Updated Data:", editData);
    startLoading();
    const res =  await updateDocument(editData, false);
    if(res.success) {
      await fetchDocuments();
      setOpenEdit(false);
    }
    stopLoading();
  };

  const deletesDocument = useCallback(async (id) => {
    const response = await withLoader(async () => await deleteDocument(id, false));

    if (response.data.success) {
      await withLoader(async () => await fetchDocuments());
      console.log("Document deleted successfully");
  }}, []);

  const handleSort = (field, e) => {
    e.stopPropagation();

    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field)
      return <ArrowDownward fontSize="small" sx={{ color: "#9ca3af" }} />;

    return sortOrder === "asc" ? (
      <ArrowUpward fontSize="small" sx={{ color: "#2563eb" }} />
    ) : (
      <ArrowDownward fontSize="small" sx={{ color: "#2563eb" }} />
    );
  };

  const handleChangeReviewerClick = (row) => {
    setSelectedRow(row);
    setActionType("changeReviewer");

    // Pre-select current reviewer
    const reviewer = reviewersList.find(
      (r) => r.name === row.reviewer
    );

    setSelectedReviewer(reviewer?.id || "");

    setOpenDialog(true);
  };

  // Status chip styling
const getStatusChip = (status) => {
  const statusColors = {
    Draft: {
      color: "#2563eb",
      bg: "rgba(37,99,235,0.1)",
    },
    Submitted: {
      color: "#ca8a04",             
      bg: "rgba(250,204,21,0.15)",  
    },
    Approved: {
      color: "#15803d",
      bg: "rgba(21,128,61,0.1)",
    },
    Rejected: {
      color: "#dc2626",
      bg: "rgba(220,38,38,0.1)",
    },
    Archived: {
      color: "#6b7280",
      bg: "rgba(107,114,128,0.1)",
    },
  };


  const current = statusColors[status] || statusColors["Draft"];


  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: current.bg,
        color: current.color,
        fontWeight: 500,
      }}
    />
  );
};
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setActionType("delete");
    setOpenDialog(true);
  };

  const handleArchiveClick = (row) => {
    setSelectedRow(row);
    setActionType("archive");
    setOpenDialog(true);
  };

   const handleApproveClick = (row) => {
    setSelectedRow(row);
    setActionType("approve");
    setOpenDialog(true);
  };

  const handleRejectClick = (row) => {
    setSelectedRow(row);
    setActionType("reject");
    setOpenDialog(true);
  };

  const getAllReviewer = useCallback(async () => {
    const response = await withLoader(async () => await getAllReviewers(false));

    if (response.data.success) {
      console.log("All reviewers fetched successfully");
      setReviewersList(response.data.data);
  }}, []);

    const changeReviewer = useCallback(async (data) => {
    const response = await withLoader(async () => await changeReviewers(data, false));

    if (response.data.success) {
      console.log("Reviewer changed successfully");
      if(status === "AllDocuments") navigate("/dashboard"); else navigate("/my-drafts");
  }}, []);

   const handleSubmit = useCallback(async (status, id) => {
    const res = await withLoader(async () => await submitDocument({id, status}, false));

    if(res.data.success){
      console.log("Document reviewed / archived successfully");
    }
  
  },[]);
  

  useEffect(()=>{ getAllReviewer()},[getAllReviewer]);

  const formatDate = (date, format = "DD MMM YYYY, hh:mm A") => {
    if (!date) return "-";
    return dayjs(date).format(format);
  };
  return (
    <>
      
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflowX: "auto",         
          overflowY: "hidden",
          boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
        }}
      >

        <Table >

          {/* Table Header */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#6B7280"
              }}
            >
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Title
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Draft No.
              </TableCell>
              {(!status || status === "Reviewed" || status === "Review" || status === "AllDocuments")  && (
                <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                    Status
                </TableCell>
                )}

              {userRole !== "user" && (<TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Owner
              </TableCell>)}
              
              {userRole !== "reviewer" && (<TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Reviewer
              </TableCell>)}


              {(!status || status !== "Reviewed") && (
                <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Created At
                <IconButton
                  size="small"
                  onClick={(e) => handleSort("createdAt", e)}
                  sx={{ color: "#fff" }}
                >
                  {renderSortIcon("createdAt")}
                </IconButton>
              </TableCell>
              )}

              {status !== "AllDocuments" && (<TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                {(status && (status === "Reviewed" || status === "Review")) ? "Reviewed On" : "Last Updated"}
                <IconButton
                  size="small"
                  onClick={(e) => handleSort("updatedAt", e)}
                  sx={{ color: "#fff" }}
                >
                  {renderSortIcon("updatedAt")}
                </IconButton>
              </TableCell>)}

              {(!status || (status !== "Submitted" && status !== "Review")) && (
                <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                    Actions
                </TableCell>
                )}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {(data || []).map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  cursor: "pointer",
                  backgroundColor: "rgba(37,99,235,0.03)", // input bg

                  "&:hover": {
                    backgroundColor: "rgba(37,99,235,0.1)", // hover polish
                  },
                }}
                
                onClick={() =>
                  navigate("/draft-details", { state: { draft: row } })
                }

              >
                <TableCell>{displayValue(row.title)}</TableCell>
                <TableCell>{displayValue(row.draftNo)}</TableCell>
                {(!status || status === "Reviewed" || status === "Review" ||  status === "AllDocuments") && (
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    )}
                {userRole !== "user" && (<TableCell>{row.owner}</TableCell>)}
                {userRole !== "reviewer" && (<TableCell>{displayValue(row.reviewer)}</TableCell>)}
                {(!status || status !== "Reviewed") && (<TableCell>{formatDate(row.createdAt)}</TableCell>)}
                {status !== "AllDocuments" && (<TableCell>{formatDate(row.updatedAt)}</TableCell>)}

                {(!status || (status !== "Submitted" && status !== "Review")) && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
  
                  {(status === "Assigned" && row.status === "submitted") ? (<>
                  {/* Approve */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": {
                        opacity: 1,
                      },
                    }}
                  >
                   <IconButton
                      sx={{ color: "green" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveClick(row);
                      }}
                    >
                      <FaRegCircleCheck/>
                    </IconButton>

                    {/* Tooltip */}
                    <Box
                      className="tooltip"
                      sx={{
                        position: "absolute",
                        bottom: "-24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B7280",
                        color: "#fff",
                        fontSize: "12px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      Approve
                    </Box>
                  </Box>

                  {/* Reject */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": {
                        opacity: 1,
                      },
                    }}
                  >
                    <IconButton sx={{ color: "#ef4444" }}
                     onClick={() => handleRejectClick(row)}>
                      <RxCrossCircled />
                    </IconButton>

                    {/* Tooltip */}
                    <Box
                      className="tooltip"
                      sx={{
                        position: "absolute",
                        bottom: "-24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B7280",
                        color: "#fff",
                        fontSize: "12px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      Reject
                    </Box>
                  </Box>
                  </>) : (status === "AllDocuments") ? (row.status === "submitted") ? (<>
                  {/* Assign / Re-assign Reviewer */}
                   <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": {
                        opacity: 1,
                      },
                    }}
                  >
                   <IconButton
                      sx={{ color: "purple" }}
                      onClick={(e) => {
                          e.stopPropagation();
                          handleChangeReviewerClick(row);
                        }}
                    >
                      <LuUserRoundPen/>
                    </IconButton>

                    {/* Tooltip */}
                    <Box
                      className="tooltip"
                      sx={{
                        position: "absolute",
                        bottom: "-24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B7280",
                        color: "#fff",
                        fontSize: "12px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      Assign/ Re-assign Reviewer
                    </Box>
                  </Box></>): (row.status === "approved") ? (<> 
                  {/* Archive */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": {
                        opacity: 1,
                      },
                    }}
                  >
                   <IconButton
                      sx={{ color: "#6b7280" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveClick(row);
                      }}
                    >
                      <IoArchiveOutline/>
                    </IconButton>

                    {/* Tooltip */}
                    <Box
                      className="tooltip"
                      sx={{
                        position: "absolute",
                        bottom: "-24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B7280",
                        color: "#fff",
                        fontSize: "12px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      Archive
                    </Box>
                  </Box></>) : <p className="text-gray-500 italic"> No Actions</p> : (row.status === "draft" || row.status === "rejected") ? (<>
                  {/* Edit */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": {
                        opacity: 1,
                      },
                    }}
                  >
                   <IconButton
                      sx={{ color: "#2563eb" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(row);
                      }}
                    >
                      <Edit />
                    </IconButton>

                    {/* Tooltip */}
                    <Box
                      className="tooltip"
                      sx={{
                        position: "absolute",
                        bottom: "-24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B7280",
                        color: "#fff",
                        fontSize: "12px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      Edit
                    </Box>
                  </Box>

                  {/* Delete */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": {
                        opacity: 1,
                      },
                    }}
                  >
                    <IconButton sx={{ color: "#ef4444" }}
                     onClick={() => handleDeleteClick(row)}>
                      <Delete />
                    </IconButton>

                    {/* Tooltip */}
                    <Box
                      className="tooltip"
                      sx={{
                        position: "absolute",
                        bottom: "-24px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#6B7280",
                        color: "#fff",
                        fontSize: "12px",
                        px: 1,
                        py: 0.5,
                        borderRadius: "6px",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                      }}
                    >
                      Delete
                    </Box>
                  </Box>
                  </>): (<p className="text-gray-500 italic"> No Actions</p>)}
                    </TableCell>
                    )}
              </TableRow>
            ))}

            {/* Empty state */}
            {(data || []).length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No drafts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          const newSize = parseInt(e.target.value, 10);
          setRowsPerPage(newSize);
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="sm"
        fullWidth
      >
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
          Edit Document

          {/* Close Button */}
          <IconButton onClick={() => setOpenEdit(false)}>
            ✕
          </IconButton>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          {/* Title Input */}
          <Box sx={{ mb: 2, mt:2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  backgroundColor: "rgba(37,99,235,0.05)",
                },
              }}
            />
          </Box>

          {/* Content Textarea */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Content"
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "rgba(37,99,235,0.05)",
              },
            }}
          />
        </DialogContent>

        {/* Footer */}
        <DialogActions sx={{ pb: 2, pr: 3 }}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#2563eb",
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
     <WarningPopUp
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={(comment) => {
            console.log("comment is set as :: ", comment);
            setOpenDialog(false);
        }}
        action={actionType}                 // "delete" | "approve" | "reject" | "changeReviewer"
        selectedTitle={selectedRow?.title}
        reviewersList={reviewersList}
        selectedReviewer={selectedReviewer}
        setSelectedReviewer={setSelectedReviewer}
        rowData={selectedRow}
        apiAction={actionType === "changeReviewer" ? changeReviewer : actionType === "delete" ? deletesDocument : handleSubmit}
        />

    </>
  );
};

export default CustomTable;