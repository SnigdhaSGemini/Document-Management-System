import { useEffect, useState } from "react";
import { TextField, Button, IconButton, InputAdornment} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../api/services/authService";
import { useLoader } from "../../context/loaderContext";
import { encryptPassword } from "../../utils/encryptPassword";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { withLoader } = useLoader();
  const location = useLocation();
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const newPasswordValue = watch("newPassword");

  useEffect(() => {
  if (!email) {
    navigate("/verify-otp");
  }
}, [email]);

  const onSubmit = async (data) => {
    const {newPassword, confirmPassword, ...apiData} = data;
    const publicKey = import.meta.env.VITE_PUBLIC_KEY.replace(/\\n/g, "\n");
    const encryptedPassword = encryptPassword(newPassword, publicKey);
    const encryptConfirmPassword = encryptPassword(confirmPassword, publicKey);

    const response = await withLoader(() => resetPassword({ email, password: encryptedPassword, confirmPassword: encryptConfirmPassword}));

      if (response.success) {
        reset();
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        navigate("/sign-in");
      }

  };

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 p-2">
        <img src="./icons/logo.png" alt="logo" className="h-5 w-5" />
        <span className="font-bold text-lg tracking-wide text-gray-800">
          DocuSystem
        </span>
      </div>

      {/* Title */}
      <div className="text-center text-base font-semibold text-gray-800">
        Reset Password
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          sx={{ my: 1 }}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email"
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* New Password */}
        <TextField
          fullWidth
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          variant="outlined"
          sx={{ my: 1 }}
          {...register("newPassword", {
            required: "New Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters required"
            }
          })}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          variant="outlined"
          sx={{ my: 1 }}
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === newPasswordValue || "Passwords do not match"
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#1f2937",
            textTransform: "none",
            borderRadius: "10px",
            padding: "10px",
            "&:hover": {
              backgroundColor: "#374151",
            },
          }}
        >
          Reset Password
        </Button>
      </form>
    </>
  );
};

export default ResetPassword;