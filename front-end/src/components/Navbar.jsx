import { useState, useEffect } from "react";
import { Link, useAsyncError, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  myAccount,
  employerProfile,
  jobSeekerProfile,
} from "../services/authService";
function Navbar({ isLoggedIn }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [role, setRole] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function fetchAccount() {
      try {
        const account = await myAccount();
        setRole(account.role);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      }
    }
    fetchAccount();
  }, [isLoggedIn]);
  useEffect(() => {
    async function fetchProfile() {
      if (!role) return;

      try {
        if (role === "EM") {
          const employer = await employerProfile();
          setProfile(employer);
        } else if (role === "JS") {
          const jobseeker = await jobSeekerProfile();
          setProfile(jobseeker);
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      }
    }
    fetchProfile();
  }, [role]);

  async function logOut(e) {
    e.preventDefault();

    try {
      signOut();
      console.log("signing out");
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <>
      <div className="navbar bg-base-200 shadow-sm mb-8">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            {isLoggedIn && (
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                  <Link to={role === "JS" ? "/" : "/employer/homepage"}>
                    {role === "JS" ? "Browse Job" : "My Job Posts"}
                  </Link>
                </li>
                <li>
                  <Link
                    to={role === "JS" ? "My/Applications" : "/MyApplicants"}>
                    {role === "JS" ? "My Applications" : "My Applicants"}
                  </Link>
                </li>
                <li>
                  <Link
                    to={
                      role === "JS" ? "/profile/jobseeker" : "/profile/employer"
                    }>
                    Profile
                  </Link>
                </li>
              </ul>
            )}
          </div>
          {isLoggedIn ? (
            <Link to={role === "JS" ? "/" : "/employer/homepage"}>Jobless</Link>
          ) : (
            <Link to="/">Jobless</Link>
          )}
        </div>
        <div className="navbar-center hidden lg:flex">
          {isLoggedIn && (
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link to={role === "JS" ? "/" : "/employer/homepage"}>
                  {role === "JS" ? "Browse Job" : "My Job Posts"}
                </Link>
              </li>
              <li>
                <Link to={role === "JS" ? "My/Applications" : "/MyApplicants"}>
                  {role === "JS" ? "My Applications" : "My Applicants"}
                </Link>
              </li>
              <li>
                <Link
                  to={
                    role === "JS" ? "/profile/jobseeker" : "/profile/employer"
                  }>
                  Profile
                </Link>
              </li>
            </ul>
          )}
        </div>
        <div className="navbar-end">
          {isLoggedIn ? (
            <button className="btn" onClick={logOut}>
              Log out
            </button>
          ) : (
            <Link to="/login">
              <button className="btn" onClick={logOut}>
                Log In
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
