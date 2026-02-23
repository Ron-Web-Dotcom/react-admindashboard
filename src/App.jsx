import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider, Box, Typography, Button } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import AIAgentChat from "./components/AIAgentChat";
import { useBlinkAuth } from "@blinkdotnew/react";
import { blink } from "./lib/blink";
import { Toaster } from "react-hot-toast";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { isAuthenticated, isLoading } = useBlinkAuth();
  const colors = tokens(theme.palette.mode);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h3">Loading...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          gap="20px"
          backgroundColor={theme.palette.background.default}
        >
          <Typography variant="h1" fontWeight="bold" color={colors.greenAccent[500]}>
            AdminBoard Pro
          </Typography>
          <Typography variant="h5" color={colors.grey[100]}>
            Please sign in to access your intelligent command center.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => blink.auth.login(window.location.href)}
            sx={{ padding: "10px 40px", fontSize: "18px", fontWeight: "bold" }}
          >
            Sign In
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
          <AIAgentChat />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
