import { useEffect, useState } from "react";
import { addJobPost, updateJobPost } from "../services/jobService";

function PostedCardModal({ ref, closeModal, mode, job, setJobs, setStats }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState(false);
  const [exp, setExp] = useState(false);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [newQualification, setNewQualification] = useState("");
  const [benefits, setBenefits] = useState([]);
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (job) {
      setTitle(job.title || "");
      setLocation(job.location || "");
      setDescription(job.description || "");
      setJobType(job.job_type || "");
      setQualifications(job.qualifications || []);
      setBenefits(job.benefits || []);

      if (
        job.salary_min != null &&
        job.salary_min !== "" &&
        job.salary_min !== 0 &&
        job.salary_max != null &&
        job.salary_max !== "" &&
        job.salary_max !== 0
      ) {
        setSalary(true);
        setMinSalary(job.salary_min || "");
        setMaxSalary(job.salary_max || "");
      }
    } else {
      setTitle("");
      setLocation("");
      setDescription("");
      setJobType("");
      setSalary(false);
      setMinSalary("");
      setMaxSalary("");
      setMinExp("");
      setMaxExp("");
      setQualifications([]);
      setBenefits([]);
    }
  }, [job]);

  function handleDeleteQualification(id) {
    setQualifications((prev) => prev.filter((q) => q.id !== id));
  }

  function handleAddQualification() {
    const trimmed = newQualification.trim();
    if (!trimmed) return;
    setQualifications((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, text: trimmed },
    ]);
    setNewQualification("");
  }

  function handleDeleteBenefit(id) {
    setBenefits((prev) => prev.filter((b) => b.id !== id));
  }

  function handleAddBenefit() {
    const trimmed = newBenefit.trim();
    if (!trimmed) return;
    setBenefits((prev) => [
      ...prev,
      { id: `temp-${Date.now()}`, text: trimmed },
    ]);
    setNewBenefit("");
  }

  function handleEnterKey(e, callback) {
    if (e.key === "Enter") {
      e.preventDefault();
      callback();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title,
      location,
      description,
      salary_min: minSalary,
      salary_max: maxSalary,
      min_exp: minExp,
      max_exp: maxExp,
      job_type: jobType,
      qualifications: qualifications.map((q) => ({ text: q.text })),
      benefits: benefits.map((b) => ({ text: b.text })),
    };

    if (mode === "add") {
      try {
        const data = await addJobPost(payload);
        setJobs((prev) => [...prev, data]);
        setStats((prev) => ({
          ...prev,
          total_active_jobs: prev.total_active_jobs + 1,
          total_jobs: prev.total_jobs + 1,
        }));
      } catch (err) {
        console.error(err.message);
      }
    } else if (mode === "update") {
      try {
        const data = await updateJobPost(payload, job.id);
        setJobs((prev) => prev.map((j) => (j.id === job.id ? data : j)));
      } catch (err) {
        console.error(err.message);
      }
    }
    closeModal();
  }

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box w-11/12 max-w-3xl">
        {/* Close button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
            ✕
          </button>
        </form>

        <h1 className="text-2xl font-bold mb-6">
          {mode === "add" ? "Post a New Job" : "Edit Job"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Basic Info */}
          <div className="flex flex-col gap-4">
            <div className="bg-base-200 rounded-2xl p-5 flex flex-col gap-4">
              <label className="floating-label">
                <input
                  type="text"
                  placeholder="Job Title"
                  className="input input-lg w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="text-xl">Job Title</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Location"
                    className="input input-lg w-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <span className="text-xl">Location</span>
                </label>

                <select
                  className="select select-lg w-full"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}>
                  <option value="" disabled>
                    --- Select Job Type ---
                  </option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary */}
          <div className="bg-base-200 rounded-2xl p-5">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={salary}
                onChange={(e) => setSalary(e.target.checked)}
              />
              <span className="font-semibold">Set Salary Range</span>
            </label>

            {salary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <label className="floating-label">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min Salary"
                    className="input input-lg w-full"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                  <span className="text-xl">Min Salary</span>
                </label>

                <label className="floating-label">
                  <input
                    type="number"
                    min="0"
                    placeholder="Max Salary"
                    className="input input-lg w-full"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                  />
                  <span className="text-xl">Max Salary</span>
                </label>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="bg-base-200 rounded-2xl p-5">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={exp}
                onChange={(e) => setExp(e.target.checked)}
              />
              <span className="font-semibold">Set Experience Range</span>
            </label>

            {exp && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <label className="floating-label">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min Experience"
                    className="input input-lg w-full"
                    value={minExp}
                    onChange={(e) => setMinExp(e.target.value)}
                  />
                  <span className="text-xl">Min Experience</span>
                </label>

                <label className="floating-label">
                  <input
                    type="number"
                    min="0"
                    placeholder="Max Experience"
                    className="input input-lg w-full"
                    value={maxExp}
                    onChange={(e) => setMaxExp(e.target.value)}
                  />
                  <span className="text-xl">Max Experience</span>
                </label>
              </div>
            )}
          </div>

          {/* Qualifications */}
          <div className="bg-base-200 rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-3">Qualifications</h2>

            {qualifications.length > 0 ? (
              <ul className="flex flex-col gap-2 mb-3">
                {qualifications.map((qualify) => (
                  <li
                    key={qualify.id}
                    className="flex items-center justify-between gap-3 bg-base-100 rounded-xl px-4 py-2.5 shadow-sm">
                    <span className="text-sm">{qualify.text}</span>
                    <button
                      type="button"
                      className="btn btn-xs btn-circle btn-ghost text-error"
                      onClick={() => handleDeleteQualification(qualify.id)}
                      aria-label="Remove qualification">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 mb-3">
                No qualifications listed.
              </p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a qualification..."
                className="input input-bordered input-sm w-full"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                onKeyDown={(e) => handleEnterKey(e, handleAddQualification)}
              />
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddQualification}>
                + Add
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-base-200 rounded-2xl p-5">
            <h2 className="font-bold text-lg mb-3">Benefits</h2>

            {benefits.length > 0 ? (
              <ul className="flex flex-col gap-2 mb-3">
                {benefits.map((benefit) => (
                  <li
                    key={benefit.id}
                    className="flex items-center justify-between gap-3 bg-base-100 rounded-xl px-4 py-2.5 shadow-sm">
                    <span className="text-sm">{benefit.text}</span>
                    <button
                      type="button"
                      className="btn btn-xs btn-circle btn-ghost text-error"
                      onClick={() => handleDeleteBenefit(benefit.id)}
                      aria-label="Remove benefit">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 mb-3">No benefits listed.</p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a benefit..."
                className="input input-bordered input-sm w-full"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => handleEnterKey(e, handleAddBenefit)}
              />
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddBenefit}>
                + Add
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action mt-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "add" ? "Post Job" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default PostedCardModal;
