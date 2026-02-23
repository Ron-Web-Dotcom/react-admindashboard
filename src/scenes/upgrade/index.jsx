import React, { useState } from "react";
import { Box, Typography, useTheme, Button, Paper, Divider } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import CheckIcon from '@mui/icons-material/Check';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useBlinkAuth } from "@blinkdotnew/react";
import { toast } from "react-hot-toast";

const Upgrade = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useBlinkAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Mock upgrade for now, in a real app this would call Stripe
    setTimeout(() => {
      toast.success("Successfully upgraded to AdminBoard Pro!");
      setLoading(false);
    }, 1500);
  };

  return (
    <Box m="20px">
      <Header title="UPGRADE TO PRO" subtitle="Unlock advanced AI features and higher limits" />

      <Box display="flex" justifyContent="center" mt="50px" gap="30px" flexWrap="wrap">
        {/* Free Plan */}
        <Paper
          elevation={3}
          sx={{
            width: "350px",
            p: "40px",
            backgroundColor: colors.primary[400],
            border: `1px solid ${colors.grey[800]}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography variant="h3" fontWeight="bold">Basic</Typography>
          <Typography variant="h1" fontWeight="bold" sx={{ mt: "20px" }}>$0</Typography>
          <Typography variant="h6" color={colors.grey[300]}>Free Forever</Typography>
          
          <Divider sx={{ width: "100%", my: "30px" }} />
          
          <Box sx={{ width: "100%", mb: "40px" }}>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>Standard Dashboard</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>Team Management</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>Basic AI Assistant</Typography>
            </Box>
          </Box>

          <Button 
            disabled 
            variant="outlined" 
            sx={{ color: colors.grey[100], borderColor: colors.grey[100] }}
          >
            Current Plan
          </Button>
        </Paper>

        {/* Pro Plan */}
        <Paper
          elevation={10}
          sx={{
            width: "350px",
            p: "40px",
            backgroundColor: colors.primary[400],
            border: `2px solid ${colors.greenAccent[500]}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative"
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "15px",
              right: "15px",
              backgroundColor: colors.greenAccent[500],
              px: "10px",
              py: "2px",
              borderRadius: "4px"
            }}
          >
            <Typography color={colors.primary[500]} fontWeight="bold">MOST POPULAR</Typography>
          </Box>

          <Typography variant="h3" fontWeight="bold">Pro</Typography>
          <Typography variant="h1" fontWeight="bold" sx={{ mt: "20px" }}>$29</Typography>
          <Typography variant="h6" color={colors.grey[300]}>Per month</Typography>
          
          <Divider sx={{ width: "100%", my: "30px" }} />
          
          <Box sx={{ width: "100%", mb: "40px" }}>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>All Basic Features</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>Advanced AI Forecasting</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>Unlimited AI Reports</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <CheckIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography>Team Anomaly Alerts</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap="10px" mb="15px">
              <PsychologyIcon sx={{ color: colors.greenAccent[500] }} />
              <Typography fontWeight="bold">Priority Support AI</Typography>
            </Box>
          </Box>

          <Button 
            onClick={handleUpgrade}
            disabled={loading}
            variant="contained" 
            color="secondary"
            sx={{ padding: "10px 40px", fontSize: "16px", fontWeight: "bold" }}
          >
            {loading ? "Processing..." : "Upgrade Now"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Upgrade;
