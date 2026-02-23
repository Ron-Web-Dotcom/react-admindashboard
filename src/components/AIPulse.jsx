import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Paper, Button, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import { blink } from "../lib/blink";
import PsychologyIcon from '@mui/icons-material/Psychology';

const AIPulse = ({ dashboardData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pulse, setPulse] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePulse = async () => {
    if (!dashboardData?.team?.length) return;
    
    setLoading(true);
    try {
      const summary = {
        totalTeamMembers: dashboardData.team.length,
        totalInvoices: dashboardData.invoices.length,
        totalRevenue: dashboardData.invoices.reduce((acc, curr) => acc + parseFloat(curr.cost || 0), 0).toFixed(2),
        recentTransactions: dashboardData.transactions.slice(0, 5),
        overdueInvoices: dashboardData.invoices.filter(inv => new Date(inv.date) < new Date()).length
      };

      const systemPrompt = `You are an expert business analyst and dashboard advisor. 
Analyze the provided dashboard data and generate a concise, insightful "Pulse" summary.
Identify trends, potential risks, and highlights.
Be specific but brief (2-3 sentences max).
Use professional yet conversational tone.`;

      const { text } = await blink.ai.generateText({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the current dashboard summary: ${JSON.stringify(summary)}` }
        ]
      });

      setPulse(text);
    } catch (error) {
      console.error("Failed to generate AI Pulse:", error);
      setPulse("Could not generate AI pulse. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePulse();
  }, [dashboardData.loading]);

  return (
    <Paper
      elevation={3}
      sx={{
        gridColumn: "span 12",
        backgroundColor: colors.primary[400],
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: `1px solid ${colors.greenAccent[500]}22`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <Box display="flex" alignItems="center" gap="10px">
        <PsychologyIcon sx={{ color: colors.greenAccent[500], fontSize: "28px" }} />
        <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
          AI Pulse Insight
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} sx={{ color: colors.greenAccent[500] }} />
        </Box>
      ) : (
        <Typography variant="body1" color={colors.grey[100]} sx={{ fontStyle: pulse ? "normal" : "italic", opacity: pulse ? 1 : 0.7 }}>
          {pulse || "Analyzing dashboard pulse..."}
        </Typography>
      )}

      {!loading && pulse && (
        <Button 
          size="small" 
          onClick={generatePulse}
          sx={{ alignSelf: "flex-end", color: colors.greenAccent[500], mt: 1 }}
        >
          Refresh Insight
        </Button>
      )}
    </Paper>
  );
};

export default AIPulse;
