import { Box, useTheme, CircularProgress, Skeleton } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ChevronDown, HelpCircle } from "lucide-react";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isAuthenticated } = useBlinkAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      // Fetch system faqs and user faqs
      const data = await blink.db.faqs.list();
      setFaqs(data);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <Box m="20px">
        <Skeleton variant="text" width="200px" height={60} />
        <Skeleton variant="text" width="300px" height={30} sx={{ mb: 4 }} />
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: "12px" }} />
        ))}
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="RESOURCES" subtitle="SaaS knowledge base & assistance" />

      {faqs.map((faq) => (
        <Accordion 
          key={faq.id} 
          sx={{ 
            backgroundColor: "hsla(var(--glass-bg))",
            backdropFilter: "blur(10px)",
            mb: "16px",
            borderRadius: "16px !important",
            border: `1px solid hsla(var(--glass-border))`,
            boxShadow: "var(--shadow-glass)",
            "&:before": { display: "none" }
          }}
        >
          <AccordionSummary expandIcon={<ChevronDown color="hsl(var(--primary))" />}>
            <Box display="flex" alignItems="center" gap="12px">
              <HelpCircle size={20} color="hsl(var(--primary))" />
              <Typography color="hsl(var(--primary))" variant="h5" fontWeight="bold">
                {faq.question}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
            <Typography variant="h6" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
