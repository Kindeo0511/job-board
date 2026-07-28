import { useEffect, useState } from "react";
import { MyJobApplications } from "../services/jobSeekerService";
import AppliedJobs from "../components/AppliedJobs";

function MyApplicationsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page_size, setPageSize] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchMyJobApplication() {
      try {
        setLoading(true);
        const filterValue = selectedStatus === "" ? null : selectedStatus;
        const data = await MyJobApplications(filterValue, page);

        setJobs(data.results);
        setTotalCount(data.count);
        setPageSize(data.page_size);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMyJobApplication();
  }, [selectedStatus, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedStatus]);

  return (
    <>
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col my-16 w-1/2">
          <div className="flex flex-row items-center gap-2 mb-4">
            <select
              className="select select-sm w-48"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="" disabled>
                --- Select Status ---
              </option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* CLEAR BUTTON */}
            {selectedStatus && (
              <button
                type="button"
                className="btn btn-md btn-outline btn-primary"
                onClick={() => setSelectedStatus("")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  class="lucide lucide-x-icon lucide-x">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p className="text-base-content/50 text-sm text-center mt-10">
              No applications found.
            </p>
          ) : (
            <AppliedJobs applications={jobs} />
          )}
          {totalCount > 0 && (
            <div className="join mt-4">
              <button
                className="join-item btn mx-2"
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <input
                    key={num}
                    className="join-item btn btn-square"
                    type="radio"
                    name="options"
                    aria-label={num}
                    checked={page === num}
                    onChange={() => setPage(num)}
                  />
                ),
              )}

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
        </div>
      </div>
    </>
  );
}

export default MyApplicationsPage;
