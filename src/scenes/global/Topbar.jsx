import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { blink } from "../../lib/blink";
import { useState } from "react";
import { List, ListItem, ListItemText, Paper, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Topbar = ({ setIsSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
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
      // Fetch data and filter in memory for simple search
      const [team, contacts, invoices] = await Promise.all([
        blink.db.teams.list(),
        blink.db.contacts.list(),
        blink.db.invoices.list()
      ]);

      const filteredTeam = team.filter(i => i.name.toLowerCase().includes(value.toLowerCase())).slice(0, 3);
      const filteredContacts = contacts.filter(i => i.name.toLowerCase().includes(value.toLowerCase())).slice(0, 3);
      const filteredInvoices = invoices.filter(i => i.name.toLowerCase().includes(value.toLowerCase())).slice(0, 3);

      const results = [
        ...filteredTeam.map(i => ({ ...i, type: 'Team', link: '/team' })),
        ...filteredContacts.map(i => ({ ...i, type: 'Contact', link: '/contacts' })),
        ...filteredInvoices.map(i => ({ ...i, type: 'Invoice', link: '/invoices' }))
      ];

      setSearchResults(results);
      setAnchorEl(e.currentTarget);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" alignItems="center" gap="10px">
        <IconButton onClick={() => setIsSidebar((prev) => !prev)}>
          <MenuOutlinedIcon />
        </IconButton>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase 
            sx={{ ml: 2, flex: 1 }} 
            placeholder="Search..." 
            value={searchTerm}
            onChange={handleSearch}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Popover
          open={Boolean(anchorEl) && searchResults.length > 0}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          disableAutoFocus
          disableEnforceFocus
        >
          <Paper sx={{ width: "300px", maxHeight: "400px", overflow: "auto", backgroundColor: colors.primary[400] }}>
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
                >
                  <ListItemText 
                    primary={result.name} 
                    secondary={`${result.type} - ${result.email || ''}`}
                    primaryTypographyProps={{ color: colors.greenAccent[500] }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Popover>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => blink.auth.signOut()}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;