import Hero from "../components/Hero";
import { JobCard } from "../components/Card";
import { useEffect, useState } from "react";
import { ViewAllJobs } from "../services/jobService";
import BrowseJobs from "../components/BrowseJobs";

function Home({ isLoggedIn }) {
  const [jobs, setJobs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchJob, setSearchJob] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page_size, setPageSize] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function showAllJobs() {
      setLoading(true);
      try {
        const data = await ViewAllJobs(searchJob, page);
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
    showAllJobs();
  }, [page, searchJob]);

  useEffect(() => {
    setPage(1);
  }, [searchJob]);

  function handleSearch(e) {
    e.preventDefault();
    setSearchJob(searchInput);
  }

  function handleChange(e) {
    const value = e.target.value;
    setSearchInput(value);
    if (value === "") {
      setSearchJob("");
    }
  }

  return (
    <>
      <div className="text-center">
        <form onSubmit={handleSearch}>
          <label className="input w-1/2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              className=""
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={handleChange}
              onInput={handleChange}
            />
          </label>
        </form>
      </div>
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-col my-16 w-1/2 ">
          {loading ? (
            <p>Loading...</p>
          ) : jobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            <BrowseJobs
              jobs={jobs}
              setJobs={setJobs}
              page={page}
              setPage={setPage}
              totalCount={totalCount}
              page_size={page_size}
              totalPages={totalPages}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
