import { useState } from "react";
import AppliedJobModal from "./AppliedJobModal";
import { AppliedJobCard } from "./Card";

function AppliedJobs({ applications }) {
  const [selectedApp, setSelectedApp] = useState(null);
  return (
    <>
      {applications.map((app) => (
        <AppliedJobCard
          key={app.id}
          application={app}
          onSelect={(app) => {
            setSelectedApp(app);
            document.getElementById("applied_job").showModal();
          }}
        />
      ))}
      <AppliedJobModal modal_id={"applied_job"} job_application={selectedApp} />
    </>
  );
}

export default AppliedJobs;
