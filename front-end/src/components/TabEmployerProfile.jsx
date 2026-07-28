import { useState, useRef } from "react";
import {
  UpdateEmployerCompanyProfile,
  UpdateEmployerCompanyContact,
  ChangePassword,
  UploadPhoto,
} from "../services/employerService";
import { getAvatarColor, getInitials } from "../utils/avatarUtils";
export function CompanyTab({ MyProfile, setMyProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    company: MyProfile?.company || "",
    industry: MyProfile?.industry || "",
    company_size: MyProfile?.company_size || "",
    description: MyProfile?.description || "",
    photo: MyProfile?.photo || "",
  });
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fullName =
    `${MyProfile?.user?.first_name ?? ""} ${MyProfile?.user?.last_name ?? ""}`.trim();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  async function HandleUpdate(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      const data = await UpdateEmployerCompanyProfile(formData);
      setFormData((prev) => ({ ...prev, data }));
      setIsEditing(false);
    } catch (err) {
      if (err) {
        setFieldErrors(err);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // optional: validate type/size
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // preview locally
    const previewUrl = URL.createObjectURL(file);
    const payload = new FormData();
    payload.append("photo", file);

    try {
      const data = await UploadPhoto(payload);
      console.log(data);
      setFormData((prev) => ({
        ...prev,
        photo: previewUrl,
      }));
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      {!isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <h6 className="text-2xl">
                Company Profile
                <span
                  className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning mx-4"} mx-4`}>
                  {!isEditing ? "Viewing" : "Editing"}
                </span>
              </h6>
            </div>

            <div>
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </div>
          </div>

          {/* PROFILE LOGO */}

          <div className="flex flex-row items-center gap-8">
            <div className="indicator">
              <div className="indicator-item indicator-bottom">
                <button
                  className="btn btn-primary btn-circle btn-sm"
                  onClick={handlePhotoClick}>
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
                    className="lucide lucide-camera-icon lucide-camera">
                    <path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </button>
                {/* hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div
                className={`avatar ${!formData.photo ? "avatar-placeholder" : ""}`}>
                <div
                  className={`w-20 rounded-full ring-primary ring-offset-2 ${
                    !formData.photo
                      ? `${getAvatarColor(fullName)} text-white`
                      : ""
                  }`}>
                  {formData.photo ? (
                    <img src={formData.photo} />
                  ) : (
                    <span className="text-2xl font-medium">
                      {getInitials(
                        MyProfile?.user?.first_name ?? "",
                        MyProfile?.user?.last_name ?? "",
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="card-title">{formData.company}</h3>
            </div>
          </div>

          {/* END OF PROFILE LOGO */}
          <div className="mt-8">
            <h6 className="pb-2 text-lg">Company Name</h6>
            <p>
              {formData.company || (
                <span className="text-gray-500">No company name added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>

          <div>
            <h6 className="pb-2 text-lg">Industry</h6>
            <p>
              {" "}
              {formData.industry || (
                <span className="text-gray-500">No industry added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>
          <div>
            <h6 className="pb-2 text-lg">Company Size</h6>
            <p>
              {" "}
              {formData.company_size || (
                <span className="text-gray-500">No company size added</span>
              )}{" "}
            </p>
            <div className="divider m-0"></div>
          </div>
          <div>
            <h6 className="pb-2 text-lg">Description</h6>
            <p>
              {" "}
              {formData.description || (
                <span className="text-gray-500">No description added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          <div>
            <h6 className="text-2xl">
              Company Profile
              <span
                className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning"} mx-4`}>
                {!isEditing ? "Viewing" : "Editing"}
              </span>
            </h6>
          </div>

          <div className="mt-4">
            <form onSubmit={HandleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="input input-lg w-full"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                  <span>Company Name</span>
                </label>
                {fieldErrors.company && (
                  <p className="text-error text-sm">{fieldErrors.company[0]}</p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Industry"
                    className="input input-lg w-full"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                  />
                  <span>Industry</span>
                </label>
                {fieldErrors.industry && (
                  <p className="text-error text-sm">
                    {fieldErrors.industry[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Company Size"
                    className="input input-lg w-full"
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                  />
                  <span>Company Size</span>
                </label>
                {fieldErrors.company_size && (
                  <p className="text-error text-sm">
                    {fieldErrors.company_size[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Description"
                    className="input input-lg w-full"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <span>Description </span>
                </label>
                {fieldErrors.description && (
                  <p className="text-error text-sm">
                    {fieldErrors.description[0]}
                  </p>
                )}
                {error && <p className="text-error text-sm mt-2">{error}</p>}
              </div>

              <div className="flex justify-end space-x-8">
                <button type="submit" className="btn btn-outline btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error"
                  onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export function ContactTab({ MyProfile, setMyProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: MyProfile?.user.first_name || "",
    last_name: MyProfile?.user.last_name || "",
    email: MyProfile?.user.email || "",
    phone_number: MyProfile?.phone_number || "",
    website_url: MyProfile?.website_url || "",
    location: MyProfile?.location || "",
  });
  const fullName = `${formData.first_name} ${formData.last_name}`;
  const HandleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function HandleUpdate(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        website_url: formData.website_url,
        location: formData.location,
      };
      console.log("Payload being sent:", payload);
      const data = await UpdateEmployerCompanyContact(payload);

      setFormData((prev) => ({ ...prev, data }));
      setIsEditing(false);
    } catch (err) {
      if (err) {
        setFieldErrors(err);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }
  return (
    <>
      {!isEditing ? (
        <div className="flex flex-col gap-2">
          {/* PROFILE LOGO */}
          <div className="flex justify-between mb-8">
            <div>
              <h6 className="text-2xl">
                Contact Information
                <span
                  className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning mx-4"} mx-4`}>
                  {!isEditing ? "Viewing" : "Editing"}
                </span>
              </h6>
            </div>

            <div>
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </div>
          </div>
          {/* END OF PROFILE LOGO */}
          <div>
            <h6 className="pb-2 text-lg">Full Name</h6>
            <p>
              {" "}
              {fullName || (
                <span className="text-gray-500">No full name added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>

          <div>
            <h6 className="pb-2 text-lg">Email Address</h6>
            <p>
              {" "}
              {formData.email || (
                <span className="text-gray-500">No email added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>
          <div>
            <h6 className="pb-2 text-lg">Phone Number</h6>
            <p>
              {" "}
              {formData.phone_number || (
                <span className="text-gray-500">No phone number added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>
          <div>
            <h6 className="pb-2 text-lg">Website</h6>
            <p>
              {" "}
              {formData.website_url || (
                <span className="text-gray-500">No website added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>
          <div>
            <h6 className="pb-2 text-lg">Location</h6>
            <p>
              {" "}
              {formData.location || (
                <span className="text-gray-500">No location added</span>
              )}
            </p>
            <div className="divider m-0"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          <div>
            <h6 className="text-2xl">
              Contact Information
              <span
                className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning"} mx-4`}>
                {!isEditing ? "Viewing" : "Editing"}
              </span>
            </h6>
          </div>

          <div className="mt-4">
            <form onSubmit={HandleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input input-lg w-full"
                    name="first_name"
                    value={formData.first_name}
                    onChange={HandleChange}
                  />
                  <span>First Name</span>
                </label>
                {fieldErrors.first_name && (
                  <p className="text-error text-sm">
                    {fieldErrors.first_name[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="input input-lg w-full"
                    name="last_name"
                    value={formData.last_name}
                    onChange={HandleChange}
                  />
                  <span>Last Name</span>
                </label>
                {fieldErrors.last_name && (
                  <p className="text-error text-sm">
                    {fieldErrors.last_name[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Email"
                    className="input input-lg w-full"
                    name="email"
                    value={formData.email}
                    onChange={HandleChange}
                  />
                  <span>Email</span>
                </label>
                {fieldErrors.email && (
                  <p className="text-error text-sm">{fieldErrors.email[0]}</p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Contact Number"
                    className="input input-lg w-full"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={HandleChange}
                  />
                  <span>Contact Number</span>
                </label>
                {fieldErrors.phone_number && (
                  <p className="text-error text-sm">
                    {fieldErrors.phone_number[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Website"
                    className="input input-lg w-full"
                    name="website_url"
                    value={formData.website_url}
                    onChange={HandleChange}
                  />
                  <span>Website </span>
                </label>
                {fieldErrors.website_url && (
                  <p className="text-error text-sm">
                    {fieldErrors.website_url[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Location"
                    className="input input-lg w-full"
                    name="location"
                    value={formData.location}
                    onChange={HandleChange}
                  />
                  <span>Location </span>
                </label>
                {fieldErrors.location && (
                  <p className="text-error text-sm">
                    {fieldErrors.location[0]}
                  </p>
                )}
              </div>
              {error && <p className="text-error text-sm">{error}</p>}
              <div className="flex justify-end space-x-8">
                <button type="submit" className="btn btn-outline btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error"
                  onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function AccountTab({ MyProfile, setMyProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [userName, setUserName] = useState(MyProfile?.user.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function HandleUpdate(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!password) {
      setError("New password are required.");
      return;
    }
    if (!confirmPassword) {
      setError("Confirm password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const payload = {
        password: password,
      };
      console.log("payload sent: ", payload);
      const data = await ChangePassword(payload);
      setIsEditing(false);
    } catch (err) {
      if (err) {
        setFieldErrors(err);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  async function ClearFields() {
    setPassword("");
    setConfirmPassword("");
    setError("");
  }

  return (
    <>
      {!isEditing ? (
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex justify-between mb-8">
            <h6 className="text-2xl">
              Account
              <span
                className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning"} mx-4`}>
                {!isEditing ? "Viewing" : "Editing"}
              </span>
            </h6>

            <div>
              <button
                className="btn btn-outline btn-primary"
                onClick={(e) => {
                  setIsEditing(true);
                }}>
                Change Password
              </button>
            </div>
          </div>

          <div>
            <h6 className="pb-2 text-lg">Username</h6>
            <p>{userName}</p>
            <div className="divider m-0"></div>
          </div>

          <div>
            <h6 className="pb-2 text-lg">Password</h6>
            <p>••••••••••</p>
            <div className="divider m-0"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          <div>
            <h6 className="text-2xl">
              Account
              <span
                className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning"} mx-4`}>
                {!isEditing ? "Viewing" : "Editing"}
              </span>
            </h6>
          </div>

          <div className="mt-4">
            <form onSubmit={HandleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="floating-label">
                  <div className="relative w-full">
                    <input
                      type="password"
                      placeholder="New Password"
                      className="input input-lg w-full pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <span>New Password</span>
                </label>
                {fieldErrors.password && (
                  <p className="text-error text-sm">
                    {fieldErrors.password[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="floating-label">
                  <div className="relative w-full">
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="input input-lg w-full pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <span>Confirm Password</span>
                </label>
              </div>
              {error && <p className="text-error text-sm mt-2">{error}</p>}
              <div className="flex justify-end space-x-8">
                <button type="submit" className="btn btn-outline btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-error"
                  onClick={() => {
                    (setIsEditing(false), ClearFields());
                  }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
