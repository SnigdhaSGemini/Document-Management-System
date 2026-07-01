import axiosInstance from "../axiosInstance";
import { handleApi } from "../apiHandler";

// Register
export const registerUser = (data) =>
  handleApi(() => axiosInstance.post("/auth/register", data));

// Login
export const loginUser = (data) =>
  handleApi(() => axiosInstance.post("/auth/login", data));

// Reset Password
export const resetPassword = (data) =>
  handleApi(() => axiosInstance.post("/auth/reset-password", data));

export const sendOtp = (data) =>
  handleApi(() => axiosInstance.post("/auth/send-otp", data));

export const verifyOtp = (data) =>
  handleApi(() => axiosInstance.post("/auth/verify-otp", data));