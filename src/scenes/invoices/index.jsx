import { Box, Typography, useTheme, Chip, Skeleton, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";
import { DollarSign, Calendar, MoreVertical, Download, CheckCircle2, Clock } from "lucide-react";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { invoices, loading } = useDashboardData();

  const columns = [
    { 
      field: "id", 
      headerName: "Invoice ID", 
      flex: 0.5,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" sx={{ color: "hsl(var(--primary))" }}>#{params.value.split('_')[1] || params.value}</Typography>
      )
    },
    {
      field: "name",
      headerName: "Customer",
      flex: 1,
      renderCell: ({ row: { name, email } }) => (
        <Box display="flex" flexDirection="column" py={1}>
          <Typography fontWeight="bold">{name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>{email}</Typography>
        </Box>
      ),
    },
    {
      field: "cost",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <DollarSign size={16} color="hsl(var(--primary))" strokeWidth={3} />
          <Typography variant="h5" fontWeight="bold" color="hsl(var(--primary))">
            {params.value.toLocaleString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: "date",
      headerName: "Due Date",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Calendar size={14} style={{ opacity: 0.5 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: () => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: "6px 14px", borderRadius: "10px", bgcolor: "hsla(142 76% 36% / 0.1)", color: "hsl(142 76% 36%)" }}>
          <CheckCircle2 size={14} />
          <Typography variant="body2" fontWeight="bold">Paid</Typography>
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: () => (
        <Box display="flex" gap={1}>
          <IconButton size="small"><Download size={18} /></IconButton>
          <IconButton size="small"><MoreVertical size={18} /></IconButton>
        </Box>
      )
    }
  ];

  if (loading) {
    return (
      <Box m="32px">
        <Skeleton variant="text" width="200px" height={60} />
        <Skeleton variant="text" width="300px" height={30} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height="70vh" sx={{ borderRadius: "2rem" }} />
      </Box>
    );
  }

  return (
    <Box m="32px">
      <Header title="FINANCE" subtitle="Monitor your revenue flow and invoice settlements" />
      <Box
        mt="40px"
        height="75vh"
        className="glass-card"
        p="24px"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: `1px solid hsla(var(--primary) / 0.05)` },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: "hsla(var(--primary) / 0.05)", borderBottom: "none", borderRadius: "12px" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: "transparent" },
          "& .MuiDataGrid-footerContainer": { borderTop: "none" },
          "& .MuiCheckbox-root": { color: `hsl(var(--primary)) !important` },
        }}
      >
        <DataGrid checkboxSelection rows={invoices} columns={columns} disableSelectionOnClick />
      </Box>
    </Box>
  );
};

export default Invoices;
