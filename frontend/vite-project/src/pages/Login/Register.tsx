import { useState } from "react";
import { TextField, Button, IconButton, InputAdornment} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/services/authService";
import {useLoader} from "../../context/loaderContext";
import { encryptPassword } from "../../utils/encryptPassword";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {withLoader} = useLoader();

  const {
    register,
    handleSubmit,
    watch,
    reset, 
    formState: { errors }
  } = useForm();

  const passwordValue = watch("password");

 const onSubmit = async (data) => {
  const { fullName, password, confirmPassword, ...urlData } = data;
  const publicKey = import.meta.env.VITE_PUBLIC_KEY.replace(/\\n/g, "\n");
  const encryptedPassword = encryptPassword(password, publicKey);
  const encryptConfirmPassword = encryptPassword(confirmPassword, publicKey);

  const response = await withLoader(() => registerUser({
    name: fullName,
    password: encryptedPassword,
    confirmPassword: encryptConfirmPassword,
    ...urlData
  }));

  if (response.success) {
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
    navigate("/sign-in");
  }
};
  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 p-2">
        <img src="./icons/logo.png" alt="logo" className="h-5 w-5" />
        <span className="font-bold text-lg tracking-wide hidden md:block text-gray-800">
          DocuSystem
        </span>
      </div>

      {/* Title */}
      <div className="text-center text-base font-semibold text-gray-800">
        Create Account
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          sx={{ my: 1 }}
          {...register("fullName", {
            required: "Full Name is required",
            minLength: {
              value: 3,
              message: "Minimum 3 characters required"
            }
          })}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />

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

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          sx={{ my: 1 }}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters required"
            }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
              value === passwordValue || "Passwords do not match"
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
          Register
        </Button>
      </form>

      {/* Login */}
      <div className="text-center text-sm text-gray-600 mt-2">
        Already have an account?{" "}
        <span className="text-gray-900 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/sign-in")}>
          Sign in
        </span>
      </div>
    </>
  );
};

export default Register;