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
import { getAllDocuments, getAllOwners } from "../../api/services/documentService";

const ReviewedDocuments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

   const {withLoader} = useLoader();
  const [allDocs, setAllDocs] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage]= useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [owners, setOwners] = useState([]);

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
  if (ownerFilter) p.owner = ownerFilter;

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
  ownerFilter,
  sortField,
  sortOrder,
  page,
  rowsPerPage
]);

const fetchDocuments = useCallback(async () => {
    const response = await withLoader(() => getAllDocuments({...payload, type: "review"}, false))

    if (response.success) {
      setAllDocs(response.data.data);
      setTotalCount(response.data.count);
    } else {
      setTotalCount(0);
    }
}, [payload]);

const fetchOwners = useCallback(async () => {
    const response = await withLoader(() => getAllOwners(false))

    if (response.success) {
      setOwners(response.data.data);
    } else {
      setOwners([]);
    }
}, []);

useEffect(() => {
  fetchDocuments();
  fetchOwners();
}, [fetchDocuments, fetchOwners]);



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
         View and track documents reviewed
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
          label="Owner"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          sx={{ minWidth: 150, ...commonFieldSx }}
        >
          <MenuItem value="">All</MenuItem>
           {owners?.map((owner) => (
              <MenuItem key={owner} value={owner}>
                {owner}
              </MenuItem>
            ))}
        </TextField>

        {/* Reset */}
        <Button
          onClick={() => {
            setSearch("");
            setStatusFilter("");
            setOwnerFilter("");
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
        status="Review"
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

export default ReviewedDocuments;