import { 
  Box, 
  Typography, 
  useTheme, 
  Avatar, 
  AvatarGroup, 
  Button, 
  IconButton,
  Tooltip,
  Skeleton
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
  Target
} from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBlinkAuth } from "@blinkdotnew/react";
import LineChart from "../../components/LineChart";
import ProgressCircle from "../../components/ProgressCircle";

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
  const { team, invoices, transactions, loading } = useDashboardData();

  if (loading) {
    return (
      <Box p="32px">
        <Skeleton variant="text" width="400px" height={80} />
        <Skeleton variant="text" width="300px" height={40} sx={{ mb: 4 }} />
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="24px">
          <Skeleton variant="rectangular" gridColumn="span 4" height={200} sx={{ borderRadius: "2rem" }} />
          <Skeleton variant="rectangular" gridColumn="span 4" height={200} sx={{ borderRadius: "2rem" }} />
          <Skeleton variant="rectangular" gridColumn="span 4" height={200} sx={{ borderRadius: "2rem" }} />
        </Box>
      </Box>
    );
  }

  const revenue = invoices.reduce((acc, curr) => acc + parseFloat(curr.cost || 0), 0);

  return (
    <Box p="32px" sx={{ overflowY: "auto", height: "100%" }}>
      {/* HEADER GREETING */}
      <Box mb="40px">
        <Typography 
          variant="h1" 
          sx={{ 
            color: theme.palette.text.primary, 
            mb: "12px", 
            fontSize: "56px", 
            letterSpacing: "-2.5px", 
            fontWeight: 800,
            lineHeight: 1
          }}
        >
          Good Morning, {user?.displayName?.split(' ')[0] || "Alex"}.
        </Typography>
        <Box display="flex" alignItems="center" gap="12px">
          <Typography variant="h2" sx={{ color: theme.palette.text.primary, fontWeight: 500, opacity: 0.7 }}>
            You're <span style={{ color: "hsl(var(--primary))", fontWeight: 700 }}>15% ahead</span> of schedule today.
          </Typography>
          <Typography variant="h2" sx={{ color: theme.palette.text.primary, fontWeight: 500, opacity: 0.7 }}>
            Keep pushing! 👋
          </Typography>
        </Box>
      </Box>

      {/* MAIN GRID */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="minmax(200px, auto)"
        gap="24px"
      >
        {/* ROW 1: GOAL, STREAK, FOCUS */}
        
        {/* MAIN GOAL FOCUS */}
        <Box gridColumn="span 4" className="glass-card" p="28px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Box display="flex" alignItems="center" gap="12px">
              <Box p="8px" sx={{ bgcolor: "hsla(var(--primary) / 0.1)", borderRadius: "10px" }}>
                <Target size={20} color="hsl(var(--primary))" />
              </Box>
              <Typography variant="h5" fontWeight="bold">Main Goal Focus</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" alignItems="center" gap="28px">
            <ProgressCircle progress={0.82} size={110} />
            <Box>
              <Typography variant="h6" sx={{ opacity: 0.6, mb: "4px" }}>Q1 CRM Launch:</Typography>
              <Typography variant="h2" fontWeight="800" color="hsl(var(--primary))" sx={{ letterSpacing: "-1px" }}>82% Done</Typography>
              <Box display="flex" alignItems="center" gap="6px" mt="12px">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Target: Mar 31</Typography>
                <ArrowUpRight size={14} color="hsl(var(--primary))" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* CURRENT STREAK */}
        <Box gridColumn="span 4" className="glass-card" p="28px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Box display="flex" alignItems="center" gap="12px">
              <Box p="8px" sx={{ bgcolor: "rgba(249, 115, 22, 0.1)", borderRadius: "10px" }}>
                <Flame size={20} color="#f97316" />
              </Box>
              <Typography variant="h5" fontWeight="bold">Current Streak</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="16px">
              <Box sx={{ position: "relative" }}>
                <Flame size={64} color="#f97316" fill="#f97316" style={{ opacity: 0.15 }} />
                <Typography 
                  variant="h1" 
                  sx={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -45%)",
                    fontWeight: 900,
                    fontSize: "42px",
                    color: "#f97316"
                  }}
                >
                  24
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: "#f97316" }}>Days</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight="700" mb="10px" sx={{ opacity: 0.8 }}>Activity Insights</Typography>
              <HeatmapMock />
            </Box>
          </Box>
        </Box>

        {/* FOCUS TIME */}
        <Box gridColumn="span 4" className="glass-card" p="28px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Box display="flex" alignItems="center" gap="12px">
              <Box p="8px" sx={{ bgcolor: "hsla(var(--primary) / 0.1)", borderRadius: "10px" }}>
                <Clock size={20} color="hsl(var(--primary))" />
              </Box>
              <Typography variant="h5" fontWeight="bold">Focus Time</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.6, mb: "4px" }}>Today's Performance:</Typography>
              <Typography variant="h1" sx={{ fontWeight: 800, fontSize: "48px", letterSpacing: "-2px" }}>03h 45m</Typography>
              <Box display="flex" alignItems="center" gap="6px" mt="16px" color="hsl(var(--primary))">
                <ArrowUpRight size={18} />
                <Typography variant="body2" fontWeight="700">Yesterday: 03h 10m</Typography>
              </Box>
            </Box>
            <Box sx={{ width: "140px", height: "100px", position: "relative" }}>
               <Box 
                sx={{ 
                  position: "absolute", 
                  top: -10, 
                  right: -10, 
                  background: "hsla(var(--primary) / 0.1)", 
                  backdropFilter: "blur(12px)",
                  border: "1px solid hsla(var(--primary) / 0.2)",
                  borderRadius: "12px",
                  p: "6px 10px",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
               >
                 <Typography sx={{ fontSize: "10px", fontWeight: "900", color: "hsl(var(--primary))", textTransform: "uppercase" }}>Forecast</Typography>
                 <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: "hsl(var(--primary))" }}>+$4.2k</Typography>
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
