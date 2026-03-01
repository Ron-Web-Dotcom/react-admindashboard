import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme, Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { blink } from "../lib/blink";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teams = await blink.db.teams.list();
        const roleCounts = teams.reduce((acc, team) => {
          acc[team.access] = (acc[team.access] || 0) + 1;
          return acc;
        }, {});

        const colorMap = {
          admin: "hsl(var(--primary))",
          manager: "hsl(25 95% 53%)",
          user: "hsla(var(--primary) / 0.4)"
        };

        const chartData = Object.entries(roleCounts).map(([role, count]) => ({
          id: role,
          label: role.charAt(0).toUpperCase() + role.slice(1),
          value: count,
          color: colorMap[role] || "grey",
        }));

        setData(chartData);
      } catch (error) {
        console.error("PieChart error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <CircularProgress sx={{ color: "hsl(var(--primary))" }} />
    </Box>
  );

  return (
    <ResponsivePie
      data={data}
      theme={{
        legends: { text: { fill: colors.grey[300], fontWeight: "bold" } },
        tooltip: {
          container: {
            background: "hsla(var(--background) / 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid hsla(var(--primary) / 0.1)"
          }
        }
      }}
      margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
      innerRadius={0.75}
      padAngle={2}
      cornerRadius={12}
      activeOuterRadiusOffset={12}
      colors={{ datum: "data.color" }}
      borderWidth={0}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 50,
          itemsSpacing: 20,
          itemWidth: 80,
          itemHeight: 18,
          itemTextColor: colors.grey[300],
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 14,
          symbolShape: "circle",
        },
      ]}
    />
  );
};

export default PieChart;
