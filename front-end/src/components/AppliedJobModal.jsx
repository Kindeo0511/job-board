import { useState, useEffect } from "react";
import { timeAgo, isNew } from "../utils/dateUtils";

function AppliedJobModal({ modal_id, job_application }) {
  console.log(job_application);

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
    <>
      <dialog id={modal_id} className="modal">
        {job_application && (
          <div className="modal-box max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div
                  className={`avatar ${!job_application.job.employer.photo ? "avatar-placeholder" : ""}`}>
                  <div
                    className={`w-20 rounded-full ring-primary ring-offset-2 ${
                      !job_application.job.employer.photo
                        ? `${getAvatarColor(
                            `${job_application.job.employer?.user?.first_name || ""}${job_application.job.employer?.user?.last_name || ""}`,
                          )} text-white`
                        : ""
                    }`}>
                    {job_application.job.employer.photo ? (
                      <img src={job_application.job.employer.photo} />
                    ) : (
                      <span className="text-2xl font-medium">
                        {getInitials(
                          job_application.job?.employer?.user?.first_name ?? "",
                          job_application.job?.employer?.user?.last_name ?? "",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {job_application.job.employer?.company ?? "Unknown company"}
                </h3>
                <p className="text-sm text-gray-500">
                  {job_application.job.location}
                </p>
              </div>
              <form method="dialog" className="ml-auto">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            <div className="divider" />

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">
                {job_application.job.title}
              </h2>
              <div className="flex gap-2 flex-wrap">
                <div className="badge badge-primary">
                  {job_application.job.job_type_display}
                </div>
                <div className="badge badge-ghost">2 years exp.</div>
                {isNew(job_application.job.created_at) && (
                  <div className="badge badge-secondary ml-auto">NEW</div>
                )}
              </div>
              <p className="text-xl font-semibold text-primary">
                {job_application.job.salary_min &&
                job_application.job.salary_max
                  ? `₱${job_application.job.salary_min.toLocaleString()} - ₱${job_application.job.salary_max.toLocaleString()}`
                  : "Salary not specified"}
              </p>
              <p className="text-sm text-gray-400">
                Posted {timeAgo(job_application.job.created_at)}
              </p>
            </div>

            <div className="divider" />

            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-2xl py-2">Full job description</h4>
              <h1 className="text-lg py-2">Qualifications</h1>
              <ul className="list-disc mx-4">
                {job_application.job?.qualifications?.map((qualify) => (
                  <li key={qualify.id}>{qualify.text}</li>
                ))}
              </ul>

              <h1 className="text-lg py-2">Benefits</h1>
              <ul className="list-disc mx-4">
                {job_application.job?.benefits?.map((benefit) => (
                  <li key={benefit.id}>{benefit.text}</li>
                ))}
              </ul>
            </div>

            <div className="divider" />

            <div className="modal-action">
              <div className="badge badge-info">Applied</div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

export default AppliedJobModal;
