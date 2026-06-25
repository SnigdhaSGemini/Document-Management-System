import {
  Box,
  TextField,
  MenuItem,
  Paper,
  Typography,
  Button
} from "@mui/material";
import { useState } from "react";
import CustomTable from "../../components/CustomTable";


const dummyData = [
  {
    title: "Policy Document",
    content: "Policy content 1",
    draftNo: "DR001",
    status: "Rejected",
    owner: "Bonn Saida",
    reviewer: "Admin",
    ownerId: "1",
    reviewerId: "10",
    currentVersion: 1,
    createdAt: "2026-06-19",
    updatedAt: "2026-06-20",
  },
  {
    title: "HR Guidelines",
    content: "HR guidelines content",
    draftNo: "DR002",
    status: "Approved",
    owner: "Sammy Dell",
    reviewer: "Manager",
    ownerId: "1",
    reviewerId: "11",
    currentVersion: 2,
    createdAt: "2026-06-18",
    updatedAt: "2026-06-21",
  },
  {
    title: "Finance Policy",
    content: "Finance policy details",
    draftNo: "DR003",
    status: "Draft",
    owner: "Bonn Saida",
    reviewer: null,
    ownerId: "1",
    reviewerId: null,
    currentVersion: 3,
    createdAt: "2026-06-17",
    updatedAt: "2026-06-20",
  },
  {
    title: "IT Security",
    content: "Security document content",
    draftNo: "DR004",
    status: "Submitted",
    owner: "Sammy Dell",
    reviewer: "Manager",
    ownerId: "1",
    reviewerId: "11",
    currentVersion: 2,
    createdAt: "2026-06-16",
    updatedAt: "2026-06-21",
  },
  {
    title: "Compliance Guide",
    content: "Compliance content",
    draftNo: "DR005",
    status: "Draft",
    owner: "Sammy Dell",
    reviewer: null,
    ownerId: "1",
    reviewerId: null,
    currentVersion: 1,
    createdAt: "2026-06-15",
    updatedAt: "2026-06-20",
  },
  {
    title: "Operations Manual",
    content: "Operations details",
    draftNo: "DR006",
    status: "Submitted",
    owner: "Bonn Saida",
    reviewer: "Admin",
    ownerId: "1",
    reviewerId: "10",
    currentVersion: 4,
    createdAt: "2026-06-14",
    updatedAt: "2026-06-21",
  },
];

const AssignedDrafts = () => {
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  let filteredData = dummyData.filter((item) => {
    return (
      (item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.draftNo.toLowerCase().includes(search.toLowerCase())) &&
      (ownerFilter ? item.owner === ownerFilter : true)
    );
  });

  if (sortField) {
    filteredData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }


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
          Review and take action on documents assigned below
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
          label="Owner"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          sx={{ minWidth: 150, ...commonFieldSx }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Bonn Saida">Bonn Saida</MenuItem>
          <MenuItem value="Sammy Dell">Sammy Dell</MenuItem>
        </TextField>

        {/* Reset */}
        <Button
          onClick={() => {
            setSearch("");
            setOwnerFilter("");
            setSortField("");
            setSortOrder("asc");
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
        data={filteredData}
        sortField={sortField}
        sortOrder={sortOrder}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        status="Assigned"
      />
    </Paper>
  );
};

export default AssignedDrafts;