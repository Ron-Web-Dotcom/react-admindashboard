import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, useTheme, IconButton, Paper, TextField, InputAdornment, Collapse, CircularProgress } from "@mui/material";
import { tokens } from "../theme";
import SearchIcon from "@mui/icons-material/Search";
import { useAgent, Agent, dbTools, useBlinkAuth } from "@blinkdotnew/react";
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { blink } from "../lib/blink";

const dataAgent = new Agent({
  model: "google/gemini-3-flash",
  system: `You are an expert AI data assistant for an Admin Dashboard. 
You have access to the dashboard's database through the db_list tool.
Tables available:
- teams: id, name, email, age, phone, access, user_id
- contacts: id, name, email, age, phone, address, city, zip_code, registrar_id, user_id
- invoices: id, name, email, cost, phone, date, user_id
- transactions: id, tx_id, user_name, date, cost, user_id

Instructions:
1. When asked a question, use db_list to fetch the relevant data.
2. Provide concise, clear answers.
3. If users ask for summaries, calculate them based on the data you fetch.
4. If you don't know the answer, say so.
5. Always remind users you are looking at their real-time dashboard data.`,
  tools: [...dbTools],
  maxSteps: 10
});

const AIAgentChat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useBlinkAuth();
  const scrollRef = useRef(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    clearMessages,
    setMessages
  } = useAgent({ 
    agent: dataAgent,
    onFinish: async (message) => {
      if (user?.id) {
        // Save assistant message
        await blink.db.chatMessages.create({
          id: `msg_${Date.now()}_assistant`,
          userId: user.id,
          role: "assistant",
          content: message.content
        });
      }
    }
  });

  const loadHistory = async () => {
    if (!user?.id) return;
    setIsHistoryLoading(true);
    try {
      const history = await blink.db.chatMessages.list({
        orderBy: { createdAt: 'asc' },
        limit: 50
      });
      if (history.length > 0) {
        setMessages(history.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content
        })));
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user?.id) return;
    if (window.confirm("Clear all chat history?")) {
      await blink.db.chatMessages.deleteMany({
        where: { userId: user.id }
      });
      clearMessages();
    }
  };

  const onUserSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user?.id) return;

    const userMessageContent = input;
    // Save user message
    await blink.db.chatMessages.create({
      id: `msg_${Date.now()}_user`,
      userId: user.id,
      role: "user",
      content: userMessageContent
    });

    handleSubmit(e);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
      <Collapse in={isOpen}>
        <Paper
          elevation={10}
          sx={{
            width: "350px",
            height: "500px",
            backgroundColor: colors.primary[400],
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${colors.greenAccent[500]}66`,
            borderRadius: "15px",
            mb: 2,
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: colors.greenAccent[500],
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box display="flex" alignItems="center" gap="10px">
              <PsychologyIcon sx={{ color: colors.primary[500] }} />
              <Typography variant="h6" color={colors.primary[500]} fontWeight="bold">
                Admin AI Assistant
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleClearHistory} size="small" sx={{ color: colors.primary[500] }}>
                <DeleteOutlineIcon />
              </IconButton>
              <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: colors.primary[500] }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box 
            ref={scrollRef}
            sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {isHistoryLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={24} sx={{ color: colors.greenAccent[500] }} />
              </Box>
            ) : messages.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap="10px" sx={{ opacity: 0.6 }}>
                <PsychologyIcon sx={{ fontSize: "64px" }} />
                <Typography textAlign="center">
                  Ask me anything about your data!<br/>
                  (e.g., "Show me top invoices", "List all admins")
                </Typography>
              </Box>
            ) : null}
            
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: m.role === "user" ? colors.greenAccent[500] : colors.primary[400],
                  color: m.role === "user" ? colors.primary[500] : colors.grey[100],
                  p: 1.5,
                  borderRadius: "10px",
                  maxWidth: "85%",
                  border: m.role !== "user" ? `1px solid ${colors.grey[800]}` : "none",
                  boxShadow: m.role !== "user" ? "0 2px 5px rgba(0,0,0,0.2)" : "none"
                }}
              >
                <Typography variant="body2">{m.content}</Typography>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ alignSelf: "flex-start", backgroundColor: colors.primary[400], p: 1.5, borderRadius: "10px", border: `1px solid ${colors.grey[800]}` }}>
                <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.8 }}>Thinking...</Typography>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box component="form" onSubmit={onUserSubmit} sx={{ p: 2, borderTop: `1px solid ${colors.grey[800]}`, backgroundColor: colors.primary[400] }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Ask a question..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  "& fieldset": { borderColor: colors.grey[700] },
                  "&.Mui-focused fieldset": { borderColor: colors.greenAccent[500] }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" disabled={isLoading} sx={{ color: colors.greenAccent[500] }}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      </Collapse>

      {/* Trigger */}
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          backgroundColor: colors.greenAccent[500],
          color: colors.primary[500],
          width: "60px",
          height: "60px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          "&:hover": { backgroundColor: colors.greenAccent[400] }
        }}
      >
        {isOpen ? <CloseIcon /> : <PsychologyIcon sx={{ fontSize: "32px" }} />}
      </IconButton>
    </Box>
  );
};

export default AIAgentChat;
