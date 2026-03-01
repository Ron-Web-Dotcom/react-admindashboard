import { Box, Skeleton, Typography, useTheme, Avatar, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";
import { Mail, Phone, MapPin, Building2, MoreVertical, Eye } from "lucide-react";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { contacts, loading } = useDashboardData();

  const columns = [
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1,
      renderCell: ({ row: { name, email } }) => (
        <Box display="flex" alignItems="center" gap={2} py={1}>
          <Avatar sx={{ bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))", fontWeight: "bold" }}>
            {name.charAt(0)}
          </Avatar>
          <Box display="flex" flexDirection="column">
            <Typography fontWeight="bold">{name}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>{email}</Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: "phone", 
      headerName: "Phone", 
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Phone size={14} style={{ opacity: 0.5 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: "address", 
      headerName: "Location", 
      flex: 1.5,
      renderCell: ({ row: { address, city, zipCode } }) => (
        <Box display="flex" alignItems="center" gap={1}>
          <MapPin size={14} style={{ opacity: 0.5 }} />
          <Typography variant="body2">{address}, {city} {zipCode}</Typography>
        </Box>
      )
    },
    { 
      field: "registrarId", 
      headerName: "Registrar ID", 
      flex: 0.8,
      renderCell: (params) => (
        <Box sx={{ p: "4px 12px", borderRadius: "8px", bgcolor: "hsla(var(--primary) / 0.05)", border: "1px solid hsla(var(--primary) / 0.1)" }}>
          <Typography variant="caption" fontWeight="bold" sx={{ color: "hsl(var(--primary))" }}>{params.value}</Typography>
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: () => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Detail"><IconButton size="small"><Eye size={18} /></IconButton></Tooltip>
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
      <Header
        title="CRM CONTACTS"
        subtitle="Intelligent directory of your customer ecosystem"
      />
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
          "& .MuiButton-text": { color: "hsl(var(--primary)) !important", fontWeight: "bold" },
        }}
      >
        <DataGrid
          rows={contacts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Contacts;
