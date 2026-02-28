import { 
  Box, 
  Typography, 
  useTheme, 
  Avatar, 
  AvatarGroup, 
  Button, 
  IconButton,
  Tooltip
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
import { ResponsivePie } from "@nivo/pie";

const HeatmapMock = () => {
  const cells = Array.from({ length: 28 }, (_, i) => Math.random() > 0.3);
  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap="4px">
      {cells.map((active, i) => (
        <Box
          key={i}
          sx={{
            width: "12px",
            height: "12px",
            borderRadius: "3px",
            background: active ? "hsl(var(--primary))" : "hsla(var(--primary) / 0.1)",
            opacity: active ? (0.4 + Math.random() * 0.6) : 1
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
  const { transactions, team, loading } = useDashboardData();

  if (loading) return <Box p="40px">Loading Ascend...</Box>;

  return (
    <Box p="32px" sx={{ overflow: "hidden" }}>
      {/* HEADER GREETING */}
      <Box mb="40px">
        <Typography variant="h1" sx={{ color: colors.grey[100], mb: "12px", fontSize: "56px", letterSpacing: "-2px" }}>
          Good Morning, {user?.displayName?.split(' ')[0] || "Alex"}.
        </Typography>
        <Box display="flex" alignItems="center" gap="12px">
          <Typography variant="h2" color={colors.grey[100]} sx={{ fontWeight: 500 }}>
            You're <span style={{ color: "hsl(var(--primary))", fontWeight: 700 }}>15% ahead</span> of schedule today.
          </Typography>
          <Typography variant="h2" color={colors.grey[100]} sx={{ fontWeight: 500 }}>
            Keep pushing! 👋
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
        
        {/* MAIN GOAL FOCUS */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Target size={20} color="hsl(var(--primary))" />
              <Typography variant="h5" fontWeight="bold">Main Goal Focus</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" alignItems="center" gap="24px">
            <Box sx={{ width: "100px", height: "100px", position: "relative" }}>
              {/* 3D-ish Progress Circle placeholder */}
              <Box 
                sx={{ 
                  width: "100%", 
                  height: "100%", 
                  borderRadius: "50%", 
                  background: `conic-gradient(hsl(var(--primary)) 82%, transparent 0)`,
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.1), 0 0 20px hsla(var(--primary) / 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&::after": {
                    content: '""',
                    width: "75%",
                    height: "85%", // offset for 3D look
                    borderRadius: "50%",
                    background: "hsl(var(--background))",
                    position: "absolute",
                    boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)"
                  }
                }} 
              />
              <Box 
                sx={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)", 
                  zIndex: 1 
                }}
              >
                <Typography variant="h5" fontWeight="bold">82%</Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">Q1 Product Launch:</Typography>
              <Typography variant="h3" fontWeight="bold" color="hsl(var(--primary))">82% Complete</Typography>
              <Box display="flex" alignItems="center" gap="4px" mt="8px">
                <Typography variant="body2" sx={{ opacity: 0.6 }}>Target: 100% by March 31</Typography>
                <ArrowUpRight size={14} color="hsl(var(--primary))" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* CURRENT STREAK */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Flame size={20} color="#f97316" />
              <Typography variant="h5" fontWeight="bold">Current Streak</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap="12px">
              <Box sx={{ position: "relative" }}>
                <Flame size={48} color="#f97316" fill="#f97316" style={{ opacity: 0.2 }} />
                <Typography 
                  variant="h1" 
                  sx={{ 
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)",
                    fontWeight: 800
                  }}
                >
                  24
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mt: "10px" }}>Day Streak</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" fontWeight="bold" mb="8px">Mini activity heat map</Typography>
              <HeatmapMock />
              <Typography variant="body2" sx={{ mt: "8px", opacity: 0.6 }}>Consistency is key!</Typography>
            </Box>
          </Box>
        </Box>

        {/* FOCUS TIME */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Clock size={20} color="hsl(var(--primary))" />
              <Typography variant="h5" fontWeight="bold">Focus Time</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>Today's Focus:</Typography>
              <Typography variant="h2" fontWeight="800">03h 45m</Typography>
              <Box display="flex" alignItems="center" gap="4px" mt="12px" color="hsl(var(--primary))">
                <ArrowUpRight size={16} />
                <Typography variant="body2">Yesterday: 03h 10m</Typography>
              </Box>
            </Box>
            <Box sx={{ width: "120px", height: "60px" }}>
              <LineChart isDashboard={true} />
            </Box>
          </Box>
        </Box>

        {/* ROW 2: TIMELINE & AI INSIGHTS */}

        {/* TIMELINE */}
        <Box gridColumn="span 8" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Typography variant="h4" fontWeight="bold">Timeline</Typography>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box sx={{ position: "relative", minHeight: "140px" }}>
            {/* Days row */}
            <Box display="flex" justifyContent="space-between" mb="20px" sx={{ opacity: 0.4 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <Typography key={day} variant="body2" fontWeight="bold">{day}</Typography>
              ))}
            </Box>
            {/* Task segments mockup */}
            <Box sx={{ position: "relative" }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  background: "hsla(var(--primary) / 0.1)", 
                  p: "8px 16px", 
                  borderRadius: "20px",
                  width: "fit-content",
                  border: "1px solid hsla(var(--primary) / 0.2)",
                  mb: "12px"
                }}
              >
                <Box 
                  sx={{ 
                    width: "16px", 
                    height: "16px", 
                    borderRadius: "50%", 
                    background: "hsl(var(--primary))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }} 
                >
                  <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
                </Box>
                <Typography variant="body2" fontWeight="bold">Q1 Product Task</Typography>
                <Avatar src="/assets/user.png" sx={{ width: 24, height: 24 }} />
              </Box>

              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  background: "hsla(var(--primary) / 0.1)", 
                  p: "8px 16px", 
                  borderRadius: "20px",
                  width: "fit-content",
                  border: "1px solid hsla(var(--primary) / 0.2)",
                  ml: "120px",
                  mb: "12px"
                }}
              >
                <Box sx={{ color: "hsl(var(--primary))" }}>✓</Box>
                <Typography variant="body2" fontWeight="bold">Completed items</Typography>
                <Avatar sx={{ width: 24, height: 24, bgcolor: "hsl(var(--primary))", fontSize: "10px" }}>JD</Avatar>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* AI INSIGHTS */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
            <Box display="flex" alignItems="center" gap="10px">
              <Sparkles size={20} color="hsl(var(--primary))" />
              <Typography variant="h5" fontWeight="bold">AI Insights</Typography>
            </Box>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box>
            <Box display="flex" alignItems="baseline" gap="8px">
              <Typography variant="h1" fontWeight="bold">12%</Typography>
              <Typography variant="h5" sx={{ opacity: 0.6 }}>Velocity Increase</Typography>
            </Box>
            <Box sx={{ height: "100px", mt: "10px" }}>
              <LineChart isDashboard={true} />
            </Box>
            <Typography variant="body2" sx={{ mt: "16px", opacity: 0.7 }}>
              Based on your recent activity, your productivity has surged this week.
            </Typography>
            <Button 
              sx={{ 
                mt: "16px", 
                textTransform: "none", 
                color: "hsl(var(--primary))",
                p: 0,
                "&:hover": { bgcolor: "transparent", opacity: 0.8 }
              }}
            >
              View Detailed Report
            </Button>
          </Box>
        </Box>

        {/* ROW 3: ACHIEVEMENTS & ACCOUNTABILITY */}

        {/* RECENT ACHIEVEMENTS */}
        <Box gridColumn="span 8" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Typography variant="h4" fontWeight="bold">Recent Achievements</Typography>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" gap="24px">
            {[
              { title: "Early Bird", desc: "Completed 5 tasks before 9 AM", icon: Trophy, color: "#94a3b8" },
              { title: "Goal Crusher", desc: "Exceeded weekly target by 20%", icon: Trophy, color: "#f59e0b" },
              { title: "Team Player", desc: "Collaborated on 3 major projects", icon: Trophy, color: "#0d9488" }
            ].map((achievement, i) => (
              <Box 
                key={i}
                display="flex" 
                alignItems="center" 
                gap="16px" 
                sx={{ 
                  flex: 1, 
                  p: "16px", 
                  borderRadius: "16px", 
                  bgcolor: "hsla(var(--primary) / 0.05)",
                  border: "1px solid hsla(var(--primary) / 0.1)"
                }}
              >
                <Box 
                  sx={{ 
                    width: "48px", 
                    height: "48px", 
                    borderRadius: "12px", 
                    bgcolor: achievement.color, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    color: "white"
                  }}
                >
                  <achievement.icon size={24} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="bold">{achievement.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.6 }}>{achievement.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ACCOUNTABILITY CIRCLE */}
        <Box gridColumn="span 4" className="glass-card" p="24px">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px">
            <Typography variant="h4" fontWeight="bold">Accountability Circle</Typography>
            <IconButton size="small"><MoreHorizontal size={18} /></IconButton>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap="12px">
              {team.slice(0, 3).map((member, i) => (
                <Box key={member.id} textAlign="center">
                  <Avatar 
                    src={i === 0 ? "/assets/user.png" : undefined}
                    sx={{ width: 48, height: 48, mb: "8px", border: "2px solid hsl(var(--primary))" }}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">{member.name.split(' ')[0]}</Typography>
                </Box>
              ))}
            </Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: "16px",
                p: "12px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                "&:hover": { bgcolor: "#f0f0f0" }
              }}
            >
              <RefreshCcw size={20} />
              <Typography variant="body2" fontWeight="bold">Schedule Sync</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
