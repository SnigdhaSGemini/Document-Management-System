import axiosInstance from "../axiosInstance";
import { handleApi } from "../apiHandler";

// get all documents
export const getAllDocuments = (data, showSuccessToast = true) =>
  handleApi(() => axiosInstance.get("/document", {params: data}), {showSuccessToast});

//create document
export const createDocument = (data, showSuccessToast = true) =>
  handleApi(() => axiosInstance.post("/document/create", data), {showSuccessToast});