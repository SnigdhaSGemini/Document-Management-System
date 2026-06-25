import { Box, TextField, Typography, Button, Paper } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../context/loaderContext";
import { createDocument } from "../../api/services/documentService";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title should be at least 3 characters"),

  content: Yup.string()
    .required("Content is required")
    .min(10, "Content should be at least 10 characters"),
});

const CreateDocumentForm = () => {
  const navigate = useNavigate();
  const {startLoading, stopLoading} = useLoader();

  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const documentData = {
        ...values,
        status: "submitted",
      };

        startLoading();
        const response = await createDocument(documentData, false);
        stopLoading();

        if(response.success){
          console.log(" Submit for Review:", documentData);
          formik.resetForm();
          navigate("/pending-reviews");
        }
    },
  });

  //  Common data builder
  const buildDocumentData = (status) => {
    return {
      title: formik.values.title.trim(),
      content: formik.values.content.trim(),
      status,
    };
  };

  //  Draft handler
  const handleDraft = async () => {
    const documentData = buildDocumentData("draft");

    console.log(" Save as Draft:", documentData);
      startLoading();
      const response = await createDocument(documentData, false);
      stopLoading();

      if(response.success){
        formik.resetForm();
        navigate("/my-drafts");
      }
  };

  //  Check minimal values
  const isBasicValid =
    formik.values.title.trim().length > 0 &&
    formik.values.content.trim().length > 0;

  return (
  <Paper
  sx={{
    p: 3,
    width: "100%",
    borderRadius: 3,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  }}
>

  {/* Header */}
  <Box sx={{ mb: 4 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, mb: 1, color: "#4B5563" }}
    >
      New Draft
    </Typography>

    <Typography
      variant="body2"
      sx={{ color: "#6b7280" }}
    >
      Write and manage your content below
    </Typography>
  </Box>

  <form onSubmit={formik.handleSubmit}>

    {/* Title */}
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ mb: 1, fontWeight: 500, color: "#374151" }}>
        Title
      </Typography>

      <TextField
        fullWidth
        name="title"
        placeholder="Enter document title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          (formik.touched.title || formik.submitCount > 0) &&
          Boolean(formik.errors.title)
        }
        helperText={
          (formik.touched.title || formik.submitCount > 0) &&
          formik.errors.title
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "rgba(37,99,235,0.05)", 

            "& fieldset": {
              borderColor: "#d1d5db",
            },

            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#2563eb", 
            },
          },
        }}
      />
    </Box>

    {/* Content */}
    <Box sx={{ mb: 3 }}>
      <Typography sx={{ mb: 1, fontWeight: 500, color: "#374151" }}>
        Content
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={8}
        name="content"
        placeholder="Start writing your content here..."
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          (formik.touched.content || formik.submitCount > 0) &&
          Boolean(formik.errors.content)
        }
        helperText={
          (formik.touched.content || formik.submitCount > 0) &&
          formik.errors.content
        }
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "rgba(37,99,235,0.05)",

            "& fieldset": {
              borderColor: "#d1d5db",
            },

            "&:hover fieldset": {
              borderColor: "#9ca3af",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#2563eb",
            },
          },
        }}
      />
    </Box>

    {/* Status */}
    <Box sx={{ mb: 4 }}>
      <span
        style={{
          color: "#6b7280",
          fontWeight: 500,
          fontSize: 16,
        }}
      >
        Status:{" "}
        <b style={{ color: "#2563eb" }}>Draft</b>
      </span>
    </Box>

    {/* Buttons */}
    <Box sx={{ display: "flex", gap: 2 }}>

      {/* Save Draft */}
      <Button
        type="button"
        variant="outlined"
        onClick={handleDraft}
        disabled={!isBasicValid}
        sx={{
          borderRadius: "10px",
          textTransform: "none",
          px: 3,
          borderColor: "#2563eb",
          color: "#2563eb",

          "&:hover": {
            borderColor: "#1d4ed8",
            backgroundColor: "rgba(37,99,235,0.08)",
          },

          "&.Mui-disabled": {
            opacity: 0.5,
            color: "#2563eb",
            borderColor: "#2563eb",
          },
        }}
      >
        Save as Draft
      </Button>

      {/* Submit */}
      <Button
        type="submit"
        variant="contained"
        disabled={!formik.isValid || !isBasicValid}
        sx={{
          backgroundColor: "#2563eb", 
          textTransform: "none",
          borderRadius: "12px",
          px: 3,
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",

          "&:hover": {
            backgroundColor: "#1d4ed8",
          },

          "&.Mui-disabled": {
            opacity: 0.5,
            backgroundColor: "#2563eb",
            color: "#ffffff",
          },
        }}
      >
        Submit for Review
      </Button>

    </Box>

  </form>
</Paper>
  );
};

export default CreateDocumentForm;