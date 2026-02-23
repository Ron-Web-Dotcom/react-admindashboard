import { ResponsiveLine } from "@nivo/line";
import { useTheme, Box, CircularProgress, Button, Typography } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { blink } from "../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import PsychologyIcon from '@mui/icons-material/Psychology';

const LineChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, isAuthenticated } = useBlinkAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForecast, setShowForecast] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchRevenueData = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setLoading(true);
    try {
      const transactions = await blink.db.transactions.list({
        orderBy: { date: 'asc' }
      });

      // Group by date
      const grouped = transactions.reduce((acc, curr) => {
        const date = curr.date;
        acc[date] = (acc[date] || 0) + parseFloat(curr.cost || 0);
        return acc;
      }, {});

      const chartData = [
        {
          id: "revenue",
          color: colors.greenAccent[500],
          data: Object.entries(grouped).map(([x, y]) => ({ x, y }))
        }
      ];

      setData(chartData);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async () => {
    if (showForecast) {
      setData(prev => prev.filter(s => s.id !== "forecast"));
      setShowForecast(false);
      return;
    }

    setIsAiLoading(true);
    try {
      const currentRevenue = data[0].data;
      const { object } = await blink.ai.generateObject({
        prompt: `Predict the next 3 data points for revenue based on this historical data: ${JSON.stringify(currentRevenue)}. 
        Provide logical estimates for the future x values (dates) and y values (revenue).`,
        schema: {
          type: "object",
          properties: {
            forecastPoints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  x: { type: "string" },
                  y: { type: "number" }
                }
              }
            }
          },
          required: ["forecastPoints"]
        }
      });

      const forecastSerie = {
        id: "forecast",
        color: colors.redAccent[500],
        data: [
          currentRevenue[currentRevenue.length - 1], // Connect to last real point
          ...object.forecastPoints
        ]
      };

      setData(prev => [...prev, forecastSerie]);
      setShowForecast(true);
    } catch (error) {
      console.error("Forecast failed:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress sx={{ color: colors.greenAccent[500] }} />
      </Box>
    );
  }

  return (
    <Box height="100%" width="100%" position="relative">
      <Box position="absolute" top="-40px" right="0" display="flex" alignItems="center" gap="10px">
        <Button
          size="small"
          onClick={handleForecast}
          disabled={isAiLoading}
          startIcon={isAiLoading ? <CircularProgress size={16} /> : <PsychologyIcon />}
          sx={{ 
            color: showForecast ? colors.redAccent[500] : colors.greenAccent[500],
            backgroundColor: `${showForecast ? colors.redAccent[500] : colors.greenAccent[500]}11`
          }}
        >
          {showForecast ? "Hide Forecast" : "Predict Future Revenue"}
        </Button>
      </Box>

      <ResponsiveLine
        data={data}
        theme={{
          axis: {
            domain: { line: { stroke: colors.grey[100] } },
            legend: { text: { fill: colors.grey[100] } },
            ticks: {
              line: { stroke: colors.grey[100], strokeWidth: 1 },
              text: { fill: colors.grey[100] },
            },
          },
          legends: { text: { fill: colors.grey[100] } },
          tooltip: { container: { color: colors.primary[500] } },
        }}
        colors={data.map(d => d.color)}
        margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 3,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
};

export default LineChart;
