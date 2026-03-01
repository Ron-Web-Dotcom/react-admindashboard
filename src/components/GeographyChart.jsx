import { useTheme, Box, CircularProgress } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import { blink } from "../lib/blink";

const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contacts = await blink.db.contacts.list();
        const cityToCountry = {
          "New York": "USA",
          "London": "GBR",
          "Paris": "FRA",
          "Tokyo": "JPN",
          "Berlin": "DEU",
          "Toronto": "CAN",
          "Sydney": "AUS"
        };

        const countryCounts = contacts.reduce((acc, contact) => {
          const country = cityToCountry[contact.city] || "USA";
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(countryCounts).map(([id, count]) => ({
          id,
          value: count * 100000,
        }));

        setData(chartData);
      } catch (error) {
        console.error("GeographyChart error:", error);
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
    <ResponsiveChoropleth
      data={data}
      theme={{
        axis: {
          domain: { line: { stroke: "transparent" } },
          legend: { text: { fill: colors.grey[300] } },
          ticks: {
            line: { stroke: "transparent" },
            text: { fill: colors.grey[300] },
          },
        },
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
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      colors={[
        "hsla(var(--primary) / 0.1)",
        "hsla(var(--primary) / 0.2)",
        "hsla(var(--primary) / 0.4)",
        "hsla(var(--primary) / 0.6)",
        "hsla(var(--primary) / 0.8)",
        "hsl(var(--primary))"
      ]}
      domain={[0, 1000000]}
      unknownColor="hsla(var(--primary) / 0.05)"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={0.5}
      borderColor="hsla(var(--background) / 0.5)"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;
