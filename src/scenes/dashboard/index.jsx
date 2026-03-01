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
  Lock
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBlinkAuth } from "@blinkdotnew/react";
import LineChart from "../../components/LineChart";
import ProgressCircle from "../../components/ProgressCircle";
import { useSaaS } from "../../hooks/useSaaS";
import { useNavigate } from "react-router-dom";

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
  const { organization, transactions, team, leads, deals, loading } = useDashboardData();
  const { canAccess, tier } = useSaaS();
  const navigate = useNavigate();

  if (loading) return (
    <Box p="40px" display="flex" flexDirection="column" gap="20px">
      <Skeleton variant="text" width="300px" height="60px" />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
        <Skeleton variant="rectangular" height="200px" sx={{ borderRadius: "2rem" }} />
        <Skeleton variant="rectangular" height="200px" sx={{ borderRadius: "2rem" }} />
        <Skeleton variant="rectangular" height="200px" sx={{ borderRadius: "2rem" }} />
      </Box>
    </Box>
  );

  return (
    <Box p="32px" sx={{ overflow: "hidden" }}>
      {/* HEADER GREETING */}
      <Box mb="40px" display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h1" sx={{ color: theme.palette.text.primary, mb: "12px", fontSize: "56px", letterSpacing: "-2px", fontWeight: 700 }}>
            Good Morning, {user?.displayName?.split(' ')[0] || "Alex"}.
          </Typography>
          <Box display="flex" alignItems="center" gap="12px">
            <Typography variant="h2" sx={{ color: theme.palette.text.primary, fontWeight: 500, opacity: 0.8 }}>
              {organization?.name || "Your Workspace"} is <span style={{ color: "hsl(var(--primary))", fontWeight: 700 }}>thriving</span> today.
            </Typography>
          </Box>
        </Box>
        <Box 
          sx={{ 
            p: "12px 24px", 
            borderRadius: "16px", 
            bgcolor: "hsla(var(--primary) / 0.1)",
            border: "1px solid hsla(var(--primary) / 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", bgcolor: "hsl(var(--primary))" }} />
          <Typography variant="h6" fontWeight="bold" color="hsl(var(--primary))">
            {organization?.subscriptionTier || "Pro"} Plan
          </Typography>
        </Box>
      </Box>

      {/* MAIN GRID */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(180px, auto)"
        gap="24px"
      >
        {/* ROW 1: GOAL, STREAK, FOCUS */}
        
        {/* MAIN PIPELINE VALUE */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Target size={20} color="hsl(var(--primary))" />
              <Typography variant="h5" fontWeight="bold">Pipeline Value</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" alignItems="center" gap="24px">
            <Box sx={{ width: "100px", height: "100px", position: "relative" }}>
              <Box 
                className="three-d-ring"
                sx={{ 
                  width: "100%", 
                  height: "100%", 
                  borderRadius: "50%", 
                  background: `conic-gradient(hsl(var(--primary)) 75%, transparent 0)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&::after": {
                    content: '""',
                    width: "75%",
                    height: "85%",
                    borderRadius: "50%",
                    background: "hsl(var(--background))",
                    position: "absolute",
                    boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)"
                  }
                }} 
              />
              <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1 }}>
                <Typography variant="h5" fontWeight="bold">75%</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">Total Active Deals:</Typography>
              <Typography variant="h2" fontWeight="bold" color="hsl(var(--primary))">
                ${deals.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString()}
              </Typography>
              <Box display="flex" alignItems="center" gap="4px" mt="8px">
                <Typography variant="body2" sx={{ opacity: 0.6 }}>{deals.length} Active Opportunities</Typography>
                <ArrowUpRight size={14} color="hsl(var(--primary))" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* LEAD CONVERSION */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Flame size={20} color="#f97316" />
              <Typography variant="h5" fontWeight="bold">Lead Velocity</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="12px">
              <Box sx={{ position: "relative" }}>
                <Flame size={48} color="#f97316" fill="#f97316" style={{ opacity: 0.2 }} />
                <Typography variant="h1" sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontWeight: 800 }}>
                  {leads.length}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: "10px" }}>New Leads</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight="bold" mb="8px">Weekly Activity</Typography>
              <HeatmapMock />
            </Box>
          </Box>
        </Box>

        {/* TEAM PERFORMANCE */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Clock size={20} color="hsl(var(--primary))" />
              <Typography variant="h5" fontWeight="bold">Active Sessions</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>Daily Engagement:</Typography>
              <Typography variant="h1" sx={{ fontWeight: 800, fontSize: "48px", letterSpacing: "-1px" }}>
                {team.length} Active
              </Typography>
              <Box display="flex" alignItems="center" gap="4px" mt="12px" color="hsl(var(--primary))">
                <ArrowUpRight size={16} />
                <Typography variant="body2" fontWeight="bold">Team Peak: {team.length + 2}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: "140px", height: "100px", position: "relative" }}>
               <Box 
                sx={{ 
                  position: "absolute", 
                  top: 0, 
                  right: 0, 
                  background: "hsla(var(--primary) / 0.1)", 
                  backdropFilter: "blur(4px)",
                  border: "1px solid hsla(var(--primary) / 0.2)",
                  borderRadius: "8px",
                  p: "4px 8px",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
               >
                 <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "hsl(var(--primary))" }}>AI</Typography>
                 <Typography sx={{ fontSize: "10px", fontWeight: "bold", color: "hsl(var(--primary))" }}>Sync</Typography>
               </Box>
               <LineChart isDashboard={true} />
            </Box>
          </Box>
        </Box>

        {/* ROW 2: PIPELINE VELOCITY & ACCOUNTABILITY */}

        {/* REVENUE PIPELINE */}
        <Box gridColumn="span 8" className="glass-card" p="32px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="32px">
            <Box>
              <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: "-1px" }}>Revenue Pipeline</Typography>
              <Typography variant="h6" sx={{ opacity: 0.6 }}>Real-time sales velocity tracking</Typography>
            </Box>
            <Box display="flex" gap="12px">
              <Button variant="outlined" sx={{ borderRadius: "12px", borderColor: "hsla(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}>Weekly</Button>
              <Button variant="contained" sx={{ borderRadius: "12px", bgcolor: "hsl(var(--primary))", "&:hover": { bgcolor: "hsl(var(--primary-glow))" } }}>Monthly</Button>
            </Box>
          </Box>
          <Box sx={{ height: "300px", width: "100%" }}>
            <LineChart isDashboard={false} />
          </Box>
        </Box>

        {/* AI SALES COACH / NEXT ACTIONS */}
        <Box gridColumn="span 8" className="glass-card" p="24px" sx={{ position: "relative", overflow: "hidden" }}>
          {!canAccess('aiCoach') && (
            <Box 
              sx={{ 
                position: "absolute", 
                inset: 0, 
                zIndex: 10, 
                bgcolor: "rgba(255,255,255,0.6)", 
                backdropFilter: "blur(8px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 4,
                textAlign: "center"
              }}
            >
              <Lock size={32} color="hsl(var(--primary))" />
              <Typography variant="h4" fontWeight="bold">Pro Sales Coach</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: "300px" }}>
                Get proactive deal risks and action suggestions with our AI Sales Coach.
              </Typography>
              <Button size="small" onClick={() => navigate("/upgrade")} sx={{ color: "hsl(var(--primary))", fontWeight: "bold" }}>Upgrade to Pro</Button>
            </Box>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Box display="flex" alignItems="center" gap="12px">
              <Sparkles size={20} color="hsl(var(--primary))" />
              <Typography variant="h4" fontWeight="bold">AI Sales Coach: Next Actions</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap="16px">
            {[
              { type: 'Follow-up', target: 'Robert Baratheon', reason: 'Lead score 85, inactive for 3 days', priority: 'High' },
              { type: 'Risk Alert', target: 'Gold Mine Deal', reason: 'High amount ($850k) but Lead Score is 0', priority: 'Critical' },
              { type: 'Opportunity', target: 'Ned Stark', reason: 'Proposal sent, engagement peak detected', priority: 'Medium' }
            ].map((action, i) => (
              <Box 
                key={i}
                display="flex" 
                alignItems="center" 
                justifyContent="space-between"
                sx={{ 
                  p: "16px 24px", 
                  borderRadius: "16px", 
                  bgcolor: action.priority === 'Critical' ? "hsla(0 100% 50% / 0.05)" : "hsla(var(--primary) / 0.03)",
                  border: "1px solid hsla(var(--primary) / 0.1)"
                }}
              >
                <Box display="flex" alignItems="center" gap="20px">
                  <Chip 
                    label={action.type} 
                    size="small" 
                    sx={{ 
                      bgcolor: action.priority === 'Critical' ? "#ef4444" : "hsl(var(--primary))", 
                      color: "white", 
                      fontWeight: "bold",
                      borderRadius: "8px"
                    }} 
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{action.target}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6 }}>{action.reason}</Typography>
                  </Box>
                </Box>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderRadius: "10px", 
                    textTransform: "none",
                    borderColor: "hsla(var(--primary) / 0.3)",
                    color: "hsl(var(--primary))"
                  }}
                >
                  Take Action
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ACCOUNTABILITY CIRCLE */}
        <Box gridColumn="span 4" className="glass-card" p="32px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="28px">
            <Typography variant="h4" fontWeight="bold" sx={{ letterSpacing: "-0.5px" }}>Accountability</Typography>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap="24px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <AvatarGroup max={4}>
                {team.map((member, i) => (
                  <Avatar 
                    key={member.id}
                    src={i === 0 ? "/assets/user.png" : undefined}
                    sx={{ width: 56, height: 56, border: "3px solid hsl(var(--background)) !important" }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Box textAlign="right">
                <Typography variant="h2" fontWeight="900" sx={{ letterSpacing: "-1px" }}>{team.length}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 600 }}>Active Agents</Typography>
              </Box>
            </Box>
            
            <Box sx={{ p: "20px", borderRadius: "20px", bgcolor: "hsla(var(--primary) / 0.05)", border: "1px solid hsla(var(--primary) / 0.1)" }}>
              <Typography variant="h6" fontWeight="bold" mb="4px">Next Strategy Sync</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: "16px" }}>Today at 2:00 PM • Marketing Team</Typography>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RefreshCcw size={18} />}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  borderRadius: "12px",
                  py: "10px",
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  "&:hover": { bgcolor: "#f8f8f8" }
                }}
              >
                Join Huddle
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ACHIEVEMENTS ROW */}
        <Box gridColumn="span 12" className="glass-card" p="32px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="28px">
            <Box display="flex" alignItems="center" gap="12px">
              <Trophy size={24} color="#f59e0b" />
              <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: "-1px" }}>Team Milestones</Typography>
            </Box>
            <Button sx={{ color: "hsl(var(--primary))", fontWeight: "bold" }}>View All</Button>
          </Box>
          <Box display="flex" gap="24px">
            {[
              { title: "Revenue Peak", desc: `$${revenue.toLocaleString()} reached this month`, icon: Trophy, color: "#f59e0b", badge: "Global" },
              { title: "Retention Star", desc: "98% client satisfaction rate", icon: Sparkles, color: "hsl(var(--primary))", badge: "Team" },
              { title: "Velocity Champ", desc: "Pipeline moving 20% faster", icon: ArrowUpRight, color: "#3b82f6", badge: "Personal" }
            ].map((milestone, i) => (
              <Box 
                key={i}
                display="flex" 
                alignItems="center" 
                gap="20px" 
                sx={{ 
                  flex: 1, 
                  p: "24px", 
                  borderRadius: "24px", 
                  bgcolor: "hsla(var(--primary) / 0.03)",
                  border: "1px solid hsla(var(--primary) / 0.08)",
                  transition: "var(--transition-smooth)",
                  "&:hover": { bgcolor: "hsla(var(--primary) / 0.06)", transform: "translateY(-4px)" }
                }}
              >
                <Box 
                  sx={{ 
                    width: "56px", 
                    height: "56px", 
                    borderRadius: "16px", 
                    bgcolor: milestone.color, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "white",
                    boxShadow: `0 8px 16px ${milestone.color}33`
                  }}
                >
                  <milestone.icon size={28} />
                </Box>
                <Box>
                  <Box display="flex" alignItems="center" gap="8px" mb="4px">
                    <Typography variant="h5" fontWeight="bold">{milestone.title}</Typography>
                    <Box sx={{ px: "6px", py: "2px", bgcolor: "white", borderRadius: "6px", fontSize: "10px", fontWeight: 900, color: milestone.color, border: `1px solid ${milestone.color}33` }}>
                      {milestone.badge}
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 500 }}>{milestone.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
