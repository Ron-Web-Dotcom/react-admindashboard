import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Paper, TextField, IconButton, Button, Chip, Skeleton, Avatar } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import { Plus, MoreVertical, DollarSign, Calendar as CalendarIcon, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDashboardData } from "../../hooks/useDashboardData";

const Pipeline = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useBlinkAuth();
  const { deals, organization, loading, refresh } = useDashboardData();
  const [columns, setColumns] = useState({
    "Prospecting": [],
    "Qualification": [],
    "Proposal": [],
    "Negotiation": [],
    "Closed Won": []
  });

  useEffect(() => {
    if (deals) {
      const organized = {
        "Prospecting": deals.filter(d => d.stage === "Prospecting"),
        "Qualification": deals.filter(d => d.stage === "Qualification"),
        "Proposal": deals.filter(d => d.stage === "Proposal"),
        "Negotiation": deals.filter(d => d.stage === "Negotiation"),
        "Closed Won": deals.filter(d => d.stage === "Closed Won")
      };
      setColumns(organized);
    }
  }, [deals]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = Array.from(columns[source.droppableId]);
    const destCol = Array.from(columns[destination.droppableId]);
    const [movedDeal] = sourceCol.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedDeal);
      setColumns({ ...columns, [source.droppableId]: sourceCol });
    } else {
      movedDeal.stage = destination.droppableId;
      destCol.splice(destination.index, 0, movedDeal);
      setColumns({
        ...columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol
      });

      try {
        await blink.db.deals.update(draggableId, { stage: destination.droppableId });
        toast.success(`Moved to ${destination.droppableId}`);
      } catch (error) {
        toast.error("Sync failed");
        refresh();
      }
    }
  };

  const calculateColumnTotal = (colTasks) => {
    return colTasks.reduce((acc, deal) => acc + (deal.amount || 0), 0).toLocaleString();
  };

  return (
    <Box m="20px 32px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="40px">
        <Header title="SALES PIPELINE" subtitle="Drag and drop deals to manage your revenue flow" />
        <Box display="flex" gap="12px">
          <Button variant="outlined" startIcon={<Filter size={18} />} sx={{ borderRadius: "12px", color: colors.grey[100], borderColor: colors.grey[800] }}>
            Filter
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "12px", px: 3 }}>
            New Deal
          </Button>
        </Box>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box 
          display="flex" 
          gap="20px" 
          sx={{ 
            overflowX: "auto", 
            pb: "20px",
            "&::-webkit-scrollbar": { height: "8px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "hsla(var(--primary) / 0.2)", borderRadius: "10px" }
          }}
        >
          {Object.entries(columns).map(([stage, stageDeals]) => (
            <Box key={stage} sx={{ minWidth: "300px", flex: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb="16px" px="8px">
                <Box display="flex" alignItems="center" gap="8px">
                  <Typography variant="h5" fontWeight="bold">{stage}</Typography>
                  <Chip label={stageDeals.length} size="small" sx={{ bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))", fontWeight: "bold" }} />
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.6 }}>${calculateColumnTotal(stageDeals)}</Typography>
              </Box>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      p: "12px",
                      minHeight: "600px",
                      borderRadius: "24px",
                      bgcolor: snapshot.isDraggingOver ? "hsla(var(--primary) / 0.05)" : "transparent",
                      border: `2px dashed ${snapshot.isDraggingOver ? "hsl(var(--primary))" : "transparent"}`,
                      transition: "var(--transition-smooth)"
                    }}
                  >
                    {stageDeals.map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="glass-card"
                            sx={{
                              p: "20px",
                              mb: "16px",
                              bgcolor: snapshot.isDragging ? "white" : "hsla(var(--glass-bg))",
                              transform: snapshot.isDragging ? "rotate(2deg)" : "none",
                              ...provided.draggableProps.style
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb="12px">
                              <Typography variant="h6" fontWeight="bold">{deal.title}</Typography>
                              <IconButton size="small"><MoreVertical size={16} /></IconButton>
                            </Box>
                            
                            <Box display="flex" alignItems="center" gap="4px" mb="16px">
                              <DollarSign size={14} color="hsl(var(--primary))" />
                              <Typography variant="h4" fontWeight="800" color="hsl(var(--primary))">{deal.amount.toLocaleString()}</Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box display="flex" alignItems="center" gap="6px">
                                <CalendarIcon size={14} style={{ opacity: 0.5 }} />
                                <Typography variant="body2" sx={{ opacity: 0.6 }}>Mar 24</Typography>
                              </Box>
                              <Avatar sx={{ width: 24, height: 24, fontSize: "10px", bgcolor: colors.blueAccent[500] }}>AC</Avatar>
                            </Box>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default Pipeline;
