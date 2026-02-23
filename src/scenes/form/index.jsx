import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useState } from "react";
import { blink } from "../../lib/blink";
import { useBlinkAuth } from "@blinkdotnew/react";
import { toast } from "react-hot-toast";
import PsychologyIcon from '@mui/icons-material/Psychology';

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { user } = useBlinkAuth();
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLabel, setAiLabel] = useState("");

  const handleFormSubmit = async (values, { resetForm }) => {
    if (!user?.id) {
      toast.error("Please sign in to save data");
      return;
    }

    try {
      await blink.db.contacts.create({
        id: `contact_${Date.now()}`,
        userId: user.id,
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        phone: values.contact,
        address: `${values.address1} ${values.address2}`,
        city: "Default City", // Could add more fields to form
        zipCode: "00000",
        registrarId: "0"
      });
      toast.success("User Profile Created!");
      resetForm();
      setAiLabel("");
    } catch (error) {
      console.error("Submit failed:", error);
      toast.error("Failed to create profile");
    }
  };

  const handleSmartLabel = async (values) => {
    if (!values.firstName || !values.lastName) {
      toast.error("Please enter at least a name");
      return;
    }

    setIsAiLoading(true);
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Analyze this new user profile and suggest a professional priority label (High, Medium, Low) and a short one-word persona (e.g. VIP, Standard, Partner).
        User: ${values.firstName} ${values.lastName}, Email: ${values.email}, Address: ${values.address1}`,
        schema: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["High", "Medium", "Low"] },
            persona: { type: "string" },
            reason: { type: "string" }
          },
          required: ["priority", "persona"]
        }
      });
      setAiLabel(`Suggested: ${object.priority} Priority - ${object.persona}`);
    } catch (error) {
      console.error("AI Labeling failed:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 1"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address 2"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="address2"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* AI SMART LABEL */}
            <Box mt="20px" display="flex" alignItems="center" gap="10px">
              <Button
                variant="outlined"
                color="info"
                onClick={() => handleSmartLabel(values)}
                disabled={isAiLoading}
                startIcon={isAiLoading ? <CircularProgress size={20} /> : <PsychologyIcon />}
              >
                Smart Label Analysis
              </Button>
              {aiLabel && (
                <Typography variant="h6" color="secondary" fontWeight="600">
                  {aiLabel}
                </Typography>
              )}
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

export default Form;
