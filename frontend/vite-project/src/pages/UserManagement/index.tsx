import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Modal,
  Typography,
  IconButton,
  Switch, FormControlLabel
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useFormik } from "formik";
import { TablePagination } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLoader } from "../../context/loaderContext";
import { createUsers, deleteUser, getAllUsers, updateUser } from "../../api/services/userService";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { withLoader, startLoading, stopLoading } = useLoader();


  const commonFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "rgba(37,99,235,0.05)",
      "& fieldset": { borderColor: "#d1d5db" },
      "&:hover fieldset": { borderColor: "#9ca3af" },
      "&.Mui-focused fieldset": { borderColor: "#2563eb" },
    },
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", role: "", isActive: true },
   onSubmit: async (values) => {
      try {
        if (isEditMode) {
          const response = await withLoader(() =>
            updateUser(
              {
                id: selectedUser._id,
                apiData: {
                  name: values.name,
                  email: values.email,
                  role: values.role,
                  isActive: values.isActive,
                },
              },
              true
            )
          );

          if (response.success) {
            await fetchUsers();

            formik.resetForm({
              values: {
                name: "",
                email: "",
                role: "",
                isActive: true,
              },
            });
            setOpen(false);
            setSelectedUser(null);
            setIsEditMode(false);
          }

          return;
        } else {
          const response = await withLoader(() =>
            createUsers(
              {
                name: values.name,
                email: values.email,
                role: values.role.toLowerCase(),
              },
              true
            )
          );

          if (response.success) {
            await fetchUsers();

            formik.resetForm();
            setOpen(false);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    });

    const deletesUser = async () => {
      startLoading();
      const res = await deleteUser(selectedUser._id, true);

      if(res.success){
        await fetchUsers();
        formik.resetForm();
        setOpen(false);
        setSelectedUser(null);
        setIsEditMode(false);
      }
      stopLoading();
    };

  // Reset modal form when closed
  const handleCloseModal = () => {
    formik.resetForm();
    setIsEditMode(false);
    setSelectedUser(null);
    setOpen(false);
  };

  const payload = useMemo(() => {
    const p = {
      page: page + 1,
      limit: rowsPerPage
    };

    if (search) p.search = search;

    if (roleFilter) {
      p.role = roleFilter;
    }

    if (statusFilter) {
      p.isActive = statusFilter === "true";
    }

    return p;
  }, [
    page,
    rowsPerPage,
    search,
    roleFilter,
    statusFilter,
  ]);


  const fetchUsers = useCallback(async () => {
    const response = await withLoader(() => getAllUsers(payload, false));

    if (response.success) {
      setUsers(response.data.data);
      setTotalCount(response.data.count);
    } else {
      setUsers([]);
      setTotalCount(0);
    }
  }, [payload, withLoader]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Manage users and control access roles within the system
        </Typography>
      </Box>

      {/* Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap", lg: "nowrap" },
            gap: 2,
            mb: 3,
          }}
        >
          {/* Search */}
          <TextField
            fullWidth
            label="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={commonFieldSx}
          />

          {/* Role Filter */}
          <TextField
            select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 150, ...commonFieldSx }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="reviewer">Reviewer</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>

          {/* Status Filter */}
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150, ...commonFieldSx }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>

          {/* Reset Button */}
          <Button
            onClick={() => {
              setSearch("");
              setRoleFilter("");
              setStatusFilter("");
              setPage(0);
            }}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              px: 3,
              borderColor: "#2563eb",
              color: "#2563eb",
              border: "1px solid #2563eb",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "#1d4ed8",
                backgroundColor: "rgba(37,99,235,0.08)",
              },
            }}
          >
            Reset
          </Button>
        </Box>

      {/* Add User Button  */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          onClick={() => {setOpen(true); setIsEditMode(false);formik.resetForm()}}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            backgroundColor: "#2563eb",
            color: "#fff",
            "&:hover": { backgroundColor: "#1d4ed8" },
          }}
        >
          + Add User
        </Button>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          overflowY: "hidden",
          boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          {/* Header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#6B7280" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                User
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Role
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: "rgba(37,99,235,0.03)",
                }}
              >
                {/* User */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.name[0]}
                    </Avatar>
                    {user.name}
                  </Box>
                </TableCell>

                {/* Email */}
                <TableCell sx={{ color: "#2563eb", fontSize: 13 }}>
                  {user.email}
                </TableCell>

                {/* Role */}
                <TableCell sx={{ fontSize: 13, color: "#6b7280" }}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={user.isActive ? "Active" : "In-active"}
                    size="small"
                    sx={{
                      backgroundColor:
                        user.isActive
                          ? "rgba(22,163,74,0.1)"
                          : "rgba(107,114,128,0.1)",
                      color:
                        user.isActive
                          ? "#16a34a"
                          : "#6b7280",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                {/* Actions  */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {/* Edit */}
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      mx: 0.5,
                      "&:hover .tooltip": { opacity: 1 },
                    }}
                  >
                    <IconButton
                      sx={{ color: "#2563eb" }}
                      onClick={() => {
                        setIsEditMode(true);
                        setSelectedUser(user);

                        formik.setValues({
                          name: user.name,
                          email: user.email,
                          role: user.role,
                          isActive: user.isActive,
                        });

                        setOpen(true);
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
                </TableCell>
              </TableRow>
            ))}

            {/* Empty State */}
            {totalCount === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
        sx={{
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontSize: "13px",
            color: "#6b7280",
          },
        }}
      />

      {/* Modal */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "white",
            p: 3,
            borderRadius: 3,
            boxShadow: 24,
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 2, color: "#4B5563" }}>
            {isEditMode ? "Edit User" : "Add New User"}
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              sx={{ mb: 2, ...commonFieldSx }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              sx={{ mb: 2, ...commonFieldSx }}
            />

            <FormControl fullWidth sx={{ mb: 2, ...commonFieldSx }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="reviewer">Reviewer</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            {isEditMode && (
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.isActive}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "isActive",
                      e.target.checked
                    )
                  }
                />
              }
              label={
                formik.values.isActive
                  ? "Active"
                  : "Inactive"
              }
            />)}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#2563eb",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
            >
              {isEditMode ? "Update" : "Add User"}
            </Button>
            {isEditMode && (
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 1,
                borderColor: "#ef4444",
                color: "#ef4444",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#dc2626",
                  backgroundColor: "rgba(239,68,68,0.08)",
                },
              }}
              onClick={deletesUser}
            >
              Delete User
            </Button>
          )}
          </form>
        </Box>
      </Modal>
    </Paper>
  );
};

export default UserManagement;