import { Box, Typography, useTheme, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { invoices, loading } = useDashboardData();

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
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
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color="hsl(var(--primary))" fontWeight="bold">
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
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
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
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
        }}
      >
        <DataGrid checkboxSelection rows={invoices} columns={columns} />
      </Box>
    </Box>
  );
};

export default Invoices;