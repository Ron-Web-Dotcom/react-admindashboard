import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  useTheme, 
  Paper, 
  TextField, 
  IconButton, 
  Button, 
  Chip, 
  Skeleton, 
  Avatar,
  AvatarGroup,
  Tooltip
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import { 
  Plus, 
  MoreVertical, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight,
  GripVertical
} from "lucide-react";
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
    const total = colTasks.reduce((acc, deal) => acc + (deal.amount || 0), 0);
    return total > 1000000 ? `${(total / 1000000).toFixed(1)}M` : `${(total / 1000).toFixed(0)}k`;
  };

  if (loading) return (
    <Box m="32px">
      <Skeleton variant="text" width="400px" height={80} />
      <Box display="flex" gap="24px" mt={4} sx={{ overflow: "hidden" }}>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rectangular" width="300px" height="600px" sx={{ borderRadius: "2rem" }} />)}
      </Box>
    </Box>
  );

  return (
    <Box m="32px" sx={{ height: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb="48px">
        <Header title="SALES PIPELINE" subtitle="Manage your high-velocity enterprise deals with visual precision" />
        <Box display="flex" gap="16px">
          <Button 
            variant="outlined" 
            startIcon={<Filter size={18} />} 
            sx={{ borderRadius: "14px", px: 3, py: 1.2, borderColor: "hsla(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}
          >
            Filter
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Plus size={20} />} 
            sx={{ borderRadius: "14px", px: 4, py: 1.2, bgcolor: "hsl(var(--primary))", boxShadow: "0 10px 20px -5px hsla(var(--primary) / 0.3)" }}
          >
            New Deal
          </Button>
        </Box>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box 
          display="flex" 
          gap="24px" 
          sx={{ 
            flexGrow: 1,
            overflowX: "auto", 
            pb: "32px",
            "&::-webkit-scrollbar": { height: "10px" },
            "&::-webkit-scrollbar-thumb": { bgcolor: "hsla(var(--primary) / 0.2)", borderRadius: "10px", border: "3px solid transparent", backgroundClip: "content-box" }
          }}
        >
          {Object.entries(columns).map(([stage, stageDeals]) => (
            <Box key={stage} sx={{ minWidth: "320px", flex: 1, display: "flex", flexDirection: "column" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb="24px" px="12px">
                <Box display="flex" alignItems="center" gap="12px">
                  <Typography variant="h4" fontWeight="800" sx={{ letterSpacing: "-0.5px" }}>{stage}</Typography>
                  <Box sx={{ px: "10px", py: "2px", bgcolor: "hsla(var(--primary) / 0.1)", borderRadius: "8px", fontSize: "12px", fontWeight: "900", color: "hsl(var(--primary))" }}>
                    {stageDeals.length}
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="800" sx={{ opacity: 0.4 }}>${calculateColumnTotal(stageDeals)}</Typography>
              </Box>

              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="glass-card"
                    sx={{
                      p: "16px",
                      flexGrow: 1,
                      minHeight: "500px",
                      background: snapshot.isDraggingOver ? "hsla(var(--primary) / 0.05)" : "hsla(var(--card))",
                      border: snapshot.isDraggingOver ? `2px dashed hsl(var(--primary))` : `1px solid hsla(var(--primary) / 0.08)`,
                      transition: "var(--transition-smooth)",
                      overflowY: "auto"
                    }}
                  >
                    {stageDeals.map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              p: "24px",
                              mb: "20px",
                              borderRadius: "20px",
                              bgcolor: snapshot.isDragging ? "white" : "white",
                              boxShadow: snapshot.isDragging ? "0 20px 50px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.03)",
                              border: `1px solid ${snapshot.isDragging ? "hsl(var(--primary))" : "hsla(var(--primary) / 0.05)"}`,
                              transform: snapshot.isDragging ? "rotate(2deg) scale(1.05)" : "none",
                              transition: "all 0.2s cubic-bezier(0.2, 0, 0.2, 1)",
                              position: "relative",
                              ...provided.draggableProps.style
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb="16px">
                              <Box display="flex" alignItems="center" gap={1}>
                                <GripVertical size={14} style={{ opacity: 0.2 }} />
                                <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: "-0.3px" }}>{deal.title}</Typography>
                              </Box>
                              <IconButton size="small" sx={{ bgcolor: "hsla(var(--primary) / 0.03)" }}><MoreVertical size={16} /></IconButton>
                            </Box>
                            
                            <Box display="flex" alignItems="center" gap="8px" mb="20px">
                              <Box sx={{ p: "6px", borderRadius: "8px", bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                                <DollarSign size={16} strokeWidth={3} />
                              </Box>
                              <Typography variant="h3" fontWeight="900" color="hsl(var(--primary))" sx={{ letterSpacing: "-1px" }}>
                                {deal.amount.toLocaleString()}
                              </Typography>
                            </Box>

                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box display="flex" alignItems="center" gap="12px">
                                <Tooltip title="Closing Date">
                                  <Box display="flex" alignItems="center" gap="6px" sx={{ opacity: 0.5 }}>
                                    <Clock size={14} />
                                    <Typography variant="caption" fontWeight="bold">MAR 28</Typography>
                                  </Box>
                                </Tooltip>
                                {deal.amount > 200000 && (
                                  <Chip 
                                    icon={<Sparkles size={12} />} 
                                    label="Priority" 
                                    size="small" 
                                    sx={{ bgcolor: "hsla(25 95% 53% / 0.1)", color: "hsl(25 95% 53%)", fontWeight: "bold", borderRadius: "6px", height: "20px", fontSize: "10px" }} 
                                  />
                                )}
                              </Box>
                              <AvatarGroup max={2}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: "10px", border: "2px solid white !important" }}>AC</Avatar>
                                <Avatar sx={{ width: 28, height: 28, fontSize: "10px", border: "2px solid white !important", bgcolor: "hsl(var(--primary))" }}>JS</Avatar>
                              </AvatarGroup>
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
