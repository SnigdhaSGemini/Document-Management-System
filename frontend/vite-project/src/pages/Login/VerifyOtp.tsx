import { useEffect, useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../context/loaderContext";
import { sendOtp, verifyOtp } from "../../api/services/authService";

const OTP_EXPIRY = 600; //10 min

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { withLoader } = useLoader();

  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const email = watch("email");

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email) return;

    const response = await withLoader(() =>
      sendOtp({ email })
    );

    if (response.success) {
      setCanResend(false);
      setTimer(OTP_EXPIRY);
    }
  };

  const onSubmit = async (data) => {
    const response = await withLoader(() =>
      verifyOtp(data)
    );

    if (response.success) {
      navigate("/reset-password", {
        state: {
          email: data.email,
        },
      });
    }
  };

  const minutes = String(
    Math.floor(timer / 60)
  ).padStart(2, "0");

  const seconds = String(
    timer % 60
  ).padStart(2, "0");

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 p-2">
        <img
          src="./icons/logo.png"
          alt="logo"
          className="h-5 w-5"
        />
        <span className="font-bold text-lg tracking-wide text-gray-800">
          DocuSystem
        </span>
      </div>

      <div className="text-center text-base font-semibold text-gray-800">
        Verify Email
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          sx={{ my: 1 }}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* OTP */}
        <TextField
          fullWidth
          label="OTP"
          sx={{ my: 1 }}
          {...register("otp", {
            required: "OTP is required",
            minLength: {
              value: 6,
              message: "OTP must be 6 digits",
            },
          })}
          error={!!errors.otp}
          helperText={errors.otp?.message}
        />

        {/* Send OTP */}
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mt: 1,
            textTransform: "none",
          }}
          disabled={!canResend}
          onClick={handleSendOtp}
        >
          {canResend ? "Send OTP" : "OTP Sent"}
        </Button>

        {/* Timer */}
        {!canResend && (
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 1, color: "#6b7280" }}
          >
            OTP expires in {minutes}:{seconds}
          </Typography>
        )}

        {/* Resend OTP */}
        <Button
          fullWidth
          variant="text"
          sx={{
            mt: 1,
            textTransform: "none",
          }}
          disabled={!canResend}
          onClick={handleSendOtp}
        >
          Resend OTP
        </Button>

        {/* Verify */}
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
          Verify OTP
        </Button>
      </form>
    </>
  );
};

export default VerifyOtp;