import axiosInstance from "../axiosInstance";
import { handleApi } from "../apiHandler";

// get all documents
export const getAllDocuments = (data, showSuccessToast = true) =>
  handleApi(() => axiosInstance.get("/document", {params: data}), {showSuccessToast});

//create document
export const createDocument = (data, showSuccessToast = true) =>
  handleApi(() => axiosInstance.post("/document/create", data), {showSuccessToast});

export const updateDocument = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.post(`/document/update/${data.id}`, {content: data.content, title: data.title}), {showSuccessToast});

export const deleteDocument = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.delete(`/document/delete/${data}`), {showSuccessToast});

export const getDocumentVersions = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.get(`/document/versions/${data}`), {showSuccessToast});

export const getAuditLogs = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.get(`/document/audit-logs/${data}`), {showSuccessToast});

export const changeReviewers = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.post(`/document/change-reviewer`, data), {showSuccessToast});

export const submitDocument = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.post(`/document/submit/${data.id}`,{status: data.status}), {showSuccessToast});

export const addComment = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.post(`/document/comment/${data.id}`,{userId: data.userId, body: data.body, user: data.user}), {showSuccessToast});

export const getAllComments = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.get(`/document/comments/${data}`), {showSuccessToast});

export const getTimeline = (data, showSuccessToast = false) => 
  handleApi(() => axiosInstance.get(`/document/timeline/${data}`), {showSuccessToast});

export const getNotifications = (showSuccessToast = false) => 
  handleApi(() => axiosInstance.get(`/document/notifications`), {showSuccessToast});

export const setNotificationsRead = (showSuccessToast = false) => 
  handleApi(() => axiosInstance.post(`/document/read-notifications`), {showSuccessToast});

export const getAllOwners = (showSuccessToast = false) =>
  handleApi(() => axiosInstance.get("/document/owners"), {showSuccessToast});