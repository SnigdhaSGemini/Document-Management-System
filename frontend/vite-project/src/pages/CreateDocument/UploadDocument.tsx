import { Box, Typography, Button, Paper, LinearProgress } from "@mui/material";
import { useState } from "react";
import mammoth from "mammoth";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../context/loaderContext";
import { createDocument } from "../../api/services/documentService";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const UploadDocument = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const {startLoading, stopLoading} = useLoader();

 
const processFile = (selectedFile) => {
  if (!selectedFile) return;

  const allowedTypes = ["txt", "pdf", "docx"];
  const fileName = selectedFile.name;
  const extension = fileName.split(".").pop()?.toLowerCase();

  
    if (!allowedTypes.includes(extension)) {
        setError("Unsupported file type. Please upload .txt, .docx, or .pdf file.");
        setFile(null);
        setContent("");
        return;
    }

    setError("");
    setFile(selectedFile);


  console.log("Title:", fileName.replace(/\.[^/.]+$/, ""));

  // TEXT FILE
  if (extension === "txt" || extension === "md") {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setContent(reader.result);
      }
    };

    reader.readAsText(selectedFile);
  }

  // PDF FILE
  else if (extension === "pdf") {
    const reader = new FileReader();

    reader.onload = async () => {
      if (!(reader.result instanceof ArrayBuffer)) return;

      const typedarray = new Uint8Array(reader.result);
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const textItems = content.items.filter((item): item is TextItem => "str" in item).map((item) => item.str);
        extractedText += textItems.join(" ") + "\n";
      }

      setContent(extractedText);
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  // DOCX FILE 
  else if (extension === "docx") {
    const reader = new FileReader();

    reader.onload = async () => {
      if (!(reader.result instanceof ArrayBuffer)) return;

      const result = await mammoth.extractRawText({
        arrayBuffer: reader.result,
      });

      setContent(result.value.trim());
    };

    reader.readAsArrayBuffer(selectedFile);
  }

  // Unsupported
  else {
    setContent("Preview not available for this file type.");
  }
};

  // Input upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");
    processFile(selectedFile);
  };

  // Drag handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
     setError("");

    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  // Save Draft
  const handleSaveDraft = async () => {
    if (!file) return;

    const documentData = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      content: content,
      status: "draft",
    };

    startLoading();
    const response = await createDocument(documentData, false);
    stopLoading();
    
    if(response.success){
      setFile(null);
      setContent("");
      setDragging(false);
      navigate("/my-drafts");
    }
  };

  return (
<Paper
  sx={{
    p: 3,
    width: "100%",
    height: "100%",
    borderRadius: 3,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  }}
>
  {/* Header */}
  <Typography
    variant="h6"
    sx={{ fontWeight: 600, mb: 1, color: "#4B5563" }}
  >
    Upload Document
  </Typography>

  <Typography
    variant="body2"
    sx={{ color: "#6b7280", mb: 3 }}
  >
    Upload a file to automatically generate a document
  </Typography>

  {/* Drag & Drop */}
  <Box
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    sx={{
      border: "2px dashed",
      borderColor: error
        ? "#ef4444"
        : dragging
        ? "#2563eb"        
        : "#bfdbfe",       

      borderRadius: 3,
      p: 5,
      mb: 3,
      textAlign: "center",
      transition: "all 0.2s ease",
      cursor: "pointer",

      backgroundColor: dragging
        ? "rgba(37,99,235,0.12)"   
        : "rgba(37,99,235,0.05)",  
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Typography
        sx={{
          color: "#374151",
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        Drag & drop your file here
      </Typography>

      <Typography sx={{ color: "#6b7280", fontSize: 13 }}>
        or
      </Typography>

      <Button
        variant="outlined"
        component="label"
        sx={{
          borderColor: "#2563eb",
          color: "#2563eb",
          textTransform: "none",
          borderRadius: "10px",
          px: 2.5,

          "&:hover": {
            borderColor: "#1d4ed8",
            backgroundColor: "rgba(37,99,235,0.08)",
          },
        }}
      >
        Browse Files
        <input type="file" hidden onChange={handleFileChange} />
      </Button>

      <Typography
        variant="caption"
        sx={{ color: "#6b7280" }}
      >
        Supported: .txt, .docx, .pdf
      </Typography>
    </Box>
  </Box>

  {/* Error */}
  {error && (
    <Typography
      variant="caption"
      sx={{
        color: "#ef4444",
        display: "block",
        mb: 2,
        mt: -2,
      }}
    >
      {error}
    </Typography>
  )}

  {/* File Preview */}
  {file && (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body2"
        sx={{ mb: 1, color: "#374151", fontWeight: 500 }}
      >
        {file.name}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={100}
        sx={{
          height: 6,
          borderRadius: 5,
          backgroundColor: "#e5e7eb",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#2563eb", 
          },
        }}
      />
    </Box>
  )}

  {/* Button */}
  <Button
    variant="contained"
    disabled={!file}
    onClick={handleSaveDraft}
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
    Save as Draft
  </Button>
</Paper>
  );
};

export default UploadDocument;