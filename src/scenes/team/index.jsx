import { Box, Typography, useTheme, CircularProgress, Skeleton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { ShieldCheck, LockOpen, ShieldAlert } from "lucide-react";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { team, loading } = useDashboardData();
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Typography fontWeight="bold" color="hsl(var(--primary))">
          {params.value}
        </Typography>
      )
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="120px"
            p="6px 12px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="8px"
            backgroundColor={
              access === "admin"
                ? "rgba(13, 148, 136, 0.1)"
                : "rgba(59, 130, 246, 0.1)"
            }
            border={`1px solid ${access === "admin" ? "rgba(13, 148, 136, 0.2)" : "rgba(59, 130, 246, 0.2)"}`}
            borderRadius="10px"
            sx={{ color: access === "admin" ? "hsl(var(--primary))" : "#3b82f6" }}
          >
            {access === "admin" && <ShieldCheck size={16} />}
            {access === "manager" && <ShieldAlert size={16} />}
            {access === "user" && <LockOpen size={16} />}
            <Typography variant="body2" fontWeight="bold" sx={{ textTransform: "capitalize" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Box m="20px">
        <Skeleton variant="text" width="200px" height={60} />
        <Skeleton variant="text" width="300px" height={30} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height="70vh" sx={{ borderRadius: "2rem" }} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Enterprise team permissions" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid hsla(var(--primary) / 0.05)`,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "hsla(var(--primary) / 0.05)",
            borderBottom: "none",
            borderRadius: "1rem 1rem 0 0"
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "hsla(var(--primary) / 0.05)",
            borderRadius: "0 0 1rem 1rem"
          },
          "& .MuiCheckbox-root": {
            color: `hsl(var(--primary)) !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid 
          checkboxSelection 
          rows={team} 
          columns={columns} 
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Team;