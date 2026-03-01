import { useTheme, Box, CircularProgress } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { blink } from "../lib/blink";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await blink.db.transactions.list();
        const userSpendMap = transactions.reduce((acc, tx) => {
          const user = tx.userName || "Unknown";
          acc[user] = (acc[user] || 0) + (tx.cost || 0);
          return acc;
        }, {});

        const chartData = Object.entries(userSpendMap)
          .map(([userName, total]) => ({
            userName,
            total,
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5);

        setData(chartData);
      } catch (error) {
        console.error("BarChart error:", error);
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
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: "transparent" } },
          legend: { text: { fill: colors.grey[300], fontSize: 10, fontWeight: "bold" } },
          ticks: {
            line: { stroke: "transparent" },
            text: { fill: colors.grey[300], fontSize: 10 },
          },
        },
        grid: {
          line: { stroke: "hsla(var(--primary) / 0.05)", strokeWidth: 1 }
        },
        legends: { text: { fill: colors.grey[300] } },
        tooltip: {
          container: {
            background: "hsla(var(--background) / 0.95)",
            backdropFilter: "blur(10px)",
            color: colors.grey[100],
            borderRadius: "12px",
            border: "1px solid hsla(var(--primary) / 0.1)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }
        }
      }}
      keys={["total"]}
      indexBy="userName"
      margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={["hsl(var(--primary))"]}
      borderRadius={8}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 15,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Agent Name",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 15,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Revenue Captured",
        legendPosition: "middle",
        legendOffset: -50,
      }}
      enableLabel={false}
      role="application"
    />
  );
};

export default BarChart;
