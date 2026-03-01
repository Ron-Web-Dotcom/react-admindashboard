import { Box, Typography, useTheme, Button, IconButton, Chip, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";
import { 
  Sparkles, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2,
  TrendingUp,
  UserCheck,
  UserMinus
} from "lucide-react";
import { useState } from "react";
import { blink } from "../../lib/blink";
import { toast } from "react-hot-toast";

const Leads = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { leads, organization, loading, refresh } = useDashboardData();
  const [isScoring, setIsScoring] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", company: "", phone: "", source: "Website" });

  const handleScoreLead = async (leadId) => {
    setIsScoring(prev => ({ ...prev, [leadId]: true }));
    try {
      const lead = leads.find(l => l.id === leadId);
      
      const { object } = await blink.ai.generateObject({
        prompt: `Analyze this CRM lead and provide a predictive conversion score (0-100) and a brief reason based on their profile: ${JSON.stringify(lead)}`,
        schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            reason: { type: "string" }
          },
          required: ["score", "reason"]
        }
      });

      await blink.db.leads.update(leadId, { 
        score: object.score,
        source: object.reason // Using source as a temporary place for AI reason for demo
      });
      
      toast.success(`AI Scored ${lead.name}: ${object.score}/100`);
      refresh();
    } catch (error) {
      console.error("Scoring failed:", error);
      toast.error("AI Analysis failed");
    } finally {
      setIsScoring(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) return;
    try {
      await blink.db.leads.create({
        ...newLead,
        organizationId: organization.id,
        status: "New",
        score: 0
      });
      toast.success("Lead added successfully!");
      setOpenAdd(false);
      refresh();
    } catch (error) {
      toast.error("Failed to add lead");
    }
  };

  const columns = [
    { 
      field: "name", 
      headerName: "Lead Name", 
      flex: 1,
      renderCell: ({ row: { name, email } }) => (
        <Box display="flex" flexDirection="column">
          <Typography fontWeight="bold" color={theme.palette.text.primary}>{name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>{email}</Typography>
        </Box>
      )
    },
    { 
      field: "company", 
      headerName: "Company", 
      flex: 1,
      renderCell: ({ row: { company } }) => (
        <Box display="flex" alignItems="center" gap="8px">
          <Building2 size={16} color="hsl(var(--primary))" />
          <Typography>{company || "N/A"}</Typography>
        </Box>
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 150,
      renderCell: ({ row: { status } }) => {
        const color = status === "New" ? "info" : status === "Qualified" ? "success" : "warning";
        return <Chip label={status} color={color} size="small" variant="outlined" sx={{ borderRadius: "8px" }} />;
      }
    },
    { 
      field: "score", 
      headerName: "AI Score", 
      width: 150,
      renderCell: ({ row: { id, score, source } }) => (
        <Box display="flex" alignItems="center" gap="12px" width="100%">
          {score > 0 ? (
            <Tooltip title={source}>
              <Box 
                sx={{ 
                  p: "4px 12px", 
                  borderRadius: "8px", 
                  bgcolor: score > 70 ? "hsla(142 76% 36% / 0.1)" : "hsla(var(--primary) / 0.1)",
                  color: score > 70 ? "hsl(142 76% 36%)" : "hsl(var(--primary))",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <TrendingUp size={14} />
                {score}
              </Box>
            </Tooltip>
          ) : (
            <Button
              size="small"
              startIcon={<Sparkles size={14} />}
              onClick={() => handleScoreLead(id)}
              disabled={isScoring[id]}
              sx={{ color: "hsl(var(--primary))", textTransform: "none", fontWeight: "bold" }}
            >
              {isScoring[id] ? "Analyzing..." : "Score"}
            </Button>
          )}
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: () => (
        <Box display="flex" gap="8px">
          <IconButton size="small"><Mail size={18} /></IconButton>
          <IconButton size="small"><MoreVertical size={18} /></IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box m="20px 32px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="LEADS HUB" subtitle="Manage and score your incoming opportunities with AI" />
        <Button
          onClick={() => setOpenAdd(true)}
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{
            bgcolor: "hsl(var(--primary))",
            color: "white",
            p: "10px 24px",
            borderRadius: "12px",
            "&:hover": { bgcolor: "hsl(var(--primary-glow))" }
          }}
        >
          Add New Lead
        </Button>
      </Box>

      <Box
        mt="40px"
        height="70vh"
        className="glass-card"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "1px solid hsla(var(--primary) / 0.05)" },
          "& .MuiDataGrid-columnHeaders": { bgcolor: "hsla(var(--primary) / 0.05)", borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { bgcolor: "transparent" },
          "& .MuiDataGrid-footerContainer": { bgcolor: "hsla(var(--primary) / 0.05)", borderTop: "none" },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid 
          rows={leads} 
          columns={columns} 
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>

      {/* Add Lead Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} PaperProps={{ sx: { borderRadius: "24px", p: 2, bgcolor: "hsl(var(--background))" } }}>
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "24px" }}>Add Enterprise Lead</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField 
            fullWidth label="Full Name" 
            variant="outlined" 
            value={newLead.name} 
            onChange={(e) => setNewLead({...newLead, name: e.target.value})} 
          />
          <TextField 
            fullWidth label="Work Email" 
            variant="outlined" 
            value={newLead.email} 
            onChange={(e) => setNewLead({...newLead, email: e.target.value})} 
          />
          <TextField 
            fullWidth label="Company Name" 
            variant="outlined" 
            value={newLead.company} 
            onChange={(e) => setNewLead({...newLead, company: e.target.value})} 
          />
          <TextField 
            fullWidth label="Phone Number" 
            variant="outlined" 
            value={newLead.phone} 
            onChange={(e) => setNewLead({...newLead, phone: e.target.value})} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: colors.grey[300] }}>Cancel</Button>
          <Button onClick={handleAddLead} variant="contained" sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "12px", px: 4 }}>
            Create Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;
