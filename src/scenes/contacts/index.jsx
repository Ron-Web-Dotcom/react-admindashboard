import { Box, Skeleton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useDashboardData } from "../../hooks/useDashboardData";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { contacts, loading } = useDashboardData();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
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
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      flex: 1,
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
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
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
          "& .name-column--cell": {
            color: "hsl(var(--primary))",
            fontWeight: "bold"
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
          rows={contacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;