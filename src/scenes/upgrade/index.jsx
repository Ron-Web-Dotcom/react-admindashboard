import React, { useState } from "react";
import { Box, Typography, useTheme, Button, Paper, Divider, Chip } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { Check, Sparkles, Zap, Shield, Crown, Star } from "lucide-react";
import { useBlinkAuth } from "@blinkdotnew/react";
import { toast } from "react-hot-toast";

const Upgrade = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useBlinkAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Successfully upgraded to Ascend Elite!");
      setLoading(false);
    }, 1500);
  };

  return (
    <Box m="32px" className="animate-fade-in">
      <Header title="CHOOSE YOUR ASCENT" subtitle="Scale your enterprise intelligence with elite feature tiers" />

      <Box display="flex" justifyContent="center" mt="64px" gap="32px" flexWrap="wrap">
        {/* Free Plan */}
        <Paper
          className="glass-card"
          sx={{
            width: "380px",
            p: "48px",
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box sx={{ width: "64px", height: "64px", borderRadius: "20px", bgcolor: "hsla(var(--primary) / 0.05)", display: "flex", alignItems: "center", justifyContent: "center", mb: 3, color: "hsl(var(--primary))" }}>
            <Shield size={32} />
          </Box>
          <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: "-1px" }}>Standard</Typography>
          <Box display="flex" alignItems="baseline" mt={2} mb={1}>
            <Typography variant="h1" fontWeight="900" sx={{ fontSize: "56px" }}>$0</Typography>
            <Typography variant="h6" sx={{ opacity: 0.5, ml: 1 }}>/mo</Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: "bold" }}>Fundamental Sales Tools</Typography>
          
          <Divider sx={{ width: "100%", my: 4, opacity: 0.1 }} />
          
          <Box sx={{ width: "100%", mb: 5, display: "flex", flexDirection: "column", gap: 2.5 }}>
            {[
              "100 Lead Capacity",
              "Standard Pipeline View",
              "Basic Team Dashboard",
              "Community Support"
            ].map((feature, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  <Check size={14} strokeWidth={3} />
                </Box>
                <Typography variant="body2" fontWeight={500}>{feature}</Typography>
              </Box>
            ))}
          </Box>

          <Button 
            fullWidth
            disabled 
            variant="outlined" 
            sx={{ borderRadius: "14px", py: 1.5, fontWeight: "bold", border: "1px solid hsla(var(--primary) / 0.1)" }}
          >
            Current Plan
          </Button>
        </Paper>

        {/* Elite Plan */}
        <Paper
          className="glass-card glow-on-hover"
          sx={{
            width: "400px",
            p: "48px",
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            transform: "scale(1.05)",
            border: "2px solid hsl(var(--primary))",
            boxShadow: "0 30px 60px -20px hsla(var(--primary) / 0.2)"
          }}
        >
          <Box 
            sx={{ 
              position: "absolute", 
              top: 20, 
              right: -35, 
              bgcolor: "hsl(var(--primary))", 
              color: "white", 
              px: 6, 
              py: 0.5, 
              transform: "rotate(45deg)",
              fontWeight: "900",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            ELITE
          </Box>

          <Box sx={{ width: "64px", height: "64px", borderRadius: "20px", bgcolor: "hsl(var(--primary))", display: "flex", alignItems: "center", justifyContent: "center", mb: 3, color: "white", boxShadow: "0 10px 20px hsla(var(--primary) / 0.3)" }}>
            <Crown size={32} />
          </Box>
          <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: "-1px" }}>Elite AI</Typography>
          <Box display="flex" alignItems="baseline" mt={2} mb={1}>
            <Typography variant="h1" fontWeight="900" sx={{ fontSize: "56px", color: "hsl(var(--primary))" }}>$49</Typography>
            <Typography variant="h6" sx={{ opacity: 0.5, ml: 1 }}>/mo</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "hsl(var(--primary))", fontWeight: "bold" }}>Unlimited Enterprise Growth</Typography>
          
          <Divider sx={{ width: "100%", my: 4, opacity: 0.1 }} />
          
          <Box sx={{ width: "100%", mb: 5, display: "flex", flexDirection: "column", gap: 2.5 }}>
            {[
              "Unlimited Lead Scoring",
              "Predictive Revenue Engine",
              "Multi-tenant Hierarchy",
              "Priority AI Concierge",
              "Custom Workflow Triggers"
            ].map((feature, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  <Check size={14} strokeWidth={3} />
                </Box>
                <Typography variant="body2" fontWeight={700}>{feature}</Typography>
              </Box>
            ))}
          </Box>

          <Button 
            fullWidth
            onClick={handleUpgrade}
            disabled={loading}
            variant="contained" 
            sx={{ 
              borderRadius: "14px", 
              py: 2, 
              fontWeight: "900", 
              bgcolor: "hsl(var(--primary))", 
              color: "white",
              boxShadow: "0 10px 30px hsla(var(--primary) / 0.3)",
              "&:hover": { bgcolor: "hsl(var(--primary-glow))" }
            }}
          >
            {loading ? "Initializing..." : "Ascend to Elite"}
          </Button>
        </Paper>

        {/* Team Plan */}
        <Paper
          className="glass-card"
          sx={{
            width: "380px",
            p: "48px",
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box sx={{ width: "64px", height: "64px", borderRadius: "20px", bgcolor: "hsla(25 95% 53% / 0.05)", display: "flex", alignItems: "center", justifyContent: "center", mb: 3, color: "hsl(25 95% 53%)" }}>
            <Zap size={32} />
          </Box>
          <Typography variant="h3" fontWeight="800" sx={{ letterSpacing: "-1px" }}>Scale</Typography>
          <Box display="flex" alignItems="baseline" mt={2} mb={1}>
            <Typography variant="h1" fontWeight="900" sx={{ fontSize: "56px" }}>$99</Typography>
            <Typography variant="h6" sx={{ opacity: 0.5, ml: 1 }}>/mo</Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: "bold" }}>Maximum Velocity Squads</Typography>
          
          <Divider sx={{ width: "100%", my: 4, opacity: 0.1 }} />
          
          <Box sx={{ width: "100%", mb: 5, display: "flex", flexDirection: "column", gap: 2.5 }}>
            {[
              "Everything in Elite",
              "Advanced Team Analytics",
              "Anomaly Detection AI",
              "Dedicated Account Squad",
              "Custom Integrations"
            ].map((feature, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2}>
                <Box sx={{ p: 0.5, borderRadius: "50%", bgcolor: "hsla(25 95% 53% / 0.1)", color: "hsl(25 95% 53%)" }}>
                  <Check size={14} strokeWidth={3} />
                </Box>
                <Typography variant="body2" fontWeight={500}>{feature}</Typography>
              </Box>
            ))}
          </Box>

          <Button 
            fullWidth
            variant="outlined" 
            sx={{ borderRadius: "14px", py: 1.5, fontWeight: "bold", border: "1px solid hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
          >
            Contact Sales
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default Upgrade;
