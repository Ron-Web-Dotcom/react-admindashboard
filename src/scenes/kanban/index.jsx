import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Paper, TextField, IconButton, Button, CircularProgress } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
      <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
        <CircularProgress sx={{ color: colors.greenAccent[500] }} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="KANBAN BOARD" subtitle="Manage your tasks with drag and drop" />

      {/* Add Task Form */}
      <Box component="form" onSubmit={handleAddTask} display="flex" gap="10px" mb="30px">
        <TextField
          fullWidth
          variant="filled"
          placeholder="New task content..."
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
        />
        <Button 
          type="submit" 
          color="secondary" 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ minWidth: "120px" }}
        >
          Add Task
        </Button>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
          {Object.entries(tasks).map(([colId, colTasks]) => (
            <Box key={colId}>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: "15px", textTransform: "capitalize" }}>
                {colId.replace("_", " ")} ({colTasks.length})
              </Typography>
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <Paper
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      p: "15px",
                      minHeight: "500px",
                      backgroundColor: snapshot.isDraggingOver ? colors.primary[500] : colors.primary[400],
                      border: `1px solid ${colors.grey[800]}`
                    }}
                  >
                    {colTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={3}
                            sx={{
                              p: "15px",
                              mb: "15px",
                              backgroundColor: snapshot.isDragging ? colors.greenAccent[700] : colors.primary[600],
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              ...provided.draggableProps.style
                            }}
                          >
                            <Typography>{task.content}</Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteTask(task.id, colId)}
                              sx={{ color: colors.redAccent[500] }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Paper>
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
