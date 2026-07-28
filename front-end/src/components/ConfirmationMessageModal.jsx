import { useState } from "react";
import { closeJobPost } from "../services/jobService";

function ConfirmationMessage({
  ref,
  closeModal,
  title,
  message,
  job,
  setJobs,
  setStats,
}) {
  const [showAlert, setShowAlert] = useState(false);

  async function handleConfirm() {
    const payload = {
      is_active: !job.is_active,
    };

    try {
      await closeJobPost(payload, job.id);

      setJobs((prev) =>
        prev.map((prevJob) =>
          prevJob.id === job.id
            ? { ...prevJob, is_active: !job.is_active }
            : prevJob,
        ),
      );

      setStats((prev) => ({
        ...prev,
        total_active_jobs: job.is_active
          ? Math.max(0, prev.total_active_jobs - 1)
          : prev.total_active_jobs + 1,
      }));

      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (err) {
      console.error(err.message);
    }
    closeModal();
  }

  return (
    <>
      <dialog ref={ref} className="modal">
        <div className="modal-box w-11/12">
          <div className="flex justify-between">
            <h1>{title}</h1>
          </div>

          <div>
            <form method="dialog">
              <button className="btn btn-outline btn-error absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
          <div className="divider"></div>

          <div className="flex justify-start mt-4">
            <h4>{message}</h4>
          </div>

          <div className="modal-action">
            <button
              className="btn btn-outline btn-primary"
              type="button"
              onClick={handleConfirm}>
              Yes
            </button>
            <button
              className="btn btn-outline btn-error"
              type="button"
              onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {showAlert && (
        <div
          role="alert"
          className="alert alert-success fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{job.is_active ? "Job Closed!" : "Job Re-Opened!"}</span>
        </div>
      )}
    </>
  );
}

export default ConfirmationMessage;
