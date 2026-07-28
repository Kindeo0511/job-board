import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import JobSeekerProfile from "./pages/JobSeekerProfile";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import EmployerHomePage from "./pages/EmployerHomePage";
import EmployerProfile from "./pages/EmployerProfile";
import MyApplicants from "./pages/MyApplicantsPage";
import ApplicantProfile from "./components/ApplicantProfile";
import RegistrationForm from "./pages/RegistrationForm";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { useAuth } from "./hooks/useAuth";

function App() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const hideNavbar = ["/login", "/register-user", "/forgot-password"];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (!loading) setIsLoggedIn(!!user);
  }, [loading, user]);
  return (
    <>
      {!hideNavbar.includes(location.pathname) && (
        <Navbar isLoggedIn={isLoggedIn} />
      )}
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-user" element={<RegistrationForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/My/Applications" element={<MyApplicationsPage />} />
        <Route path="/employer/homepage" element={<EmployerHomePage />} />
        <Route path="/MyApplicants" element={<MyApplicants />} />
        <Route path="/applicant/:id" element={<ApplicantProfile />} />
        <Route path="/profile/employer" element={<EmployerProfile />} />
        <Route path="/profile/jobseeker" element={<JobSeekerProfile />} />

        {/* <Route path="/jobs" element={<Jobs />} />
        <Route path="/register" element={<Register />} /> */}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
