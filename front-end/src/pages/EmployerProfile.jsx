import pdf_img from "../assets/images/pdf.png";
import { useState, useEffect } from "react";
import {
  CompanyTab,
  ContactTab,
  AccountTab,
} from "../components/TabEmployerProfile";
import { MyProfile, countTotalJobAndActive } from "../services/employerService";

function EmployerProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [employerProfile, setEmployerProfile] = useState(null);

  useEffect(() => {
    async function fetchEmployerProfile() {
      try {
        const data = await MyProfile();
        setEmployerProfile(data);
        console.log(data);
      } catch (err) {
        console.error(err.message);
      }
    }
    fetchEmployerProfile();
  }, []);

  useEffect;

  return (
    <>
      {/* name of each tab group should be unique */}
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
              className="lucide lucide-building-icon lucide-building size-4 me-2">
              <path d="M12 10h.01" />
              <path d="M12 14h.01" />
              <path d="M12 6h.01" />
              <path d="M16 10h.01" />
              <path d="M16 14h.01" />
              <path d="M16 6h.01" />
              <path d="M8 10h.01" />
              <path d="M8 14h.01" />
              <path d="M8 6h.01" />
              <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
              <rect x="4" y="2" width="16" height="20" rx="2" />
            </svg>
            Company
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {!employerProfile ? (
              <p>Loading...</p>
            ) : (
              <CompanyTab
                MyProfile={employerProfile}
                setMyProfile={setEmployerProfile}
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
              className="lucide lucide-square-user-round-icon lucide-square-user-round size-4 me-2">
              <path d="M18 21a6 6 0 0 0-12 0" />
              <circle cx="12" cy="11" r="4" />
              <rect width="18" height="18" x="3" y="3" rx="2" />
            </svg>
            Contact
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {!employerProfile ? (
              <p>Loading...</p>
            ) : (
              <ContactTab
                MyProfile={employerProfile}
                setMyProfile={setEmployerProfile}
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
              className="lucide lucide-key-round-icon lucide-key-round size-4 me-2">
              <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
              <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
            Account
          </label>
          <div className="tab-content bg-base-100 border-base-300 p-6">
            {!employerProfile ? (
              <p>Loading...</p>
            ) : (
              <AccountTab
                MyProfile={employerProfile}
                setMyProfile={setEmployerProfile}
              />
            )}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col">
        <div className="flex flex-row justify-center items-start mt-10 gap-8">
          <div className="bg-base-300 flex flex-row w-2/3 p-8">
            {" "}
            {/* Profile Section 
            <div className="flex flex-col justify-center items-center ">
              <div className="avatar">
                <div className="w-48 rounded-full ring ring-primary ring-offset-2">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </div>
            {/* Right Section 
            <div className="flex flex-col mx-12 ">
              <div className="card w-96 shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-3xl">Company Name</h3>

                  <div className="divider m-0"></div>
                  <p className="text-xl">Location: Taguig City</p>
                  <p className="text-xl">Technology | 500-1000 emp.</p>

                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-start">
          <div className="bg-base-300 w-2/3 justify-around">
            {/* Right Section *
            <div className="flex flex-col">
              <div className="card  shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-3xl">About Company</h3>

                  <div className="divider m-0"></div>
                  <p className="text-xl">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Doloremque, neque voluptate deserunt tenetur sunt alias
                    minima ex magni tempora maxime dolorem facere
                    exercitationem, nemo quasi cum dicta modi saepe enim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-start">
          <div className="bg-base-300 w-2/3 justify-around">
            {/* Right Section *
            <div className="flex flex-col">
              <div className="card  shadow-sm">
                <div className="card-body">
                  <h3 className="card-title text-3xl">Contact Information</h3>

                  <div className="divider m-0"></div>
                  <div className="text-2xl">
                    <h1>contact@company.com </h1>
                    <h1>+63 912 345 6789 </h1>
                    <h1>www.company.com </h1>
                    <h1>123 Street, Taguig City, Metro Manila </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}

export default EmployerProfile;
