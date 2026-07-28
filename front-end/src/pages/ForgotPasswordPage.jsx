import { useState } from "react";
import { SendOTP, VerifyOTP, ResetPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";
function ForgotPasswordPage() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await SendOTP(email);
      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please check the email and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setLoading(true);
    try {
      await SendOTP(email);
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await VerifyOTP(email, otp);
      setStep("reset");
    } catch (err) {
      setError(err.detail || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: email,
        password: newPassword,
      };
      await ResetPassword(payload);
      navigate("/login");
    } catch (err) {
      setFieldErrors(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center my-24">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Forgot Password</legend>

        {error && (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {step === "email" && (
          <form className="w-xs p-4" onSubmit={handleSendOtp}>
            <div className="mb-2">
              <label className="label my-2">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary mt-4 w-full"
              type="submit"
              disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form className="w-xs p-4" onSubmit={handleVerifyOtp}>
            <div className="mb-2 flex flex-col items-center">
              <label className="label my-2 self-start">
                Enter OTP sent to {email}
              </label>
              <label className="otp">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <input
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength="4"
                  pattern="[0-9]{4}"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </label>
            </div>

            <button
              className="btn btn-primary mt-4 w-full"
              type="submit"
              disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="flex justify-center items-center mt-2">
              <button
                type="button"
                className="btn btn-link btn-sm"
                onClick={handleResendOtp}
                disabled={loading}>
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form className="w-xs p-4" onSubmit={handleResetPassword}>
            <div className="mb-2">
              <label className="label my-2">New Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              {fieldErrors.password && (
                <p className="text-error">{fieldErrors.password[0]}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="label my-2">Confirm Password</label>
              <input
                type="password"
                className="input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary mt-4 w-full"
              type="submit"
              disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </fieldset>
    </div>
  );
}

export default ForgotPasswordPage;
