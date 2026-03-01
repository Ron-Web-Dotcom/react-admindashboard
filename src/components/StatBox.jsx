import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatBox = ({ title, value, icon, increase, description }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isPositive = increase?.startsWith('+');

  return (
    <Box 
      className="glass-card" 
      sx={{ 
        p: "24px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "12px",
        minHeight: "180px",
        justifyContent: "space-between"
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box 
          sx={{ 
            p: "10px", 
            borderRadius: "12px", 
            bgcolor: "hsla(var(--primary) / 0.05)", 
            color: "hsl(var(--primary))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {icon}
        </Box>
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "4px", 
            p: "4px 8px", 
            borderRadius: "8px", 
            bgcolor: isPositive ? "hsla(142 76% 36% / 0.1)" : "hsla(0 100% 50% / 0.1)",
            color: isPositive ? "hsl(142 76% 36%)" : "#ef4444",
          }}
        >
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <Typography variant="h6" fontWeight="bold">{increase}</Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ opacity: 0.6, fontWeight: 500, mb: "4px" }}>
          {title}
        </Typography>
        <Typography variant="h1" sx={{ fontWeight: 800, fontSize: "32px", letterSpacing: "-1px" }}>
          {value}
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 500 }}>
        {description}
      </Typography>
    </Box>
  );
};

export default StatBox;
