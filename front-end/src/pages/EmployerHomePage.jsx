import Stats from "../components/Stats";
import JobPostedCard from "../components/JobPostedCard";
import { useState, useEffect } from "react";
import { countTotalJobAndActive } from "../services/employerService";
function EmployerHomePage() {
  const [stats, setStats] = useState({
    total_jobs: 0,
    total_active_jobs: 0,
    total_applicants: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const data = await countTotalJobAndActive();
      setStats(data);
    }
    fetchStats();
  }, []);
  return (
    <>
      <div className="w-2/3 mx-auto bg-base-300">
        <Stats stats={stats} />
        <div className="divider"></div>
        <JobPostedCard setStats={setStats} />
      </div>
    </>
  );
}
export default EmployerHomePage;
