import { 
  Box, 
  Typography, 
  useTheme, 
  Avatar, 
  AvatarGroup, 
  Button, 
  IconButton,
  Tooltip,
  Skeleton,
  Chip
} from "@mui/material";
import { tokens } from "../../theme";
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Trophy, 
  Users, 
  RefreshCcw,
  MoreHorizontal,
  ArrowUpRight,
  Target,
  Lock,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBlinkAuth } from "@blinkdotnew/react";
import LineChart from "../../components/LineChart";
import { useSaaS } from "../../hooks/useSaaS";
import { useNavigate } from "react-router-dom";
import StatBox from "../../components/StatBox";

const HeatmapMock = () => {
  const cells = Array.from({ length: 28 }, (_, i) => Math.random() > 0.3);
  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap="6px">
      {cells.map((active, i) => (
        <Box
          key={i}
          sx={{
            width: "14px",
            height: "14px",
            borderRadius: "4px",
            background: active ? "hsl(var(--primary))" : "hsla(var(--primary) / 0.1)",
            boxShadow: active ? "0 0 10px hsla(var(--primary) / 0.3)" : "none",
            transition: "var(--transition-smooth)",
            "&:hover": { transform: "scale(1.2)", zIndex: 1 }
          }}
        />
      ))}
    </Box>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useBlinkAuth();
  const { organization, team, leads, deals, loading } = useDashboardData();
  const { canAccess } = useSaaS();
  const navigate = useNavigate();

  if (loading) return (
    <Box p="40px" display="flex" flexDirection="column" gap="20px">
      <Skeleton variant="text" width="400px" height="80px" />
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="24px">
        <Skeleton variant="rectangular" height="180px" sx={{ borderRadius: "2rem" }} />
        <Skeleton variant="rectangular" height="180px" sx={{ borderRadius: "2rem" }} />
        <Skeleton variant="rectangular" height="180px" sx={{ borderRadius: "2rem" }} />
        <Skeleton variant="rectangular" height="180px" sx={{ borderRadius: "2rem" }} />
      </Box>
      <Box display="grid" gridTemplateColumns="8fr 4fr" gap="24px">
        <Skeleton variant="rectangular" height="400px" sx={{ borderRadius: "2rem" }} />
        <Skeleton variant="rectangular" height="400px" sx={{ borderRadius: "2rem" }} />
      </Box>
    </Box>
  );

  const totalRevenue = deals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const highScoreLeads = leads.filter(l => (l.score || 0) > 70).length;

  return (
    <Box p="32px" sx={{ overflowX: "hidden" }}>
      {/* HEADER SECTION */}
      <Box mb="48px" display="flex" justifyContent="space-between" alignItems="flex-end" className="animate-fade-in">
        <Box>
          <Typography variant="h1" sx={{ color: theme.palette.text.primary, mb: "8px" }}>
            Greetings, {user?.displayName?.split(' ')[0] || "User"}.
          </Typography>
          <Typography variant="h4" sx={{ opacity: 0.6, fontWeight: 500 }}>
            {organization?.name || "Ascend Workspace"} is <span className="text-gradient" style={{ fontWeight: 800 }}>performing optimally</span> today.
          </Typography>
        </Box>
        <Box display="flex" gap="12px">
          <Button 
            variant="outlined" 
            startIcon={<RefreshCcw size={18} />}
            sx={{ borderRadius: "14px", px: 3, py: 1.2, borderColor: "hsla(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}
          >
            Sync Data
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Zap size={18} />}
            sx={{ borderRadius: "14px", px: 4, py: 1.2, bgcolor: "hsl(var(--primary))", boxShadow: "0 10px 20px -5px hsla(var(--primary) / 0.3)" }}
          >
            New Action
          </Button>
        </Box>
      </Box>

      {/* STATS ROW */}
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="24px" mb="24px" className="animate-slide-up">
        <StatBox
          title="Revenue Pipeline"
          value={`$${totalRevenue.toLocaleString()}`}
          increase="+12.5%"
          icon={<Target color="hsl(var(--primary))" size={24} />}
          description="Total active deals value"
        />
        <StatBox
          title="Lead Velocity"
          value={leads.length.toString()}
          increase={`${highScoreLeads} Hot`}
          icon={<Flame color="#f97316" size={24} />}
          description="New leads this week"
        />
        <StatBox
          title="Active Agents"
          value={team.length.toString()}
          increase="Online"
          icon={<Users color="#3b82f6" size={24} />}
          description="Members currently active"
        />
        <StatBox
          title="AI Insights"
          value="98.2%"
          increase="Optimized"
          icon={<Sparkles color="#8b5cf6" size={24} />}
          description="Efficiency score"
        />
      </Box>

      {/* MAIN CONTENT GRID */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="24px">
        
        {/* REVENUE CHART */}
        <Box gridColumn="span 8" className="glass-card" p="32px" sx={{ minHeight: "450px" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="32px">
            <Box>
              <Typography variant="h3" fontWeight="bold">Revenue Intelligence</Typography>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>Sales velocity and projection across quarters</Typography>
            </Box>
            <Box display="flex" gap="12px" sx={{ bgcolor: "hsla(var(--primary) / 0.05)", p: "4px", borderRadius: "14px" }}>
              <Button size="small" sx={{ borderRadius: "10px", color: "hsl(var(--primary))", fontWeight: "bold" }}>Week</Button>
              <Button size="small" variant="contained" sx={{ borderRadius: "10px", bgcolor: "white", color: "black", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>Month</Button>
            </Box>
          </Box>
          <Box height="320px">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* RECENT DEALS */}
        <Box gridColumn="span 4" className="glass-card" p="32px" sx={{ maxHeight: "450px", overflow: "hidden" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Typography variant="h4" fontWeight="bold">High Value Deals</Typography>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap="16px">
            {deals.slice(0, 5).map((deal, i) => (
              <Box 
                key={i} 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                sx={{ 
                  p: "14px 18px", 
                  borderRadius: "16px", 
                  bgcolor: "hsla(var(--primary) / 0.03)", 
                  border: "1px solid hsla(var(--primary) / 0.05)",
                  transition: "var(--transition-smooth)",
                  "&:hover": { bgcolor: "hsla(var(--primary) / 0.06)", transform: "scale(1.02)" }
                }}
              >
                <Box display="flex" alignItems="center" gap="12px">
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: deal.amount > 50000 ? "#22c55e" : "#f59e0b" }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{deal.title}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>{deal.stage}</Typography>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold">${(deal.amount / 1000).toFixed(0)}k</Typography>
              </Box>
            ))}
          </Box>
          <Button 
            fullWidth 
            sx={{ mt: 3, color: "hsl(var(--primary))", fontWeight: "bold", borderRadius: "12px", py: 1.5, border: "1px dashed hsla(var(--primary) / 0.2)" }}
            onClick={() => navigate("/kanban")}
          >
            View Pipeline
          </Button>
        </Box>

        {/* AI COACH & ACTIONS */}
        <Box gridColumn="span 7" className="glass-card" p="32px" sx={{ position: "relative" }}>
          {!canAccess('aiCoach') && (
            <Box sx={{ position: "absolute", inset: 0, zIndex: 10, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, borderRadius: "inherit" }}>
              <Lock size={32} color="hsl(var(--primary))" />
              <Typography variant="h3" fontWeight="bold">AI Sales Coach</Typography>
              <Button variant="contained" onClick={() => navigate("/upgrade")} sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "12px", px: 4 }}>Upgrade to Pro</Button>
            </Box>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="32px">
            <Box display="flex" alignItems="center" gap="12px">
              <Sparkles size={24} color="hsl(var(--primary))" />
              <Typography variant="h3" fontWeight="bold">Next AI Actions</Typography>
            </Box>
            <Chip label="Real-time" size="small" sx={{ bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))", fontWeight: "bold" }} />
          </Box>
          <Box display="flex" flexDirection="column" gap="20px">
            {[
              { title: "Follow up with Robert", reason: "Lead Score 92. High intent detected.", type: "urgent", icon: CheckCircle2 },
              { title: "Review Gold Mine Deal", reason: "Value mismatch in proposal stage.", type: "warning", icon: AlertCircle },
              { title: "Send Q3 Recap to Team", reason: "Automated insight generation ready.", type: "info", icon: Sparkles }
            ].map((action, i) => (
              <Box 
                key={i} 
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                sx={{ 
                  p: "20px 24px", 
                  borderRadius: "20px", 
                  bgcolor: "hsla(var(--primary) / 0.02)",
                  border: "1px solid hsla(var(--primary) / 0.08)",
                  transition: "var(--transition-smooth)",
                  "&:hover": { bgcolor: "hsla(var(--primary) / 0.05)" }
                }}
              >
                <Box display="flex" alignItems="center" gap="20px">
                  <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: action.type === 'urgent' ? "#fef2f2" : action.type === 'warning' ? "#fff7ed" : "hsla(var(--primary) / 0.1)" }}>
                    <action.icon size={22} color={action.type === 'urgent' ? "#ef4444" : action.type === 'warning' ? "#f97316" : "hsl(var(--primary))"} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">{action.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>{action.reason}</Typography>
                  </Box>
                </Box>
                <Button variant="outlined" sx={{ borderRadius: "10px", borderColor: "hsla(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}>Action</Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* TEAM SYNC & ACCOUNTABILITY */}
        <Box gridColumn="span 5" className="glass-card" p="32px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="32px">
            <Typography variant="h3" fontWeight="bold">Agent Performance</Typography>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap="24px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <AvatarGroup max={4}>
                {team.map((member, i) => (
                  <Avatar 
                    key={member.id}
                    sx={{ width: 56, height: 56, border: "3px solid white !important" }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Box textAlign="right">
                <Typography variant="h1" fontWeight="900" sx={{ letterSpacing: "-2px" }}>{team.length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 700 }}>Active Agents</Typography>
              </Box>
            </Box>

            <Box sx={{ p: 3, borderRadius: "24px", bgcolor: "hsla(var(--primary) / 0.04)", border: "1px solid hsla(var(--primary) / 0.1)" }}>
              <Typography variant="h5" fontWeight="bold" mb="4px">Strategy Huddle</Typography>
              <Typography variant="body2" sx={{ opacity: 0.6, mb: 3 }}>Today at 2:00 PM • Main Boardroom</Typography>
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<CheckCircle2 size={18} />}
                sx={{ bgcolor: "white", color: "black", fontWeight: "bold", borderRadius: "14px", py: 1.5, "&:hover": { bgcolor: "#f0f0f0" } }}
              >
                I'll be there
              </Button>
            </Box>
            
            <Box display="flex" alignItems="center" gap="16px">
              <Box sx={{ flex: 1, height: "4px", borderRadius: "2px", bgcolor: "hsla(var(--primary) / 0.1)" }}>
                <Box sx={{ width: "75%", height: "100%", borderRadius: "2px", bgcolor: "hsl(var(--primary))", boxShadow: "0 0 10px hsla(var(--primary) / 0.5)" }} />
              </Box>
              <Typography variant="body2" fontWeight="bold">75% Target</Typography>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;
