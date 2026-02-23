import { Box, useTheme, CircularProgress } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
      <Box display="flex" justifyContent="center" alignItems="center" height="75vh">
        <CircularProgress sx={{ color: colors.greenAccent[500] }} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      {faqs.map((faq) => (
        <Accordion key={faq.id} defaultExpanded sx={{ backgroundColor: colors.primary[400], mb: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color={colors.greenAccent[500]} variant="h5">
              {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default FAQ;
