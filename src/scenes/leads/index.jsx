import { 
  Box, 
  Typography, 
  useTheme, 
  Button, 
  IconButton, 
  Chip, 
  Skeleton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Tooltip, 
  Avatar, 
  Paper,
  InputAdornment
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useDashboardData } from "../../hooks/useDashboardData";
import { 
  Sparkles, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2,
  TrendingUp,
  UserCheck,
  History,
  Calendar as CalIcon,
  DollarSign,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Copy
} from "lucide-react";
import { useState } from "react";
import { blink } from "../../lib/blink";
import { toast } from "react-hot-toast";

const Leads = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { leads, deals, organization, loading, refresh } = useDashboardData();
  const [isScoring, setIsScoring] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", company: "", phone: "", source: "Website" });
  
  const [openEmail, setOpenEmail] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [aiEmail, setAiEmail] = useState("");
  const [isEmailGenerating, setIsEmailGenerating] = useState(false);

  const handleOpenDetail = (lead) => {
    setSelectedLead(lead);
    setOpenDetail(true);
  };

  const handleScoreLead = async (leadId) => {
    setIsScoring(prev => ({ ...prev, [leadId]: true }));
    try {
      const lead = leads.find(l => l.id === leadId);
      
      const { object } = await blink.ai.generateObject({
        prompt: `Analyze this CRM lead and provide a predictive conversion score (0-100) and a brief reason based on their profile: ${JSON.stringify(lead)}`,
        schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            reason: { type: "string" }
          },
          required: ["score", "reason"]
        }
      });

      await blink.db.leads.update(leadId, { 
        score: object.score,
        source: object.reason // Using source as a temporary place for AI reason for demo
      });
      
      toast.success(`AI Scored ${lead.name}: ${object.score}/100`);
      refresh();
    } catch (error) {
      console.error("Scoring failed:", error);
      toast.error("AI Analysis failed");
    } finally {
      setIsScoring(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) return;
    try {
      await blink.db.leads.create({
        ...newLead,
        organizationId: organization?.id,
        status: "New",
        score: 0
      });
      toast.success("Lead added successfully!");
      setOpenAdd(false);
      refresh();
    } catch (error) {
      toast.error("Failed to add lead");
    }
  };

  const handleGenerateEmail = async (lead) => {
    setSelectedLead(lead);
    setOpenEmail(true);
    setAiEmail("");
    setIsEmailGenerating(true);
    try {
      const { text } = await blink.ai.generateText({
        prompt: `Write a highly personalized, professional follow-up email for a CRM lead. 
        Lead Name: ${lead.name}
        Company: ${lead.company}
        AI Score: ${lead.score}/100
        Status: ${lead.status}
        Goal: Persuade them to book a demo for Ascend CRM. 
        Include a subject line.`
      });
      setAiEmail(text);
    } catch (error) {
      toast.error("AI Email generation failed");
    } finally {
      setIsEmailGenerating(false);
    }
  };

  const columns = [
    { 
      field: "name", 
      headerName: "Lead Name", 
      flex: 1,
      renderCell: ({ row: { name, email } }) => (
        <Box display="flex" flexDirection="column" sx={{ py: 1.5 }}>
          <Typography fontWeight="bold" color={theme.palette.text.primary} sx={{ fontSize: "16px" }}>{name}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>{email}</Typography>
        </Box>
      )
    },
    { 
      field: "company", 
      headerName: "Company", 
      flex: 1,
      renderCell: ({ row: { company } }) => (
        <Box display="flex" alignItems="center" gap="10px">
          <Box sx={{ p: "6px", borderRadius: "8px", bgcolor: "hsla(var(--primary) / 0.05)", color: "hsl(var(--primary))" }}>
            <Building2 size={16} />
          </Box>
          <Typography fontWeight={500}>{company || "N/A"}</Typography>
        </Box>
      )
    },
    { 
      field: "status", 
      headerName: "Status", 
      width: 150,
      renderCell: ({ row: { status } }) => {
        const colorMap = {
          "New": { bg: "hsla(var(--primary) / 0.1)", text: "hsl(var(--primary))", icon: Sparkles },
          "Qualified": { bg: "hsla(142 76% 36% / 0.1)", text: "hsl(142 76% 36%)", icon: CheckCircle2 },
          "Proposal": { bg: "hsla(25 95% 53% / 0.1)", text: "hsl(25 95% 53%)", icon: TrendingUp },
          "Negotiation": { bg: "hsla(30 100% 50% / 0.1)", text: "#f97316", icon: DollarSign },
          "Lost": { bg: "hsla(0 100% 50% / 0.05)", text: "#ef4444", icon: AlertCircle }
        };
        const style = colorMap[status] || colorMap["New"];
        return (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            p: "6px 14px", 
            borderRadius: "10px", 
            bgcolor: style.bg, 
            color: style.text 
          }}>
            <style.icon size={14} />
            <Typography variant="body2" fontWeight="bold">{status}</Typography>
          </Box>
        );
      }
    },
    { 
      field: "score", 
      headerName: "AI Score", 
      width: 150,
      renderCell: ({ row: { id, score, source } }) => (
        <Box display="flex" alignItems="center" gap="12px" width="100%">
          {score > 0 ? (
            <Tooltip title={source || "AI Analysis Complete"}>
              <Box 
                sx={{ 
                  p: "6px 14px", 
                  borderRadius: "10px", 
                  bgcolor: score > 75 ? "linear-gradient(135deg, hsla(142 76% 36% / 0.2), hsla(142 76% 36% / 0.1))" : "hsla(var(--primary) / 0.1)",
                  color: score > 75 ? "hsl(142 76% 36%)" : "hsl(var(--primary))",
                  fontWeight: "900",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: score > 75 ? "0 4px 12px hsla(142 76% 36% / 0.1)" : "none",
                  border: score > 75 ? "1px solid hsla(142 76% 36% / 0.2)" : "1px solid transparent"
                }}
              >
                <Sparkles size={14} />
                {score}
              </Box>
            </Tooltip>
          ) : (
            <Button
              size="small"
              startIcon={<Sparkles size={16} />}
              onClick={() => handleScoreLead(id)}
              disabled={isScoring[id]}
              sx={{ 
                color: "hsl(var(--primary))", 
                textTransform: "none", 
                fontWeight: "bold",
                borderRadius: "10px",
                bgcolor: "hsla(var(--primary) / 0.05)",
                px: 2,
                "&:hover": { bgcolor: "hsla(var(--primary) / 0.1)" }
              }}
            >
              {isScoring[id] ? "Analyzing..." : "Score"}
            </Button>
          )}
        </Box>
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: ({ row }) => (
        <Box display="flex" gap="8px">
          <Tooltip title="View Profile">
            <IconButton size="small" onClick={() => handleOpenDetail(row)} sx={{ color: colors.grey[100] }}>
              <Eye size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="AI Follow-up">
            <IconButton size="small" onClick={() => handleGenerateEmail(row)} sx={{ color: "hsl(var(--primary))" }}>
              <Mail size={18} />
            </IconButton>
          </Tooltip>
          <IconButton size="small"><MoreVertical size={18} /></IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box m="32px">
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb="48px">
        <Header title="LEADS HUB" subtitle="Manage and score your incoming opportunities with predictive AI" />
        <Button
          onClick={() => setOpenAdd(true)}
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{
            bgcolor: "hsl(var(--primary))",
            color: "white",
            p: "12px 32px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px hsla(var(--primary) / 0.3)",
            "&:hover": { bgcolor: "hsl(var(--primary-glow))" }
          }}
        >
          Capture Lead
        </Button>
      </Box>

      <Box
        height="70vh"
        className="glass-card"
        p="24px"
      >
        <DataGrid 
          rows={leads} 
          columns={columns} 
          components={{ Toolbar: GridToolbar }}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "1px solid hsla(var(--primary) / 0.05)" },
            "& .MuiDataGrid-columnHeaders": { bgcolor: "hsla(var(--primary) / 0.05)", borderBottom: "none", borderRadius: "12px" },
            "& .MuiDataGrid-virtualScroller": { bgcolor: "transparent" },
            "& .MuiDataGrid-footerContainer": { borderTop: "none" },
            "& .MuiButton-text": { color: "hsl(var(--primary)) !important", fontWeight: "bold" },
          }}
        />
      </Box>

      {/* Add Lead Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} PaperProps={{ sx: { borderRadius: "32px", p: 2, bgcolor: "hsl(var(--background))", boxShadow: "0 20px 80px rgba(0,0,0,0.15)" } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: "28px", letterSpacing: "-1px" }}>Capture Enterprise Lead</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          <TextField 
            fullWidth label="Full Name" 
            variant="outlined" 
            value={newLead.name} 
            onChange={(e) => setNewLead({...newLead, name: e.target.value})}
            InputProps={{ startAdornment: <InputAdornment position="start"><UserCheck size={18} /></InputAdornment>, sx: { borderRadius: "16px" } }}
          />
          <TextField 
            fullWidth label="Work Email" 
            variant="outlined" 
            value={newLead.email} 
            onChange={(e) => setNewLead({...newLead, email: e.target.value})} 
            InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment>, sx: { borderRadius: "16px" } }}
          />
          <TextField 
            fullWidth label="Company Name" 
            variant="outlined" 
            value={newLead.company} 
            onChange={(e) => setNewLead({...newLead, company: e.target.value})} 
            InputProps={{ startAdornment: <InputAdornment position="start"><Building2 size={18} /></InputAdornment>, sx: { borderRadius: "16px" } }}
          />
          <TextField 
            fullWidth label="Phone Number" 
            variant="outlined" 
            value={newLead.phone} 
            onChange={(e) => setNewLead({...newLead, phone: e.target.value})} 
            InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={18} /></InputAdornment>, sx: { borderRadius: "16px" } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: colors.grey[400], fontWeight: "bold" }}>Cancel</Button>
          <Button onClick={handleAddLead} variant="contained" sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "14px", px: 6, py: 1.5, fontWeight: "bold" }}>
            Add to Pipeline
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Email Dialog */}
      <Dialog open={openEmail} onClose={() => setOpenEmail(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "32px", p: 3, bgcolor: "hsl(var(--background))" } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: "28px", letterSpacing: "-1px", display: "flex", alignItems: "center", gap: "16px" }}>
          <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: "hsla(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
            <Sparkles size={28} />
          </Box>
          Personalized Follow-up
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {isEmailGenerating ? (
            <Box display="flex" flexDirection="column" gap={2}>
              <Skeleton height={24} width="60%" />
              <Skeleton height={24} width="90%" />
              <Skeleton height={200} variant="rectangular" sx={{ borderRadius: "20px" }} />
            </Box>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={14}
              value={aiEmail}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "hsla(var(--primary) / 0.03)", p: 3 } }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 2 }}>
          <Button onClick={() => setOpenEmail(false)} sx={{ color: colors.grey[400], fontWeight: "bold" }}>Dismiss</Button>
          <Button 
            onClick={() => { navigator.clipboard.writeText(aiEmail); toast.success("Copied to clipboard!"); }} 
            variant="outlined" 
            startIcon={<Copy size={18} />}
            sx={{ borderRadius: "14px", px: 4, py: 1.5, fontWeight: "bold", borderColor: "hsla(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}
          >
            Copy
          </Button>
          <Button variant="contained" sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "14px", px: 6, py: 1.5, fontWeight: "bold" }}>
            Send Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lead Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: "40px", p: 0, bgcolor: "hsl(var(--background))", overflow: "hidden" } }}>
        <Box sx={{ p: "48px", bgcolor: "hsla(var(--primary) / 0.04)", borderBottom: "1px solid hsla(var(--primary) / 0.08)" }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex" gap={4} alignItems="center">
              <Avatar sx={{ width: 100, height: 100, bgcolor: "hsl(var(--primary))", fontSize: "40px", fontWeight: "bold", boxShadow: "0 20px 40px hsla(var(--primary) / 0.2)" }}>
                {selectedLead?.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h1" fontWeight="800" sx={{ letterSpacing: "-2px" }}>{selectedLead?.name}</Typography>
                <Box display="flex" gap={2} mt={1}>
                  <Chip icon={<Building2 size={14} />} label={selectedLead?.company} size="small" sx={{ borderRadius: "8px", fontWeight: "bold" }} />
                  <Chip icon={<TrendingUp size={14} />} label={`Status: ${selectedLead?.status}`} size="small" sx={{ borderRadius: "8px", fontWeight: "bold" }} />
                </Box>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" fontWeight="900" sx={{ opacity: 0.5, textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>AI Health Score</Typography>
              <Typography variant="h1" fontWeight="900" color="hsl(var(--primary))" sx={{ fontSize: "64px", lineHeight: 1 }}>{selectedLead?.score || 0}</Typography>
            </Box>
          </Box>
        </Box>

        <DialogContent sx={{ p: "48px" }}>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={6}>
            <Box display="flex" flexDirection="column" gap={5}>
              <Box>
                <Typography variant="h4" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={2}>
                  <UserCheck size={24} color="hsl(var(--primary))" /> Intelligence Profile
                </Typography>
                <Paper variant="outlined" sx={{ p: 4, borderRadius: "28px", bgcolor: "white", display: "flex" , flexDirection: "column", gap: 3, border: "1px solid hsla(var(--primary) / 0.08)" }}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "hsla(var(--primary) / 0.04)" }}><Mail size={20} style={{ opacity: 0.6 }} /></Box>
                    <Typography fontWeight={500}>{selectedLead?.email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: "hsla(var(--primary) / 0.04)" }}><Phone size={20} style={{ opacity: 0.6 }} /></Box>
                    <Typography fontWeight={500}>{selectedLead?.phone || "+1 (555) 000-0000"}</Typography>
                  </Box>
                </Paper>
              </Box>

              <Box>
                <Typography variant="h4" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={2}>
                  <DollarSign size={24} color="hsl(var(--primary))" /> Potential Deals
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {deals.filter(d => d.leadId === selectedLead?.id).length > 0 ? (
                    deals.filter(d => d.leadId === selectedLead?.id).map(deal => (
                      <Paper key={deal.id} className="glass-card" sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "white" }}>
                        <Box>
                          <Typography fontWeight="bold" variant="h5">{deal.title}</Typography>
                          <Typography variant="body2" sx={{ opacity: 0.6 }}>{deal.stage}</Typography>
                        </Box>
                        <Typography fontWeight="900" variant="h3" color="hsl(var(--primary))">${deal.amount.toLocaleString()}</Typography>
                      </Paper>
                    ))
                  ) : (
                    <Box sx={{ p: 6, textAlign: "center", borderRadius: "28px", border: "2px dashed hsla(var(--primary) / 0.1)", bgcolor: "hsla(var(--primary) / 0.01)" }}>
                      <Typography variant="body2" sx={{ opacity: 0.4, fontWeight: "bold" }}>No Deals Captured Yet</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="h4" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={2}>
                <History size={24} color="hsl(var(--primary))" /> Engagement History
              </Typography>
              <Box sx={{ borderLeft: "3px solid hsla(var(--primary) / 0.08)", ml: 3, pl: 5, display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { title: 'AI Health Assessment', desc: `Conversion probability set to ${selectedLead?.score}%`, date: '2 hours ago', icon: Sparkles },
                  { title: 'Intelligence Scored', desc: `Captured via ${selectedLead?.source || 'Automated Flow'}`, date: 'Yesterday', icon: CalIcon },
                  { title: 'Capture Initialized', desc: 'System identification complete', date: '3 days ago', icon: UserCheck }
                ].map((item, i) => (
                  <Box key={i} sx={{ position: "relative" }}>
                    <Box sx={{ position: "absolute", left: "-52px", top: 0, width: "20px", height: "20px", borderRadius: "50%", bgcolor: "white", border: "3px solid hsl(var(--primary))", boxShadow: "0 0 10px hsla(var(--primary) / 0.3)" }} />
                    <Typography variant="h5" fontWeight="bold">{item.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>{item.desc}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: "bold", textTransform: "uppercase" }}>{item.date}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: "48px", borderTop: "1px solid hsla(var(--primary) / 0.08)", gap: 2 }}>
          <Button onClick={() => setOpenDetail(false)} sx={{ fontWeight: "bold", color: colors.grey[400] }}>Dismiss</Button>
          <Button variant="contained" sx={{ bgcolor: "hsl(var(--primary))", color: "white", borderRadius: "16px", px: 6, py: 2, fontWeight: "bold", boxShadow: "0 10px 30px hsla(var(--primary) / 0.2)" }}>
            Execute Follow-up
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Leads;
