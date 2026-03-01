import { Box, Typography, useTheme, Avatar, Chip, IconButton, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";
import { ShieldCheck, ShieldAlert, User, MoreVertical, Settings2, Mail } from "lucide-react";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { team, loading } = useDashboardData();

  const columns = [
    { 
      field: "name", 
      headerName: "Member", 
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
      field: "age", 
      headerName: "Age", 
      type: "number", 
      headerAlign: "left", 
      align: "left",
      renderCell: (params) => <Typography variant="body2" fontWeight="bold">{params.value}</Typography>
    },
    { 
      field: "phone", 
      headerName: "Direct Phone", 
      flex: 1,
      renderCell: (params) => <Typography variant="body2">{params.value}</Typography>
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row: { access } }) => {
        const isAdmin = access === "admin";
        const isManager = access === "manager";
        return (
          <Box
            sx={{
              p: "6px 14px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: isAdmin ? "hsla(var(--primary) / 0.1)" : isManager ? "hsla(25 95% 53% / 0.1)" : "hsla(var(--primary) / 0.05)",
              color: isAdmin ? "hsl(var(--primary))" : isManager ? "hsl(25 95% 53%)" : "inherit",
            }}
          >
            {isAdmin ? <ShieldCheck size={14} /> : isManager ? <ShieldAlert size={14} /> : <User size={14} />}
            <Typography variant="body2" fontWeight="bold" sx={{ textTransform: "capitalize" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: () => (
        <Box display="flex" gap={1}>
          <IconButton size="small"><Mail size={18} /></IconButton>
          <IconButton size="small"><Settings2 size={18} /></IconButton>
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
      <Header title="COMMAND TEAM" subtitle="Manage your organization's high-performance squad" />
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
        <DataGrid checkboxSelection rows={team} columns={columns} disableSelectionOnClick />
      </Box>
    </Box>
  );
};

export default Team;
