import { toastSuccess, toastError } from "../utils/toaster";

export const handleApi = async (apiCall, { showSuccessToast = true } = {}) => {
  try {
    const res = await apiCall();
    const result = res.data;

    if (!result.success) {
      toastError(result.message || "Something went wrong");

      return {
        success: false,
        error: result.message,
      };
    }

    if (showSuccessToast) {
      toastSuccess(result.message || "Success");
    }

    return {
      success: true,
      data: result,
    };

  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong";

    toastError(message);

    return {
      success: false,
      error: message,
    };
  }
};