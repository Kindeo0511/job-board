import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
function Login() {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function loggingIn(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      const loggedInUser = await signIn(userName, password);

      if (loggedInUser.role === "EM") {
        window.location.href = "/employer/homepage";
      } else if (loggedInUser.role === "JS") {
        window.location.href = "/";
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.detail) {
        setError(err.detail);
      } else {
        setFieldErrors(err);
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center my-24">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <form className="w-xs p-4" onSubmit={loggingIn}>
          <div className="mb-2">
            <label className="label my-2">Username</label>
            <input
              type="text"
              className="input"
              placeholder="Enter Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {fieldErrors.username && (
              <p className="text-error">{fieldErrors.username[0]}</p>
            )}
          </div>

          <div className="mb-2">
            <label className="label my-2">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-error">{fieldErrors.password[0]}</p>
            )}
          </div>

          <div className="flex justify-between items-center mt-1">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox checkbox-sm" />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary underline">
              Forgot password?
            </Link>
          </div>

          <button className="btn btn-primary mt-4 w-full" type="submit">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-2">
          Don't have an account?
          <Link to="/register-user" className="text-primary underline">
            Register Account
          </Link>
        </p>
      </fieldset>
    </div>
  );
}

export default Login;
