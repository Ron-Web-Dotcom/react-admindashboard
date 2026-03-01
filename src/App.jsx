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
import Upgrade from "./scenes/upgrade";
import Leads from "./scenes/leads";
import Pipeline from "./scenes/pipeline";
import { CssBaseline, ThemeProvider, Box, Typography, Button, useMediaQuery, Skeleton } from "@mui/material";
import { ColorModeContext, useMode, tokens } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import AIAgentChat from "./components/AIAgentChat";
import { useBlinkAuth } from "@blinkdotnew/react";
import { blink } from "./lib/blink";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");
  const { isAuthenticated, isLoading, user } = useBlinkAuth();
  const colors = tokens(theme.palette.mode);

  // Multi-tenant initialization logic
  useEffect(() => {
    const initTenant = async () => {
      if (isAuthenticated && user?.id) {
        // Check if user has an organization
        const userRec = await blink.db.users.get(user.id);
        if (!userRec?.organizationId) {
          // Auto-create or join default org for demo
          const defaultOrg = await blink.db.organizations.create({
            name: `${user.displayName}'s Workspace`,
            subscriptionTier: 'Pro',
          });
          
          const orgId = defaultOrg.id;
          
          await blink.db.users.update(user.id, { 
            organizationId: orgId,
            roleId: 'admin' 
          });

          // MIGRATE LEGACY DATA to the new organization for seamless transition
          const tables = ['teams', 'contacts', 'invoices', 'transactions', 'calendarEvents', 'faqs', 'kanbanTasks', 'chatMessages'];
          for (const table of tables) {
            try {
              await blink.db[table].updateMany({
                where: { userId: user.id },
                data: { organizationId: orgId }
              });
            } catch (err) {
              console.warn(`Migration skipped for ${table}:`, err);
            }
          }
        }
      }
    };
    initTenant();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isMobile) {
      setIsSidebar(false);
    } else {
      setIsSidebar(true);
    }
  }, [isMobile]);

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
        <Box display="flex" position="relative" height="100vh" overflow="hidden" sx={{ bgcolor: theme.palette.background.default }}>
          <Sidebar isSidebar={isSidebar} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Topbar setIsSidebar={setIsSidebar} />
            <Box flexGrow={1}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/kanban" element={<Pipeline />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/geography" element={<Geography />} />
              </Routes>
            </Box>
          </Box>
          <AIAgentChat />
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
