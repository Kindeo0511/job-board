import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CountApplicants,
  GetEmployerApplicants,
} from "../services/employerService";

const tabs = ["All", "pending", "reviewed", "interview", "rejected"];

const statusBadge = {
  pending: "badge-info",
  reviewed: "badge-warning",
  interview: "badge-success",
  rejected: "badge-error",
};

const statusLabel = {
  pending: "New",
  reviewed: "Reviewed",
  interview: "Interview",
  rejected: "Rejected",
};

const statConfig = [
  { label: "Total Applicants", key: "total_applicants" },
  { label: "New", key: "total_new_applicant" },
  { label: "For Interview", key: "total_interview" },
  { label: "Rejected", key: "total_rejected" },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MyApplicants() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedJob, setSelectedJob] = useState("All job posts");
  const [jobPosts, setJobPosts] = useState(["All job posts"]);
  const [totalStats, setTotalStats] = useState([]);
  const [employerApplicants, setEmployerApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page_size, setPageSize] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    async function FetchTotalStats() {
      try {
        const data = await CountApplicants();
        setTotalStats(data);
      } catch (err) {
        console.error(err.message);
      }
    }
    FetchTotalStats();
  }, []);

  useEffect(() => {
    async function FetchJobPosts() {
      try {
        const data = await GetEmployerApplicants(null, null);
        const titles = [...new Set(data.results.map((a) => a.job.title))];
        setJobPosts(["All job posts", ...titles]);
      } catch (err) {
        console.error(err.message);
      }
    }
    FetchJobPosts();
  }, []);
  useEffect(() => {
    async function FetchApplicants() {
      try {
        setLoading(true);
        const jobTitle = selectedJob === "All job posts" ? null : selectedJob;
        const jobStatus = activeTab === "All" ? null : activeTab;

        const data = await GetEmployerApplicants(jobTitle, jobStatus, page);
        setEmployerApplicants(data.results);
        setTotalCount(data.count);
        setPageSize(data.page_size);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    FetchApplicants();
  }, [activeTab, selectedJob, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, selectedJob]);

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };
  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-400",
      "bg-orange-400",
      "bg-amber-400",
      "bg-lime-400",
      "bg-green-400",
      "bg-teal-400",
      "bg-cyan-400",
      "bg-blue-400",
      "bg-indigo-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-rose-400",
    ];
    const safeName = name && name.length > 0 ? name : "?";
    let hash = 0;
    for (let i = 0; i < safeName.length; i++) {
      hash = safeName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  async function handleDownloadResume(url) {
    if (!url) {
      alert("No resume file available to download.");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download resume. Please try again.");
    }
  }
  return (
    <div className="w-1/2 mx-auto my-10">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {statConfig.map((stat) => (
          <div key={stat.label} className="bg-base-200 rounded-lg p-4">
            <p className="text-sm text-base-content/60 mb-1">{stat.label}</p>
            <p className="text-2xl font-medium">
              {totalStats ? (totalStats[stat.key] ?? "-") : "..."}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            className={`tab ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {statusLabel[tab] ?? "All"}
          </button>
        ))}
      </div>

      {/* Job filter */}
      <select
        className="select select-sm mb-4"
        value={selectedJob}
        onChange={(e) => setSelectedJob(e.target.value)}>
        {jobPosts.map((job) => (
          <option key={job}>{job}</option>
        ))}
      </select>

      {/* Applicant cards */}
      {loading ? (
        <p>Loading...</p>
      ) : employerApplicants.length === 0 ? (
        <p className="text-base-content/50 text-sm text-center mt-10">
          No applicants found.
        </p>
      ) : (
        employerApplicants.map((applicant) => (
          <div
            key={applicant.id}
            className="card bg-base-100 border border-base-300 mb-3">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`avatar ${!applicant.applicant.photo ? "avatar-placeholder" : ""}`}>
                  <div
                    className={`w-10 rounded-full ring-primary ring-offset-2 ${
                      !applicant.applicant.photo
                        ? `${getAvatarColor(
                            `${applicant.applicant.user.first_name || ""}${applicant.applicant.user.last_name || ""}`,
                          )} text-white`
                        : ""
                    }`}>
                    {applicant.applicant.photo ? (
                      <img src={applicant.applicant.photo} />
                    ) : (
                      <span className="text-sm font-medium">
                        {getInitials(
                          applicant.applicant.user.first_name,
                          applicant.applicant.user.last_name,
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      {applicant.applicant.user.first_name}{" "}
                      {applicant.applicant.user.last_name}
                    </p>
                    <span
                      className={`badge ${statusBadge[applicant.status] ?? "badge-ghost"}`}>
                      {statusLabel[applicant.status] ?? applicant.status}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/60">
                    Applied for: {applicant.job.title}
                  </p>
                </div>
              </div>

              <div className="divider my-1" />

              <div className="flex justify-between items-center">
                <p className="text-sm text-base-content/60">
                  Applied {formatDate(applicant.applied_at)} · Resume attached
                </p>
                <div className="flex gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => navigate(`/applicant/${applicant.id}`)}>
                    View profile
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      handleDownloadResume(applicant.applicant.resume);
                    }}>
                    Download resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      {totalCount > 0 && (
        <div className="join mt-4">
          <button
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left-icon lucide-chevron-left">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <input
              key={num}
              className="join-item btn btn-square"
              type="radio"
              name="options"
              aria-label={num}
              checked={page === num}
              onChange={() => setPage(num)}
            />
          ))}

          <button
            className="join-item btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-right-icon lucide-chevron-right">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
