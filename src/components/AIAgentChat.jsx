import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, useTheme, IconButton, Paper, TextField, InputAdornment, Collapse, CircularProgress, Avatar } from "@mui/material";
import { tokens } from "../theme";
import { useAgent, Agent, dbTools, useBlinkAuth } from "@blinkdotnew/react";
import { Sparkles, X, Trash2, Send, Bot, User, BrainCircuit } from "lucide-react";
import { blink } from "../lib/blink";

const dataAgent = new Agent({
  model: "google/gemini-3-flash",
  system: `You are the Ascend AI Sales Intelligence Officer. 
You have direct access to the CRM's multi-tenant database.
Available Tables & Context:
- leads: id, name, email, company, status, score, source, organization_id.
- deals: id, title, amount, stage, expected_close_date, lead_id, organization_id.
- teams: id, name, access, organization_id.
- contacts: id, name, email, city, organization_id.

Intelligence Directives:
1. Fetch data using db_list based on the user's organization context.
2. Provide strategic sales advice.
3. Calculate pipeline totals or lead conversion rates if asked.
4. Identify deal risks.
5. Always be professional, concise, and proactive.` ,
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
    if (window.confirm("Clear intelligence history?")) {
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
    <Box sx={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 1000 }}>
      <Collapse in={isOpen}>
        <Paper
          className="glass-card"
          sx={{
            width: "400px",
            height: "600px",
            display: "flex",
            flexDirection: "column",
            mb: 3,
            overflow: "hidden",
            bgcolor: "white",
            border: "1px solid hsla(var(--primary) / 0.15)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Box display="flex" alignItems="center" gap="12px">
              <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "rgba(255,255,255,0.2)" }}>
                <BrainCircuit size={20} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="800">Ascend AI</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: "bold" }}>Intelligence Officer</Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <IconButton onClick={handleClearHistory} size="small" sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)" }}>
                <Trash2 size={16} />
              </IconButton>
              <IconButton onClick={() => setIsOpen(false)} size="small" sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)" }}>
                <X size={16} />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box 
            ref={scrollRef}
            sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px", bgcolor: "hsla(var(--primary) / 0.01)" }}
          >
            {isHistoryLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={24} sx={{ color: "hsl(var(--primary))" }} />
              </Box>
            ) : messages.length === 0 ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap="20px" sx={{ opacity: 0.4 }}>
                <Bot size={64} strokeWidth={1} />
                <Typography variant="body2" textAlign="center" fontWeight="bold">
                  Ask me about your leads, deals,<br/>or team performance.
                </Typography>
              </Box>
            ) : null}
            
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  display: "flex",
                  gap: 1.5,
                  maxWidth: "85%",
                  flexDirection: m.role === "user" ? "row-reverse" : "row"
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: m.role === "user" ? "hsl(var(--primary))" : "hsla(var(--primary) / 0.1)", color: m.role === "user" ? "white" : "hsl(var(--primary))" }}>
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </Avatar>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: m.role === "user" ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                    bgcolor: m.role === "user" ? "hsl(var(--primary))" : "white",
                    color: m.role === "user" ? "white" : "inherit",
                    border: m.role !== "user" ? "1px solid hsla(var(--primary) / 0.1)" : "none",
                    boxShadow: m.role !== "user" ? "0 4px 12px rgba(0,0,0,0.02)" : "none"
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{m.content}</Typography>
                </Box>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ alignSelf: "flex-start", display: "flex", gap: 1.5 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  <Bot size={16} className="animate-pulse" />
                </Avatar>
                <Box sx={{ p: 2, borderRadius: "4px 20px 20px 20px", bgcolor: "white", border: "1px solid hsla(var(--primary) / 0.1)" }}>
                  <CircularProgress size={12} sx={{ color: "hsl(var(--primary))" }} />
                </Box>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box component="form" onSubmit={onUserSubmit} sx={{ p: 3, borderTop: "1px solid hsla(var(--primary) / 0.08)", bgcolor: "white" }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Query enterprise intelligence..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  bgcolor: "hsla(var(--primary) / 0.02)",
                  "& fieldset": { border: "1px solid hsla(var(--primary) / 0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "hsl(var(--primary))" }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" disabled={isLoading || !input.trim()} sx={{ color: "hsl(var(--primary))" }}>
                      <Send size={18} />
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
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)))",
          color: "white",
          width: "64px",
          height: "64px",
          boxShadow: "0 10px 30px hsla(var(--primary) / 0.4)",
          transition: "var(--transition-smooth)",
          "&:hover": { transform: "scale(1.1) rotate(5deg)", boxShadow: "0 15px 40px hsla(var(--primary) / 0.5)" }
        }}
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
      </IconButton>
    </Box>
  );
};

export default AIAgentChat;
