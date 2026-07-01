import {
  Box,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Button
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CustomTable from "../../components/CustomTable";
import { useLoader } from "../../context/loaderContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux";
import { getAllDocuments } from "../../api/services/documentService";
import { getAllReviewers } from "../../api/services/userService";

const ReviewOutcomes = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reviewerFilter, setReviewerFilter] = useState("");

   const {withLoader} = useLoader();
  const [allDocs, setAllDocs] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage]= useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [reviewers, setReviewers] = useState([]);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { startDate, endDate } = useSelector(
    (state: RootState) => state.dateRange
  );

  
const payload = useMemo(() => {
  const p: any = {
    page: page + 1,
    limit: rowsPerPage
  };

  if (startDate) p.startDate = startDate;
  if (endDate) p.endDate = endDate;
  if (search) p.search = search;
  if (statusFilter) p.status = statusFilter;
  if (reviewerFilter) p.reviewer = reviewerFilter;

  if (sortField && sortOrder) {
    p.sortField = sortField;
    p.sortOrder = sortOrder;
  }

  return p;
}, [
  startDate,
  endDate,
  search,
  statusFilter,
  reviewerFilter,
  sortField,
  sortOrder,
  page,
  rowsPerPage
]);

const fetchDocuments = useCallback(async () => {
    const response = await withLoader(() => getAllDocuments({...payload, type: "reviewed"}, false))

    if (response.success) {
      setAllDocs(response.data.data);
      setTotalCount(response.data.count);
    } else {
      setTotalCount(0);
    }
}, [payload]);

const fetchReviewers = useCallback(async () => {
    const response = await withLoader(() => getAllReviewers(false))

    if (response.success) {
      setReviewers(response.data.data);
    } else {
      setReviewers([]);
    }
}, []);

useEffect(() => {
  fetchDocuments();
  fetchReviewers();
}, [fetchDocuments, fetchReviewers]);


  const commonFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "rgba(37,99,235,0.05)",

      "& fieldset": {
        borderColor: "#d1d5db",
      },

      "&:hover fieldset": {
        borderColor: "#9ca3af",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#2563eb",
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 3,
        width: "100%",
        borderRadius: 3,
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>

        <Typography
          variant="body2"
          sx={{ color: "#6b7280" }}
        >
          Track the final review results of your submissions and update or delete rejected documents
        </Typography>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: {xs: "wrap", sm:"wrap", md: "nowrap", lg: "nowrap"}, gap: 2, mb: 3 }}>

        <TextField
          fullWidth
          label="Search by Title / Draft No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={commonFieldSx}
        />

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150, ...commonFieldSx }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="archived">Archived</MenuItem>
        </TextField>

        <TextField
          select
          label="Reviewer"
          value={reviewerFilter}
          onChange={(e) => setReviewerFilter(e.target.value)}
          sx={{ minWidth: 150, ...commonFieldSx }}
        >
          <MenuItem value="">All</MenuItem>
            {reviewers?.map((reviewer) => (
              <MenuItem key={reviewer._id} value={reviewer.name}>
                {reviewer.name}
              </MenuItem>
            ))}
        </TextField>

        {/* Reset */}
        <Button
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setReviewerFilter("");
            setSortField("");
            setSortOrder("asc");
            setPage(0);
          }}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            px: 3,
            borderColor: "#2563eb",
            color: "#2563eb",
            border: "1px solid #2563eb",

            "&:hover": {
              borderColor: "#1d4ed8",
              backgroundColor: "rgba(37,99,235,0.08)",
            },
          }}
        >
          Reset
        </Button>
      </Box>

      {/* Table */}
      <CustomTable
        status="Reviewed"
        data={allDocs}
        totalCount={totalCount} 
        sortField={sortField}
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        fetchDocuments={fetchDocuments}
      />
    </Paper>
  );
};

export default ReviewOutcomes;