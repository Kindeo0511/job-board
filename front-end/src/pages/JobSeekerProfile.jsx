import pdf_img from "../assets/images/pdf.png";
import { useEffect, useState } from "react";
import {
  ProfileTab,
  SeekerAccountTab,
} from "../components/TabJobSeekerProfile";
import { MyProfile } from "../services/jobSeekerService";

function JobSeekerProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [Profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchMyProfile() {
      try {
        const data = await MyProfile();
        setProfile(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMyProfile();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="tabs tabs-lift w-2/3 my-8">
          <label className="tab">
            <input type="radio" name="my_tabs_4" defaultChecked />
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
              className="lucide lucide-circle-user-icon lucide-circle-user size-4 me-2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="10" r="3" />
              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
            </svg>
            Profile
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {!Profile ? (
              <p>Loading...</p>
            ) : (
              <ProfileTab
                loading={loading}
                MyProfile={Profile}
                setMyProfile={setProfile}
              />
            )}
          </div>

          <label className="tab">
            <input type="radio" name="my_tabs_4" />
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
              className="lucide lucide-lock-keyhole-icon lucide-lock-keyhole size-4 me-2">
              <circle cx="12" cy="16" r="1" />
              <rect x="3" y="10" width="18" height="12" rx="2" />
              <path d="M7 10V7a5 5 0 0 1 10 0v3" />
            </svg>
            Account
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {!Profile ? (
              <p>Loading...</p>
            ) : (
              <SeekerAccountTab MyProfile={Profile} setMyProfile={setProfile} />
            )}

            {/* {!jobSeekerProfile ? (
              <p>Loading...</p>
            ) : (
              <SeekerAccountTab
                MyProfile={jobSeekerProfile}
                setMyProfile={setJobSeekerProfile}
              />
            )} */}
          </div>

          {/* <label className="tab">
            <input type="radio" name="my_tabs_4" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-key-round-icon lucide-key-round size-4 me-2">
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
            Account
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {!jobSeekerProfile ? (
              <p>Loading...</p>
            ) : (
              <AccountTab
                MyProfile={jobSeekerProfile}
                setMyProfile={setJobSeekerProfile}
              />
            )}
          </div> */}
        </div>
      </div>
    </>
  );
}

export default JobSeekerProfile;
