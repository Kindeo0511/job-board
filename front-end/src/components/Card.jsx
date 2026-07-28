import { useState } from "react";
import JobDetailsModal from "./Job_Details_Modal";
import { timeAgo, isNew } from "../utils/dateUtils";
import { formatExperience } from "../utils/expUtils";
export function JobCard({ job, onSelect }) {
  return (
    <>
      <div
        className="card bg-base-200 w-full shadow-sm cursor-pointer hover:shadow-md transition-shadow my-2"
        onClick={() => onSelect(job)}>
        <div className="card-body">
          <h2 className="card-title text-2xl w-full">
            {job.title}
            {isNew(job.created_at) && (
              <div className="badge badge-secondary ml-auto">NEW</div>
            )}
          </h2>
          <div className="text-lg">
            <p>{job.employer.company}</p>
            <p>{job.location}</p>
          </div>
          <p className="text-lg font-semibold text-primary">
            {job.salary_min && job.salary_max
              ? `₱${job.salary_min.toLocaleString()} - ₱${job.salary_max.toLocaleString()}`
              : "Salary not specified"}
          </p>
          <div className="flex gap-2">
            <div className="badge badge-primary">{job.job_type_display}</div>
            <div className="badge badge-ghost">
              {formatExperience(job.min_exp, job.max_exp)}
            </div>
          </div>

          <div className=" mt-4">
            <p className="text-sm text-gray-400">
              Posted {timeAgo(job.created_at)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function AppliedJobCard({ application, onSelect }) {
  console.log(application);
  return (
    <div
      className="card bg-base-200 w-full shadow-sm cursor-pointer hover:shadow-md transition-shadow my-2"
      onClick={() => onSelect(application)}>
      <div className="card-body">
        <h2 className="card-title text-2xl w-full">
          {application.job.title}
          <div
            className={`badge ml-auto uppercase ${
              application.status === "pending"
                ? "badge-warning"
                : application.status === "reviewed"
                  ? "badge-info"
                  : application.status === "accepted"
                    ? "badge-success"
                    : application.status === "rejected"
                      ? "badge-error"
                      : ""
            }`}>
            {application.status}
          </div>
        </h2>
        <div className="text-lg">
          <p>{application.job.employer.company}</p>
          <p>{application.job.location}</p>
        </div>
        <p className="text-lg font-semibold text-primary">
          {application.job.salary_min && application.job.salary_max
            ? `₱${application.job.salary_min.toLocaleString()} - ₱${application.job.salary_max.toLocaleString()}`
            : "Salary not specified"}
        </p>
        <div className="flex gap-2">
          <div className="badge badge-primary">
            {application.job.job_type_display}
          </div>
          <div className="badge badge-ghost">2 years exp.</div>
        </div>

        <div className=" mt-4">
          <p className="text-sm text-gray-400">
            Applied {timeAgo(application.applied_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
