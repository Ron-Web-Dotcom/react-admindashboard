import { Box, IconButton, useTheme, InputBase, Typography, Avatar, Badge, Popover, Paper, List, ListItem, ListItemText } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Menu as MenuIcon,
  Moon,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBlinkAuth } from "@blinkdotnew/react";
import { blink } from "../../lib/blink";

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const { user } = useBlinkAuth();
  
  const [searchTerm, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.length < 2) {
      setSearchResults([]);
      setAnchorEl(null);
      return;
    }

    try {
      const [team, contacts, invoices] = await Promise.all([
        blink.db.teams.list(),
        blink.db.contacts.list(),
        blink.db.invoices.list()
      ]);

      const results = [
        ...team.filter(i => i.name.toLowerCase().includes(value.toLowerCase())).map(i => ({ ...i, type: 'Team', link: '/team' })),
        ...contacts.filter(i => i.name.toLowerCase().includes(value.toLowerCase())).map(i => ({ ...i, type: 'Contact', link: '/contacts' })),
        ...invoices.filter(i => i.name.toLowerCase().includes(value.toLowerCase())).map(i => ({ ...i, type: 'Invoice', link: '/invoices' }))
      ].slice(0, 8);

      setSearchResults(results);
      setAnchorEl(e.currentTarget);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p="20px 32px">
      {/* SEARCH BAR */}
      <Box display="flex" alignItems="center" gap="16px" flex={1}>
        <IconButton onClick={() => setIsSidebar((prev) => !prev)} sx={{ color: colors.grey[100] }}>
          <MenuIcon size={24} />
        </IconButton>
        
        <Box
          className="glass-card"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "400px",
            height: "48px",
            padding: "0 20px",
            borderRadius: "24px",
            boxShadow: "none",
            border: "1px solid hsla(var(--glass-border))"
          }}
        >
          <Search size={20} color={colors.grey[300]} />
          <InputBase 
            sx={{ ml: 2, flex: 1, color: colors.grey[100], fontSize: "14px" }} 
            placeholder="Search goals, tasks, or resources..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </Box>

        <Popover
          open={Boolean(anchorEl) && searchResults.length > 0}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          disableAutoFocus
          disableEnforceFocus
          PaperProps={{
            sx: {
              mt: "12px",
              width: "400px",
              borderRadius: "16px",
              background: "hsla(var(--glass-bg))",
              backdropFilter: "blur(16px)",
              border: "1px solid hsla(var(--glass-border))",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
            }
          }}
        >
          <List>
            {searchResults.map((result, idx) => (
              <ListItem 
                button 
                key={`${result.id}-${idx}`}
                onClick={() => {
                  navigate(result.link);
                  setAnchorEl(null);
                  setSearchInput("");
                }}
                sx={{ borderRadius: "8px", margin: "4px 8px" }}
              >
                <ListItemText 
                  primary={result.name} 
                  secondary={`${result.type} • ${result.email || ''}`}
                  primaryTypographyProps={{ fontWeight: 600, color: "hsl(var(--primary))" }}
                />
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>

      {/* ACTION ICONS & USER PROFILE */}
      <Box display="flex" alignItems="center" gap="12px">
        <IconButton 
          className="glass-card" 
          onClick={colorMode.toggleColorMode}
          sx={{ width: "44px", height: "44px", borderRadius: "12px" }}
        >
          {theme.palette.mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>

        <IconButton 
          className="glass-card" 
          sx={{ width: "44px", height: "44px", borderRadius: "12px", background: "hsla(171 77% 31% / 0.1) !important" }}
        >
          <Badge variant="dot" overlap="circular" color="success">
            <Bell size={20} color="hsl(var(--primary))" />
          </Badge>
        </IconButton>

        <IconButton 
          className="glass-card" 
          sx={{ width: "44px", height: "44px", borderRadius: "12px" }}
        >
          <Settings size={20} />
        </IconButton>

        <Box display="flex" alignItems="center" gap="12px" ml="8px">
          <Box textAlign="right">
            <Typography variant="h6" fontWeight="bold" color={colors.grey[100]} sx={{ lineHeight: 1.2 }}>
              {user?.displayName || "Alex Chen"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              Pro Member
            </Typography>
          </Box>
          <Avatar 
            src="/assets/user.png" 
            sx={{ width: 44, height: 44, borderRadius: "12px", cursor: "pointer" }} 
            onClick={() => navigate("/form")}
          />
          <IconButton onClick={() => blink.auth.signOut()}>
            <LogOut size={20} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
