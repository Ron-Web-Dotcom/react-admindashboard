import { useState } from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import { 
  LayoutDashboard, 
  Target, 
  CalendarRange, 
  BarChart3, 
  Users, 
  BookOpen,
  ChevronRight,
  UserPlus,
  Briefcase,
  Zap,
  Settings as SettingsIcon,
  Menu,
  X
} from "lucide-react";
import { useBlinkAuth } from "@blinkdotnew/react";

const NavItem = ({ title, to, icon: Icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSelected = selected === to;

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Box
        onClick={() => setSelected(to)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 24px",
          margin: "4px 16px",
          borderRadius: "12px",
          cursor: "pointer",
          background: isSelected 
            ? "linear-gradient(90deg, hsla(var(--primary) / 0.2) 0%, transparent 100%)" 
            : "transparent",
          borderLeft: isSelected ? `4px solid hsl(var(--primary))` : "4px solid transparent",
          color: isSelected ? "hsl(var(--primary))" : colors.grey[300],
          transition: "var(--transition-smooth)",
          "&:hover": {
            background: "hsla(var(--primary) / 0.1)",
            color: "hsl(var(--primary))",
          }
        }}
      >
        <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
        <Typography variant="h6" fontWeight={isSelected ? 600 : 500}>
          {title}
        </Typography>
      </Box>
    </Link>
  );
};

const Sidebar = ({ isSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [selected, setSelected] = useState(location.pathname);
  const { user } = useBlinkAuth();

  return (
    <Box
      sx={{
        width: isSidebar ? "280px" : "0",
        height: "100vh",
        transition: "var(--transition-smooth)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        position: { xs: "fixed", md: "relative" },
        bgcolor: theme.palette.mode === "dark" ? "hsl(var(--secondary))" : "white",
        borderRight: `1px solid hsla(var(--primary) / 0.1)`,
      }}
    >
      {/* LOGO */}
      <Box p="40px 32px" display="flex" alignItems="center" gap="16px">
        <Box 
          sx={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "12px", 
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 8px 16px hsla(var(--primary) / 0.3)"
          }}
        >
          <Target size={24} strokeWidth={3} />
        </Box>
        <Typography variant="h1" fontWeight="800" color="hsl(var(--primary))" sx={{ letterSpacing: "-2px", fontSize: "32px" }}>
          Ascend
        </Typography>
      </Box>

      {/* MENU ITEMS */}
      <Box flexGrow={1} mt="10px">
        <NavItem
          title="Dashboard"
          to="/"
          icon={LayoutDashboard}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Leads Hub"
          to="/leads"
          icon={UserPlus}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Pipeline"
          to="/kanban"
          icon={Briefcase}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Workflows"
          to="/automation"
          icon={Zap}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Timeline"
          to="/calendar"
          icon={CalendarRange}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Analytics"
          to="/line"
          icon={BarChart3}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Team"
          to="/team"
          icon={Users}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Resources"
          to="/faq"
          icon={BookOpen}
          selected={selected}
          setSelected={setSelected}
        />
        <NavItem
          title="Settings"
          to="/upgrade" // Reusing upgrade for settings/billing demo
          icon={SettingsIcon}
          selected={selected}
          setSelected={setSelected}
        />
      </Box>

      {/* UPGRADE CARD */}
      <Box p="24px" m="16px" sx={{ position: "relative" }}>
        <Box
          sx={{
            padding: "20px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            color: "white",
            overflow: "hidden"
          }}
        >
          {/* Holographic effect mockup */}
          <Box 
            sx={{ 
              position: "absolute", 
              top: "-50%", 
              left: "-50%", 
              width: "200%", 
              height: "200%", 
              background: "radial-gradient(circle, rgba(13,148,136,0.2) 0%, transparent 70%)",
              pointerEvents: "none"
            }} 
          />
          
          <Typography variant="h4" fontWeight="bold" mb="8px">
            Upgrade to Ascend+
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, mb: "16px" }}>
            Unlock Elite Features
          </Typography>
          
          <Link to="/upgrade" style={{ textDecoration: "none" }}>
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between"
              sx={{ color: "white", cursor: "pointer", "&:hover": { opacity: 0.8 } }}
            >
              <Typography fontWeight="bold">Learn More</Typography>
              <ChevronRight size={18} />
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
