import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = "0.75", size = "100" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  
  return (
    <Box
      sx={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Box 
        className="three-d-ring"
        sx={{ 
          width: "100%", 
          height: "100%", 
          borderRadius: "50%", 
          background: `conic-gradient(hsl(var(--primary)) ${angle}deg, hsla(var(--primary) / 0.1) 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::after": {
            content: '""',
            width: "75%",
            height: "85%", // offset for 3D look
            borderRadius: "50%",
            background: "hsl(var(--background))",
            position: "absolute",
            boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)"
          }
        }} 
      />
      <Box 
        sx={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          zIndex: 1 
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          {Math.round(progress * 100)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressCircle;
