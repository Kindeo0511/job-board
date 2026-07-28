import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  GetApplicantById,
  UpdateApplicantStatus,
} from "../services/employerService";

const statusConfig = {
  pending: "btn-info",
  reviewed: "btn-warning",
  interview: "btn-success",
  rejected: "btn-error",
};
const statusLabel = {
  pending: "New",
  reviewed: "Reviewed",
  interview: "Interview",
  rejected: "Rejected",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
export default function ApplicantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("New");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function FetchApplicantProfile() {
      try {
        const data = await GetApplicantById(id);
        console.log(data);

        setProfile(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    FetchApplicantProfile();
  }, []);

  useEffect(() => {
    if (profile) setStatus(profile.status);
  }, [profile]);

  async function ChangeStatus(newStatus) {
    try {
      const payload = {
        status: newStatus,
      };
      const data = await UpdateApplicantStatus(payload, id);
      console.log(data);
    } catch (err) {
      console.error(err.message);
    }
  }

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
  return (
    <div className="w-1/2 mx-auto my-10 flex flex-col gap-3">
      {/* Back button */}
      <button
        className="btn btn-ghost btn-sm self-start gap-1"
        onClick={() => navigate(-1)}>
        ← Back to applicants
      </button>

      {/* Header */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`avatar ${!profile.applicant.photo ? "avatar-placeholder" : ""}`}>
                  <div
                    className={`w-20 rounded-full ring-primary ring-offset-2 ${
                      !profile.applicant.photo
                        ? `${getAvatarColor(
                            `${profile.user?.first_name || ""}${profile.user?.last_name || ""}`,
                          )} text-white`
                        : ""
                    }`}>
                    {profile.applicant.photo ? (
                      <img src={profile.applicant.photo} />
                    ) : (
                      <span className="text-2xl font-medium">
                        {getInitials(
                          profile.applicant.user.first_name,
                          profile.applicant.user.last_name,
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-medium">
                    {profile.applicant.user.first_name +
                      " " +
                      profile.applicant.user.last_name}
                  </p>

                  <p className="text-sm text-base-content/60">
                    {profile.job_title ? (
                      profile.job_title
                    ) : (
                      <span className="text-gray-500">
                        No job title provided
                      </span>
                    )}
                  </p>

                  <p className="text-sm text-base-content/60">
                    Applied for:{" "}
                    <span className="text-base-content">
                      {profile.job.title}
                    </span>
                  </p>
                  <span>{formatDate(profile.applied_at)}</span>
                </div>

                <button
                  className="btn btn-sm btn-outline gap-1"
                  onClick={() => {
                    handleDownloadResume(profile.applicant.resume);
                  }}>
                  ↓ Download resume
                </button>
              </div>
            </div>
          </div>

          {/* Status changer */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <p className="font-medium">Application status</p>
              <p className="text-sm text-base-content/60 mb-2">
                Change the status of this applicant
              </p>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(statusConfig).map((s) => (
                  <button
                    key={s}
                    className={`btn btn-sm ${
                      status === s ? statusConfig[s] : "btn-outline"
                    }`}
                    onClick={() => {
                      setStatus(s);
                      ChangeStatus(s);
                    }}>
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <p className="font-medium mb-2">Contact information</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Email</span>
                  {profile.applicant.user.email || (
                    <span className="text-gray-500">No email provided</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Phone</span>
                  {profile.applicant.phone_number || (
                    <span className="text-gray-500">
                      No phone number provided
                    </span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Location</span>
                  {profile.applicant.location || (
                    <span className="text-gray-500">No location provided</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Portfolio</span>
                  {profile.applicant.portfolio_url || (
                    <a className="text-gray-500">No portfolio provided</a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <p className="font-medium mb-2">About</p>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {profile.applicant.about || (
                  <a className="text-gray-500">No summary provided.</a>
                )}
              </p>
            </div>
          </div>

          {/* Work experience */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <p className="font-medium mb-3">Work experience</p>
              <div className="flex flex-col gap-4">
                {!profile.applicant.experiences ||
                profile.applicant.experiences.length === 0 ? (
                  <span className="text-gray-500">
                    This applicant hasn't listed any work experience yet.
                  </span>
                ) : (
                  profile.applicant.experiences.map((exp, index) => (
                    <React.Fragment key={exp.id || index}>
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium text-sm">{exp.title}</p>
                        <p className="text-xs text-base-content/60">
                          {`${formatDate(exp.start_date)} - ${exp.end_date ? formatDate(exp.end_date) : "Present"}`}
                        </p>
                      </div>
                      <p className="text-sm text-base-content/60">
                        {exp.company}
                      </p>
                      <p className="text-sm text-base-content/60 mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                      {index < profile.applicant.experiences.length - 1 && (
                        <div className="divider my-0" />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <p className="font-medium mb-3">Education</p>
              <div className="flex flex-col gap-4">
                {!profile.applicant.educations ||
                profile.applicant.educations.length === 0 ? (
                  <span className="text-gray-500">Not specified.</span>
                ) : (
                  profile.applicant.educations.map((educ, index) => (
                    <React.Fragment key={educ.id || index}>
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium text-sm">{educ.degree}</p>
                        <p className="text-xs text-base-content/60">
                          {`${educ.start_year} - ${educ.end_year ? educ.end_year : "Present"}`}
                        </p>
                      </div>
                      <p className="text-sm text-base-content/60">
                        {educ.school}
                      </p>

                      {index < profile.applicant.educations.length - 1 && (
                        <div className="divider my-0" />
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <p className="font-medium mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {!profile.applicant.skills ||
                profile.applicant.skills.length === 0 ? (
                  <span className="text-gray-500">
                    This applicant hasn't listed any skills yet.
                  </span>
                ) : (
                  profile.applicant.skills.map((skill) => (
                    <span key={skill.id} className="badge badge-ghost text-sm">
                      {skill.name}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
