import { handleApi } from "../apiHandler";
import axiosInstance from "../axiosInstance";

// Get all Reviewers
export const getAllReviewers = (showSuccessToast = false) =>
  handleApi(() => axiosInstance.get("/user/reviewers"), {showSuccessToast});

export const createUsers = (data, showSuccessToast = false) =>
  handleApi(() => axiosInstance.post("/user/create", data), {showSuccessToast});

export const getAllUsers = (data, showSuccessToast = false) =>
  handleApi(() => axiosInstance.get("/user/get-all-users", {params: data}), {showSuccessToast});

export const updateUser = (data, showSuccessToast = false) => {
  const {id, apiData} = data;
 return handleApi(() => axiosInstance.post(`/user/update/${id}`, apiData), {showSuccessToast})};

 export const deleteUser = (data, showSuccessToast = false) =>
  handleApi(() => axiosInstance.delete(`/user/delete/${data}`), {showSuccessToast});