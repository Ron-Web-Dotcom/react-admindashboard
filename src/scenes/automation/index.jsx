import { Box, Typography, useTheme, Button, IconButton, Chip, Paper, Switch, FormControlLabel } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";
import { 
  Zap, 
  Plus, 
  Trash2, 
  ArrowRight,
  Bell,
  Mail,
  RefreshCw,
  MoreVertical,
  Play
} from "lucide-react";
import { useState, useEffect } from "react";
import { blink } from "../../lib/blink";
import { toast } from "react-hot-toast";

const Automation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { organization, loading } = useDashboardData();
  const [workflows, setWorkflows] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchWorkflows = async () => {
    if (!organization?.id) return;
    try {
      const data = await blink.db.automations.list({
        where: { organizationId: organization.id }
      });
      setWorkflows(data);
    } catch (error) {
      console.error("Failed to fetch workflows");
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [organization?.id]);

  const handleDelete = async (id) => {
    try {
      await blink.db.automations.delete(id);
      toast.success("Automation deleted");
      fetchWorkflows();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
    try {
      await blink.db.automations.update(id, { status: nextStatus });
      fetchWorkflows();
    } catch (error) {
      toast.error("Sync failed");
    }
  };

  return (
    <Box m="20px 32px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="40px">
        <Header title="AUTOMATION HUB" subtitle="Build Trigger → Action rules to automate your enterprise workflow" />
        <Button
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
          Create New Rule
        </Button>
      </Box>

      {workflows.length === 0 && !loading ? (
        <Paper 
          className="glass-card" 
          sx={{ p: "80px", textAlign: "center", bgcolor: "hsla(var(--primary) / 0.02)" }}
        >
          <Zap size={64} color="hsl(var(--primary))" style={{ opacity: 0.2, marginBottom: "20px" }} />
          <Typography variant="h3" fontWeight="bold" mb="12px">No Active Workflows</Typography>
          <Typography variant="h5" sx={{ opacity: 0.6, mb: "32px" }}>
            Start by creating a trigger-based automation to save hours of manual work.
          </Typography>
          <Button variant="outlined" sx={{ borderRadius: "12px", borderColor: "hsl(var(--primary))", color: "hsl(var(--primary))" }}>
            View Templates
          </Button>
        </Paper>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap="24px">
          {workflows.map((flow) => (
            <Paper key={flow.id} className="glass-card" sx={{ p: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box display="flex" alignItems="center" gap="12px">
                  <Box sx={{ p: "10px", borderRadius: "12px", bgcolor: flow.status === 'Active' ? "hsla(142 76% 36% / 0.1)" : "hsla(var(--primary) / 0.1)" }}>
                    <Zap size={20} color={flow.status === 'Active' ? "hsl(142 76% 36%)" : "hsl(var(--primary))"} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">{flow.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>Created {new Date(flow.createdAt).toLocaleDateString()}</Typography>
                  </Box>
                </Box>
                <IconButton size="small"><MoreVertical size={18} /></IconButton>
              </Box>

              <Box display="flex" alignItems="center" justifyContent="center" gap="16px" sx={{ bgcolor: "hsla(var(--primary) / 0.03)", p: "16px", borderRadius: "16px" }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.5, mb: "4px" }}>Trigger</Typography>
                  <Chip label={flow.triggerEvent} size="small" sx={{ fontWeight: "bold" }} />
                </Box>
                <ArrowRight size={20} style={{ opacity: 0.3 }} />
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.5, mb: "4px" }}>Action</Typography>
                  <Chip label={flow.actionType} size="small" variant="outlined" sx={{ fontWeight: "bold", borderColor: "hsl(var(--primary))", color: "hsl(var(--primary))" }} />
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Switch checked={flow.status === 'Active'} onChange={() => handleToggle(flow.id, flow.status)} size="small" color="success" />}
                  label={<Typography variant="body2" fontWeight="bold">{flow.status}</Typography>}
                />
                <Box>
                  <IconButton size="small" onClick={() => handleDelete(flow.id)} sx={{ color: colors.redAccent[500] }}>
                    <Trash2 size={18} />
                  </IconButton>
                  <Button size="small" startIcon={<Play size={14} />} sx={{ color: "hsl(var(--primary))", textTransform: "none", fontWeight: "bold" }}>
                    Run Now
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Automation;
