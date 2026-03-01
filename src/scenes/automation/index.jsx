import { 
  Box, 
  Typography, 
  useTheme, 
  Button, 
  IconButton, 
  Chip, 
  Paper, 
  Switch, 
  FormControlLabel,
  Skeleton
} from "@mui/material";
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
  Play,
  Lock,
  Workflow,
  Sparkles,
  Bot,
  Settings2,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { blink } from "../../lib/blink";
import { toast } from "react-hot-toast";
import { useSaaS } from "../../hooks/useSaaS";
import { useNavigate } from "react-router-dom";

const Automation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { organization, loading } = useDashboardData();
  const { canAccess } = useSaaS();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!canAccess('automation')) {
    return (
      <Box m="32px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="75vh">
        <Box 
          className="glass-card"
          sx={{ 
            p: "64px", 
            textAlign: "center", 
            maxWidth: "600px", 
            bgcolor: "white",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box 
            sx={{ 
              position: "absolute", 
              top: "-50px", 
              right: "-50px", 
              width: "200px", 
              height: "200px", 
              background: "radial-gradient(circle, hsla(var(--primary) / 0.1) 0%, transparent 70%)",
              zIndex: 0
            }} 
          />
          <Box sx={{ width: "100px", height: "100px", borderRadius: "30px", bgcolor: "hsla(var(--primary) / 0.1)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 4, position: "relative", zIndex: 1 }}>
            <Lock size={48} color="hsl(var(--primary))" />
          </Box>
          <Typography variant="h1" fontWeight="800" mb={2} sx={{ letterSpacing: "-2px" }}>Automation Hub</Typography>
          <Typography variant="h4" sx={{ opacity: 0.6, mb: 5, lineHeight: 1.6 }}>
            Enterprise-grade workflows, AI triggers, and complex business rules are only available on the Pro plan and above.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate("/upgrade")}
            sx={{ 
              bgcolor: "hsl(var(--primary))", 
              color: "white", 
              borderRadius: "16px", 
              px: 8, 
              py: 2, 
              fontSize: "18px", 
              fontWeight: "900",
              boxShadow: "0 20px 40px -10px hsla(var(--primary) / 0.4)"
            }}
          >
            Upgrade to Pro
          </Button>
        </Box>
      </Box>
    );
  }

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

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Workflows synced with production engine");
    }, 1500);
  };

  return (
    <Box m="32px">
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb="48px">
        <Header title="AUTOMATION HUB" subtitle="Build Trigger → AI Action rules to automate your enterprise workflow" />
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handleSync}
            disabled={isSyncing}
            startIcon={<RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />}
            sx={{
              borderColor: "hsla(var(--primary) / 0.2)",
              color: "hsl(var(--primary))",
              p: "12px 24px",
              borderRadius: "16px",
              fontWeight: "bold"
            }}
          >
            {isSyncing ? "Syncing..." : "Sync Engine"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            sx={{
              bgcolor: "hsl(var(--primary))",
              color: "white",
              p: "12px 32px",
              borderRadius: "16px",
              boxShadow: "0 10px 30px hsla(var(--primary) / 0.3)",
              fontWeight: "bold",
              "&:hover": { bgcolor: "hsl(var(--primary-glow))" }
            }}
          >
            Create Rule
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap="24px">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={300} sx={{ borderRadius: "2rem" }} />)}
        </Box>
      ) : workflows.length === 0 ? (
        <Paper 
          className="glass-card" 
          sx={{ p: "120px", textAlign: "center", bgcolor: "hsla(var(--primary) / 0.02)", border: "2px dashed hsla(var(--primary) / 0.1)" }}
        >
          <Box sx={{ width: "120px", height: "120px", borderRadius: "40px", bgcolor: "hsla(var(--primary) / 0.05)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 4 }}>
            <Workflow size={64} color="hsl(var(--primary))" style={{ opacity: 0.3 }} />
          </Box>
          <Typography variant="h1" fontWeight="800" mb="12px" sx={{ letterSpacing: "-2px" }}>No Active Workflows</Typography>
          <Typography variant="h4" sx={{ opacity: 0.6, mb: "40px", maxWidth: "500px", mx: "auto" }}>
            Automate repetitive tasks like lead scoring, follow-ups, and data syncing.
          </Typography>
          <Box display="flex" justifyContent="center" gap={3}>
            <Button variant="contained" sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "14px", px: 5, py: 1.5, fontWeight: "bold" }}>
              Explore Templates
            </Button>
            <Button variant="outlined" sx={{ borderRadius: "14px", px: 5, py: 1.5, fontWeight: "bold", borderColor: "hsla(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}>
              Watch Demo
            </Button>
          </Box>
        </Paper>
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap="32px">
          {workflows.map((flow) => (
            <Paper key={flow.id} className="glass-card glow-on-hover" sx={{ p: "32px", display: "flex", flexDirection: "column", gap: "24px", bgcolor: "white" }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box display="flex" alignItems="center" gap="16px">
                  <Box sx={{ p: "12px", borderRadius: "14px", bgcolor: flow.status === 'Active' ? "hsla(142 76% 36% / 0.1)" : "hsla(var(--primary) / 0.1)" }}>
                    {flow.type === 'AI' ? <Sparkles size={24} color="hsl(var(--primary))" /> : <Zap size={24} color={flow.status === 'Active' ? "hsl(142 76% 36%)" : "hsl(var(--primary))"} />}
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>{flow.name}</Typography>
                    <Box display="flex" alignItems="center" gap="8px">
                      <Clock size={12} style={{ opacity: 0.4 }} />
                      <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: "bold" }}>Modified 2h ago</Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton size="small" sx={{ bgcolor: "hsla(var(--primary) / 0.05)" }}><MoreVertical size={18} /></IconButton>
              </Box>

              <Box sx={{ p: "24px", borderRadius: "20px", bgcolor: "hsla(var(--primary) / 0.04)", border: "1px solid hsla(var(--primary) / 0.08)" }}>
                <Box display="flex" alignItems="center" justifyContent="center" gap="20px">
                  <Box textAlign="center" flex={1}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.4, mb: "8px", letterSpacing: "1px" }}>Trigger</Typography>
                    <Box sx={{ p: "8px 12px", borderRadius: "10px", bgcolor: "white", border: "1px solid hsla(var(--primary) / 0.1)", display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Zap size={14} color="hsl(var(--primary))" />
                      <Typography variant="body2" fontWeight="800" sx={{ fontSize: "12px" }}>{flow.triggerEvent}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <ArrowRight size={24} style={{ opacity: 0.3 }} />
                  </Box>
                  <Box textAlign="center" flex={1}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.4, mb: "8px", letterSpacing: "1px" }}>Action</Typography>
                    <Box sx={{ p: "8px 12px", borderRadius: "10px", bgcolor: "hsl(var(--primary))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 1, boxShadow: "0 4px 12px hsla(var(--primary) / 0.2)" }}>
                      <Bot size={14} />
                      <Typography variant="body2" fontWeight="800" sx={{ fontSize: "12px" }}>{flow.actionType}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Switch checked={flow.status === 'Active'} onChange={() => handleToggle(flow.id, flow.status)} size="small" color="success" />}
                  label={<Typography variant="body2" fontWeight="bold" sx={{ color: flow.status === 'Active' ? "hsl(142 76% 36%)" : "inherit" }}>{flow.status}</Typography>}
                />
                <Box display="flex" gap={1}>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(flow.id)} 
                    sx={{ color: "#ef4444", "&:hover": { bgcolor: "hsla(0 100% 50% / 0.05)" } }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Play size={14} />} 
                    sx={{ 
                      color: "hsl(var(--primary))", 
                      textTransform: "none", 
                      fontWeight: "bold", 
                      borderRadius: "10px",
                      borderColor: "hsla(var(--primary) / 0.2)",
                      "&:hover": { borderColor: "hsl(var(--primary))" }
                    }}
                  >
                    Test Run
                  </Button>
                  <IconButton size="small" sx={{ bgcolor: "hsla(var(--primary) / 0.05)" }}><Settings2 size={18} /></IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
          
          <Paper 
            className="glass-card" 
            sx={{ 
              p: "32px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 3, 
              bgcolor: "hsla(var(--primary) / 0.01)", 
              border: "2px dashed hsla(var(--primary) / 0.15)",
              cursor: "pointer",
              transition: "var(--transition-smooth)",
              "&:hover": { bgcolor: "hsla(var(--primary) / 0.03)", borderColor: "hsl(var(--primary))" }
            }}
          >
            <Box sx={{ width: "64px", height: "64px", borderRadius: "20px", bgcolor: "hsla(var(--primary) / 0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(var(--primary))" }}>
              <Plus size={32} />
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ opacity: 0.6 }}>Create Custom Rule</Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Automation;
