import { useNavigate } from "react-router-dom";
import { RegisterEmployer, RegisterJobSeeker } from "../services/authService";
import { useState } from "react";

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  async function Registration(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!userName || !password) {
      setError("Username and password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (role !== "EM" && role !== "JS") {
      setError("Please select a role.");
      return;
    }

    const userData = {
      user: {
        username: userName,
        password: password,
        role: role,
      },
    };

    try {
      if (role === "EM") {
        await RegisterEmployer(userData);
      } else {
        await RegisterJobSeeker(userData);
      }
      navigate("/login");
    } catch (err) {
      if (err.user) {
        setFieldErrors(err.user);
      } else {
        setError(err.message);
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center my-24">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-4">
        <legend className="fieldset-legend">Registration</legend>

        <form onSubmit={Registration} className="flex flex-col gap-2">
          <label className="label text-lg">Username</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Enter username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {fieldErrors.username && (
            <p className="text-error text-sm">{fieldErrors.username[0]}</p>
          )}

          <label className="label text-lg mt-4">Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <p className="text-error text-sm">{fieldErrors.password[0]}</p>
          )}

          <label className="label text-lg mt-4">Confirm Password</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="label text-lg mt-4">Role</label>
          <select
            className="select w-full"
            value={role}
            onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled>
              Select a role
            </option>
            <option value="EM">Employer</option>
            <option value="JS">Job Seeker</option>
          </select>

          {error && <p className="text-error text-sm mt-2">{error}</p>}

          <button type="submit" className="btn btn-primary mt-4">
            Register
          </button>
        </form>
      </fieldset>
    </div>
  );
}

export default RegistrationForm;
