import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Collapse, IconButton } from "@mui/material";
import { tokens } from "../theme";
import { blink } from "../lib/blink";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

const AnomalyBanner = ({ dashboardData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [alert, setAlert] = useState("");
  const [open, setOpen] = useState(false);

  const checkAnomalies = async () => {
    if (!dashboardData?.invoices?.length) return;

    try {
      const summary = {
        totalRevenue: dashboardData.invoices.reduce((acc, curr) => acc + parseFloat(curr.cost || 0), 0),
        invoiceCount: dashboardData.invoices.length,
        recentTransactions: dashboardData.transactions.slice(0, 10),
        dates: dashboardData.invoices.map(i => i.date)
      };

      const { text } = await blink.ai.generateText({
        prompt: `Analyze this dashboard data for anomalies or urgent business risks (e.g. revenue spikes/drops, too many transactions in one day, suspicious costs). 
        If you find an anomaly, describe it in one short sentence. If everything looks normal, return "NORMAL".
        Data: ${JSON.stringify(summary)}`,
      });

      if (text !== "NORMAL") {
        setAlert(text);
        setOpen(true);
      }
    } catch (error) {
      console.error("Anomaly check failed:", error);
    }
  };

  useEffect(() => {
    checkAnomalies();
  }, [dashboardData.loading]);

  return (
    <Collapse in={open}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="10px 20px"
        backgroundColor={colors.redAccent[600]}
        borderRadius="4px"
        mb="20px"
      >
        <Box display="flex" alignItems="center" gap="10px">
          <WarningAmberIcon />
          <Typography variant="h6" fontWeight="600">
            {alert}
          </Typography>
        </Box>
        <IconButton onClick={() => setOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
    </Collapse>
  );
};

export default AnomalyBanner;
