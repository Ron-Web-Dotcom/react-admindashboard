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
      {/* LEFT: Menu Toggle */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={() => setIsSidebar((prev) => !prev)} sx={{ color: theme.palette.text.primary }}>
          <MenuIcon size={24} />
        </IconButton>
      </Box>

      {/* CENTER: Search Bar */}
      <Box display="flex" justifyContent="center" flex={1} px="24px">
        <Box
          className="glass-card"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "600px",
            height: "56px",
            padding: "0 24px",
            borderRadius: "28px",
            boxShadow: "none",
            border: "1px solid hsla(var(--glass-border))",
            bgcolor: "hsla(var(--glass-bg))"
          }}
        >
          <Search size={20} color={colors.grey[300]} />
          <InputBase 
            sx={{ ml: 2, flex: 1, color: theme.palette.text.primary, fontSize: "16px" }} 
            placeholder="Search goals, tasks, or resources..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </Box>
      </Box>

      {/* RIGHT: Actions & Profile */}
      <Box display="flex" alignItems="center" gap="16px">
        <IconButton 
          className="glass-card" 
          onClick={colorMode.toggleColorMode}
          sx={{ width: "48px", height: "48px", borderRadius: "14px", border: "1px solid hsla(var(--glass-border))" }}
        >
          {theme.palette.mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </IconButton>

        <IconButton 
          className="glass-card" 
          sx={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "14px", 
            background: "hsla(171 77% 31% / 0.08) !important",
            border: "1px solid hsla(var(--glass-border))"
          }}
        >
          <Badge variant="dot" overlap="circular" color="success">
            <Bell size={20} color="hsl(var(--primary))" />
          </Badge>
        </IconButton>

        <IconButton 
          className="glass-card" 
          sx={{ width: "48px", height: "48px", borderRadius: "14px", border: "1px solid hsla(var(--glass-border))" }}
        >
          <Settings size={20} />
        </IconButton>

        <Box display="flex" alignItems="center" gap="12px" ml="12px">
          <Box textAlign="right">
            <Typography variant="h6" fontWeight="bold" color={theme.palette.text.primary} sx={{ lineHeight: 1.2 }}>
              {user?.displayName || "Alex Chen"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6, color: theme.palette.text.primary }}>
              Pro Member
            </Typography>
          </Box>
          <Avatar 
            src="/assets/user.png" 
            sx={{ width: 48, height: 48, borderRadius: "14px", cursor: "pointer", border: "2px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
            onClick={() => navigate("/form")}
          />
          <IconButton onClick={() => blink.auth.signOut()} sx={{ color: theme.palette.text.primary }}>
            <LogOut size={20} />
          </IconButton>
        </Box>
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
  );
};

export default Topbar;
