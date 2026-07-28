import { GetResume, SendResumeToEmployer } from "../services/jobSeekerService";
import { useState, useEffect } from "react";
import { timeAgo, isNew } from "../utils/dateUtils";

function JobDetailsModal({ modal_id, job, isLoggedIn }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");

  console.log(job);
  useEffect(() => {
    if (!isLoggedIn) return;
    async function fetchMyResume() {
      try {
        const data = await GetResume();
        if (data != null) {
          setResumeFile(data.resume);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
    fetchMyResume();
  }, [isLoggedIn]);

  async function OnSubmit() {
    if (!resumeFile) {
      setApplyError(
        "You don't have a resume uploaded. Please add one in your profile settings before applying.",
      );
      return;
    }
    setApplyError("");
    setApplySuccess("");

    try {
      const payload = {
        resume: resumeFile,
      };
      const data = await SendResumeToEmployer(payload, job.id);
      setApplySuccess("Application submitted successfully!");
    } catch (err) {
      setApplyError(err);
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

  useEffect(() => {
    if (!applyError) return;
    const timer = setTimeout(() => setApplyError(""), 2500);
    return () => clearTimeout(timer);
  }, [applyError]);

  useEffect(() => {
    if (!applySuccess) return;
    const timer = setTimeout(() => setApplySuccess(""), 2500);
    return () => clearTimeout(timer);
  }, [applySuccess]);
  return (
    <>
      <dialog id={modal_id} className="modal">
        {applyError && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert alert-error">
              <span>{applyError}</span>
            </div>
          </div>
        )}
        {applySuccess && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert alert-success">
              <span>{applySuccess}</span>
            </div>
          </div>
        )}
        {job && (
          <div className="modal-box max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div
                  className={`avatar ${!job.employer.photo ? "avatar-placeholder" : ""}`}>
                  <div
                    className={`w-20 rounded-full ring-primary ring-offset-2 ${
                      !job.employer.photo
                        ? `${getAvatarColor(
                            `${job.employer?.user?.first_name || ""}${job.employer?.user?.last_name || ""}`,
                          )} text-white`
                        : ""
                    }`}>
                    {job.employer.photo ? (
                      <img src={job.employer.photo} />
                    ) : (
                      <span className="text-2xl font-medium">
                        {getInitials(
                          job?.employer?.user?.first_name ?? "",
                          job?.employer?.user?.last_name ?? "",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {job.employer?.company ?? "Unknown company"}
                </h3>
                <p className="text-sm text-gray-500">{job.location}</p>
              </div>
              <form method="dialog" className="ml-auto">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            <div className="divider" />

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{job.title}</h2>
              <div className="flex gap-2 flex-wrap">
                <div className="badge badge-primary">
                  {job.job_type_display}
                </div>
                <div className="badge badge-ghost">2 years exp.</div>
                {isNew(job.created_at) && (
                  <div className="badge badge-secondary ml-auto">NEW</div>
                )}
              </div>
              <p className="text-xl font-semibold text-primary">
                {job.salary_min && job.salary_max
                  ? `₱${job.salary_min.toLocaleString()} - ₱${job.salary_max.toLocaleString()}`
                  : "Salary not specified"}
              </p>
              <p className="text-sm text-gray-400">
                Posted {timeAgo(job.created_at)}
              </p>
            </div>

            <div className="divider" />

            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-2xl py-2">Full job description</h4>
              <h1 className="text-lg py-2">Qualifications</h1>
              <ul className="list-disc mx-4">
                {job?.qualifications?.map((qualify) => (
                  <li key={qualify.id}>{qualify.text}</li>
                ))}
              </ul>

              <h1 className="text-lg py-2">Benefits</h1>
              <ul className="list-disc mx-4">
                {job?.benefits?.map((benefit) => (
                  <li key={benefit.id}>{benefit.text}</li>
                ))}
              </ul>
            </div>

            <div className="divider" />

            <div className="modal-action">
              <button className="btn btn-primary" onClick={OnSubmit}>
                Apply Now
              </button>
            </div>
          </div>
        )}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default JobDetailsModal;
