import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Paper, TextField, IconButton, Button, CircularProgress, Skeleton } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import { Plus, Trash2, GripVertical, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { toast } from "react-hot-toast";

const Kanban = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, isAuthenticated } = useBlinkAuth();
  const [tasks, setTasks] = useState({
    todo: [],
    in_progress: [],
    done: []
  });
  const [loading, setLoading] = useState(true);
  const [newTaskContent, setNewTaskContent] = useState("");

  const fetchTasks = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await blink.db.kanbanTasks.list();
      const organized = {
        todo: data.filter(t => t.status === 'todo'),
        in_progress: data.filter(t => t.status === 'in_progress'),
        done: data.filter(t => t.status === 'done')
      };
      setTasks(organized);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated]);

  // Real-time sync
  useEffect(() => {
    if (!user?.id) return;

    let channel = null;
    const initRealtime = async () => {
      channel = blink.realtime.channel('kanban-sync');
      await channel.subscribe({ userId: user.id });
      
      channel.onMessage((msg) => {
        if (msg.type === 'task_moved' || msg.type === 'task_added' || msg.type === 'task_deleted') {
          fetchTasks(); // Refresh data on any change
        }
      });
    };

    initRealtime();
    return () => { channel?.unsubscribe(); };
  }, [user?.id]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = Array.from(tasks[source.droppableId]);
    const destCol = Array.from(tasks[destination.droppableId]);
    const [movedTask] = sourceCol.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCol.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [source.droppableId]: sourceCol });
    } else {
      movedTask.status = destination.droppableId;
      destCol.splice(destination.index, 0, movedTask);
      setTasks({
        ...tasks,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol
      });

      // Update in DB
      try {
        await blink.db.kanbanTasks.update(draggableId, { status: destination.droppableId });
        // Notify others
        const channel = blink.realtime.channel('kanban-sync');
        await channel.publish('task_moved', { taskId: draggableId, status: destination.droppableId }, { userId: user.id });
      } catch (error) {
        console.error("Failed to update task status:", error);
        toast.error("Failed to sync change");
      }
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskContent.trim() || !user?.id) return;

    try {
      const newTask = {
        id: `task_${Date.now()}`,
        userId: user.id,
        content: newTaskContent,
        status: "todo"
      };
      await blink.db.kanbanTasks.create(newTask);
      
      // Notify others
      const channel = blink.realtime.channel('kanban-sync');
      await channel.publish('task_added', newTask, { userId: user.id });

      setTasks({ ...tasks, todo: [...tasks.todo, newTask] });
      setNewTaskContent("");
      toast.success("Task added!");
    } catch (error) {
      console.error("Failed to add task:", error);
      toast.error("Failed to add task");
    }
  };

  const handleDeleteTask = async (id, status) => {
    try {
      await blink.db.kanbanTasks.delete(id);
      
      // Notify others
      const channel = blink.realtime.channel('kanban-sync');
      await channel.publish('task_deleted', { id }, { userId: user.id });

      setTasks({
        ...tasks,
        [status]: tasks[status].filter(t => t.id !== id)
      });
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <Box m="20px">
        <Skeleton variant="text" width="300px" height={60} />
        <Skeleton variant="text" width="200px" height={30} sx={{ mb: 4 }} />
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" height={500} sx={{ borderRadius: "2rem" }} />
          ))}
        </Box>
      </Box>
    );
  }

  const getColIcon = (colId) => {
    switch(colId) {
      case 'todo': return <Clock size={18} color={colors.grey[300]} />;
      case 'in_progress': return <PlayCircle size={18} color="#3b82f6" />;
      case 'done': return <CheckCircle2 size={18} color="hsl(var(--primary))" />;
      default: return null;
    }
  };

  return (
    <Box m="20px">
      <Header title="WORKFLOW" subtitle="Dynamic task management pipeline" />

      {/* Add Task Form */}
      <Box 
        component="form" 
        onSubmit={handleAddTask} 
        display="flex" 
        gap="12px" 
        mb="40px"
        className="glass-card"
        p="12px 20px"
        sx={{ border: `1px solid hsla(var(--primary) / 0.1)`, maxWidth: "800px" }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="What needs to be done?"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          InputProps={{ disableUnderline: true, sx: { fontSize: "16px", py: 1 } }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          startIcon={<Plus size={18} />}
          sx={{ 
            borderRadius: "12px", 
            px: 3,
            bgcolor: "hsl(var(--primary))",
            "&:hover": { bgcolor: "hsl(var(--primary-glow))" }
          }}
        >
          Add
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="24px">
          {Object.entries(tasks).map(([colId, colTasks]) => (
            <Box key={colId}>
              <Box display="flex" alignItems="center" gap="10px" mb="20px" ml="10px">
                {getColIcon(colId)}
                <Typography variant="h4" fontWeight="800" sx={{ textTransform: "capitalize", letterSpacing: "-0.5px" }}>
                  {colId.replace("_", " ")}
                </Typography>
                <Box sx={{ px: "8px", py: "2px", bgcolor: "hsla(var(--primary) / 0.1)", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", color: "hsl(var(--primary))" }}>
                  {colTasks.length}
                </Box>
              </Box>
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="glass-card"
                    sx={{
                      p: "20px",
                      minHeight: "600px",
                      background: snapshot.isDraggingOver ? "hsla(var(--primary) / 0.05)" : "hsla(var(--glass-bg))",
                      border: snapshot.isDraggingOver ? `2px dashed hsl(var(--primary))` : `1px solid hsla(var(--glass-border))`,
                      transition: "background 0.2s ease"
                    }}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={snapshot.isDragging ? 10 : 0}
                            sx={{
                              p: "20px",
                              mb: "16px",
                              borderRadius: "16px",
                              backgroundColor: snapshot.isDragging ? "white" : "hsla(var(--primary) / 0.03)",
                              border: `1px solid ${snapshot.isDragging ? "hsl(var(--primary))" : "hsla(var(--primary) / 0.08)"}`,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              transition: "all 0.3s ease",
                              ...provided.draggableProps.style
                            }}
                          >
                            <Box display="flex" alignItems="center" gap="12px">
                              <GripVertical size={18} style={{ opacity: 0.3 }} />
                              <Typography variant="h6" fontWeight="600">{task.content}</Typography>
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteTask(task.id, colId)}
                              sx={{ 
                                color: colors.redAccent[400],
                                opacity: 0,
                                ".MuiPaper-root:hover &": { opacity: 1 },
                                transition: "opacity 0.2s"
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
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

export default Kanban;
