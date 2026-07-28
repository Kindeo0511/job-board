import { useState } from "react";
import { JobCard } from "./Card";
import JobDetailsModal from "./Job_Details_Modal";

function BrowseJobs({
  jobs,
  setJobs,
  page,
  setPage,
  totalCount,
  page_size,
  totalPages,
  isLoggedIn,
}) {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onSelect={(job) => {
            setSelectedJob(job);
            document.getElementById("job_details_modal").showModal();
          }}
        />
      ))}
      {totalCount > 0 && (
        <div className="join mt-4 mx-2">
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
            className="join-item btn mx-2"
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
      <JobDetailsModal
        modal_id={"job_details_modal"}
        job={selectedJob}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}

export default BrowseJobs;
