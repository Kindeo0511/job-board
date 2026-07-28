import { useState, useEffect, useRef } from "react";

import PostedCardModal from "./JobPostedCardModal";
import ConfirmationMessage from "./ConfirmationMessageModal";
import { getAllJobPostsByEmployer } from "../services/jobService";
import { formatExperience } from "../utils/expUtils";
function JobPostedCard({ setStats }) {
  const modalRef = useRef(null);
  const confirmRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showConfirmationMessage, setConfirmationMessage] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  const openConfirm = () => confirmRef.current?.showModal();
  const closeConfirm = () => confirmRef.current?.close();

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page_size, setPageSize] = useState(0);

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function getAllJobs() {
      try {
        const isActive =
          selectedStatus === "All" ? null : selectedStatus === "Open";
        const job = await getAllJobPostsByEmployer(isActive, page);
        setJobs(job.results);
        setTotalCount(job.count);
        setPageSize(job.page_size);
        setTotalPages(job.total_pages);
        console.log(job.results);
      } catch (err) {
        console.error("Error fetching jobs", err.message);
      }
    }
    getAllJobs();
  }, [selectedStatus, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  return (
    <>
      <div className="mx-4 py-4 mb-10">
        <div className="flex justify-between">
          <div>
            <div className="badge badge-soft badge-info text-xl">
              Posted Jobs
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => {
                (setSelectedJob(null), openModal());
              }}>
              Post a job
            </button>
          </div>
        </div>
        {/* Job filter */}
        <select
          className="select select-sm mb-4"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        {jobs.map((job) => (
          <div key={job.id} className="card bg-base-200 w-full shadow-sm my-4">
            <div className="card-body">
              <div className="card-actions justify-between">
                <div>
                  <h2 className="card-title">{job.title}</h2>
                </div>
                <div
                  className={`badge badge-soft ${job.is_active ? "badge-success" : "badge-error"}`}>
                  {job.is_active ? "Active" : "Closed"}
                </div>
              </div>
              <h4 className="text-2xl">{job.employer.company}</h4>
              <p className="text-xl">{job.location}</p>
              <p className="text-lg font-semibold text-primary">
                {job.salary_min && job.salary_max
                  ? `₱${job.salary_min.toLocaleString()} - ₱${job.salary_max.toLocaleString()}`
                  : "Salary not specified"}
              </p>
              <div className="flex gap-2">
                <div className="badge badge-primary">
                  {job.job_type_display}
                </div>
                <div className="badge badge-ghost">
                  <p className="text-lg font-semibold text-primary">
                    {formatExperience(job.min_exp, job.max_exp)}
                  </p>
                </div>
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline btn-info"
                  onClick={() => {
                    (setSelectedJob(job), openModal());
                  }}>
                  Edit
                </button>
                <button
                  className={`btn btn-outline ${job.is_active ? "btn-error" : "btn-success"}`}
                  onClick={() => {
                    (setSelectedJob(job), openConfirm());
                  }}>
                  {job.is_active ? "Close" : "Re-Open"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {totalCount > 0 && (
          <div className="join mt-4">
            <button
              className="join-item btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
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
              Next
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}

      <PostedCardModal
        ref={modalRef}
        closeModal={closeModal}
        mode={selectedJob ? "update" : "add"}
        job={selectedJob}
        setJobs={setJobs}
        setStats={setStats}
      />

      <ConfirmationMessage
        ref={confirmRef}
        closeModal={closeConfirm}
        title={
          selectedJob?.is_active ? "Close Confirmation" : "Re-Open Confirmation"
        }
        message={
          selectedJob?.is_active
            ? "Are you sure you want to close this job post?"
            : "Are you sure you want to re-open this job post?"
        }
        job={selectedJob}
        setJobs={setJobs}
        setStats={setStats}
      />
    </>
  );
}
export default JobPostedCard;
