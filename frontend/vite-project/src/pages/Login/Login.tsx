import { useState } from "react";
import { TextField, Button, IconButton, InputAdornment} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/services/authService";
import { useLoader } from "../../context/loaderContext";
import { encryptPassword } from "../../utils/encryptPassword";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {withLoader} = useLoader();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const {password, ...apiData} = data;
    const publicKey = import.meta.env.VITE_PUBLIC_KEY.replace(/\\n/g, "\n");
    const encryptedPassword = encryptPassword(password, publicKey)
    const response = await withLoader(() => loginUser({...apiData, password: encryptedPassword }));

      if (response.success) {
        // token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name",response.data.data.name);
        localStorage.setItem("userId", response.data.data.userId);
        localStorage.setItem("role", response.data.data.role);
        reset(); 
        setShowPassword(false);
        navigate("/dashboard");
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email"
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            backgroundColor: "#f3f4f6",
            borderRadius: "10px",
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          margin="normal"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters required"
            }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{
            backgroundColor: "#f3f4f6",
            borderRadius: "10px",
          }}
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

        {/* Forgot Password*/}
        <div className="text-right text-sm text-gray-600 hover:text-gray-800 cursor-pointer mt-1"
              onClick={() => navigate("/verify-otp")}>
          Forgot Password?
        </div>

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
          Sign in
        </Button>
      </form>

      {/* Register */}
      <div className="text-center text-sm text-gray-600 mt-2">
        Don't have an account?{" "}
        <span className="text-gray-900 font-medium cursor-pointer hover:underline"
              onClick={() => navigate("/register")}>
          Register here
        </span>
      </div>
    </>
  );
};

export default Login;