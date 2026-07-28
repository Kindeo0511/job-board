import React, { useState, useRef } from "react";
import {
  UpdateJobSeekerProfile,
  UpdateBasicInfo,
  UpdateContactInfo,
  UpdateAboutInfo,
  UpdateResume,
  RemoveResume,
  UploadPhotoJobSeeker,
  UpdateJobSeekerPassword,
  AddWorkExperience,
  UpdateWorkExperience,
  DeleteWorkExperience,
  AddEducation,
  UpdateEducation,
  DeleteEducation,
  AddSkill,
  DeleteSkill,
} from "../services/jobSeekerService";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function formatDateToYear(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
  });
}
export function ProfileTab({ loading, MyProfile, setMyProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingContactInfo, setEditingContactInfo] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingWorkExperience, setEditingWorkExperience] = useState(false);
  const [editingEducation, setEditingEducation] = useState(false);
  const [isResumeEditing, setResumeEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isEducNew, setIsEducNew] = useState(false);
  const [formData, setFormData] = useState({
    first_name: MyProfile?.user.first_name || "",
    last_name: MyProfile?.user.last_name || "",
    job_title: MyProfile?.job_title || "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const getInitials = (firstName, lastName) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };
  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-400",
      "bg-orange-400",
      "bg-amber-400",
      "bg-lime-400",
      "bg-green-400",
      "bg-teal-400",
      "bg-cyan-400",
      "bg-blue-400",
      "bg-indigo-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-rose-400",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };
  const fullName = `${formData.first_name} ${formData.last_name}`;
  const [contactInformation, setContactInformation] = useState({
    email: MyProfile?.user.email || "",
    phone_number: MyProfile?.phone_number || "",
    location: MyProfile?.location || "",
    portfolio_url: MyProfile?.portfolio_url || "",
  });
  const [about, setAbout] = useState({
    about: MyProfile?.about || "",
  });
  const [experience, setExperience] = useState({
    experiences:
      MyProfile?.experiences.map((exp) => ({
        id: exp.id,
        title: exp.title || "",
        company: exp.company || "",
        start_date: exp.start_date || "",
        end_date: exp.end_date || "",
        description: exp.description || "",
      })) || [],
  });

  const [education, setEducation] = useState({
    educations: MyProfile?.educations.map((educ) => ({
      id: educ.id,
      degree: educ.degree || "",
      school: educ.school || "",
      start_year: educ.start_year || "",
      end_year: educ.end_year || "",
    })),
  });

  const [skill, setSkill] = useState({
    skills: MyProfile?.skills.map((skill) => ({
      id: skill.id || "",
      name: skill.name || "",
    })),
  });
  const [resume, setResume] = useState(MyProfile?.resume || "");

  async function HandleUpdate(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    try {
      const data = await UpdateBasicInfo(formData);

      setFormData((prev) => ({ ...prev, data }));
      setIsEditing(false);
    } catch (err) {
      if (err) {
        setFieldErrors(err);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    // try {
    //   const data = await UpdateEmployerProfile(formData);
    //   setFormData((prev) => ({ ...prev, data }));
    //   setIsEditing(false);
    // } catch (err) {
    //   console.error(err.message);
    // }
  }
  async function UpdateContactInformation(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    try {
      const payload = {
        email: contactInformation.email,
        phone_number: contactInformation.phone_number,
        location: contactInformation.location,
        portfolio_url: contactInformation.portfolio_url,
      };

      const data = await UpdateContactInfo(payload);
      setContactInformation((prev) => ({
        ...prev,
        data,
      }));
      setEditingContactInfo(false);
    } catch (err) {
      if (err) {
        setFieldErrors(err);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }
  async function UpdateAbout(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    try {
      const payload = {
        about: about.about,
      };

      const data = await UpdateAboutInfo(payload);
      setAbout((prev) => ({ ...prev, about: data.about }));
      setEditingAbout(false);
    } catch (err) {
      setFieldErrors(err);
    }
  }
  const [experienceFormData, setExperienceFormData] = useState({
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const emptyForm = {
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    description: "",
  };
  async function HandleWorkExperience(e) {
    e.preventDefault();
    setFieldErrors({});
    try {
      const payload = {
        title: experienceFormData.title,
        company: experienceFormData.company,
        start_date: experienceFormData.start_date,
        end_date: experienceFormData.end_date || null,
        description: experienceFormData.description,
      };

      if (isNew) {
        const data = await AddWorkExperience(payload);
        setExperience((prev) => ({
          ...prev,
          experiences: [...prev.experiences, data],
        }));
        setIsNew(false);
      } else {
        const data = await UpdateWorkExperience(payload, editingId);

        setExperience((prev) => ({
          ...prev,
          experiences: prev.experiences.map((exp) =>
            exp.id === editingId ? data : exp,
          ),
        }));
        setEditingId(null);
      }

      setEditingWorkExperience(false);
    } catch (err) {
      setFieldErrors(err);
    }
  }
  async function HandleDeleteWorkExperience(id) {
    try {
      await DeleteWorkExperience(id);
      setExperience((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((exp) => exp.id !== id),
      }));

      if (editingId === id) {
        setEditingId(null);
        setExperienceFormData(emptyForm);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  // EDUCATION
  const [educationFormData, setEducationFormData] = useState({
    degree: "",
    school: "",
    start_year: "",
    end_year: "",
  });
  const emptyEducationForm = {
    degree: "",
    school: "",
    start_year: "",
    end_year: "",
  };
  async function HandleEducation(e) {
    e.preventDefault();
    setFieldErrors({});
    try {
      const payload = {
        job_seeker: MyProfile.id,
        degree: educationFormData.degree,
        school: educationFormData.school,
        start_year: parseInt(educationFormData.start_year),
        end_year: parseInt(educationFormData.end_year),
      };
      if (isEducNew) {
        const data = await AddEducation(payload);

        setEducation((prev) => ({
          ...prev,
          educations: [...prev.educations, data],
        }));
        setIsEducNew(false);
      } else {
        const data = await UpdateEducation(payload, editingId);
        setEducation((prev) => ({
          ...prev,
          educations: prev.educations.map((educ) =>
            educ.id === editingId ? data : educ,
          ),
        }));
        setEditingId(null);
      }

      setEditingEducation(false);
    } catch (err) {
      setFieldErrors(err);
    }
  }
  async function HandleDeleteEducation(id) {
    try {
      await DeleteEducation(id);

      setEducation((prev) => ({
        ...prev,
        educations: prev.educations.filter((educ) => educ.id !== id),
      }));

      if (editingId === id) {
        setEditingId(null);
        setEducationFormData(emptyEducationForm);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
  async function HandleResume(e) {
    e.preventDefault();
    setFieldErrors({});
    const formData = new FormData();

    if (resume) {
      formData.append("resume", resume);
    }

    if (isResumeEditing) {
      try {
        const data = await UpdateResume(formData);

        setResume(data.resume ?? resume);
        setResumeEditing(false);
      } catch (err) {
        setFieldErrors(err);
      }
    }
  }
  async function DeleteResume() {
    try {
      await RemoveResume();
      setResume("");
    } catch (err) {
      console.error(err.message);
    }
  }
  async function handleDownloadResume(url) {
    if (!url) {
      alert("No resume file available to download.");
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download resume. Please try again.");
    }
  }
  const [skillInput, setSkillInput] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);

  async function CreateSkill() {
    setFieldErrors({});
    try {
      const payload = {
        job_seeker: MyProfile.id,
        name: skillInput,
      };

      const data = await AddSkill(payload);
      setSkill((prev) => ({
        ...prev,
        skills: [...prev.skills, data],
      }));
      setSkillInput("");
      setShowSkillInput(false);
    } catch (err) {
      setFieldErrors(err);
    }
  }

  async function RemoveSkill(id) {
    try {
      const data = await DeleteSkill(id);
      setSkill({
        ...skill,
        skills: skill.skills.filter((s) => (s.id || s.name) !== id),
      });
    } catch (err) {
      console.error(err.message);
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
      const data = await UploadPhotoJobSeeker(payload);
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-baseline">
          <div>
            <h6 className="text-2xl">
              My Profile
              <span
                className={`badge badge-soft ${!isEditing ? "badge-success" : "badge-warning mx-4"} mx-4`}>
                {!isEditing ? "Viewing" : "Editing"}
              </span>
            </h6>
          </div>

          <div></div>
        </div>

        {/* PROFILE LOGO */}

        <div className="card bg-base-100 border border-base-300">
          {loading ? (
            <span className="loading loading-spinner loading-xl"></span>
          ) : !isEditing ? (
            <div className="card-body p-4">
              <div className="flex items-center gap-4">
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
                          {getInitials(formData.first_name, formData.last_name)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-base-content/60">
                    {formData.first_name || formData.last_name ? (
                      `${formData.first_name || ""} ${formData.last_name || ""}`.trim()
                    ) : (
                      <span className="text-gray-500">No full name added</span>
                    )}
                  </p>

                  <p className="text-sm text-base-content/60">
                    {formData.job_title || (
                      <span className="text-gray-500">No job title added</span>
                    )}
                  </p>
                </div>

                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => setIsEditing(true)}>
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
                    className="lucide lucide-square-pen-icon lucide-square-pen">
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 mx-6">
                <form onSubmit={HandleUpdate} className="flex flex-col gap-8">
                  <div className="flex gap-16 w-full">
                    <div className="w-1/2">
                      <label className="floating-label">
                        <input
                          type="text"
                          placeholder="First Name"
                          className="input input-lg w-full"
                          name="firstName"
                          value={formData.first_name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,

                              first_name: e.target.value,
                            }))
                          }
                        />
                        <span>First Name</span>
                      </label>
                      {fieldErrors.first_name && (
                        <p className="text-error">
                          {fieldErrors.first_name[0]}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2">
                      <label className="floating-label">
                        <input
                          type="text"
                          placeholder="Last Name"
                          className="input input-lg w-full"
                          name="lastName"
                          value={formData.last_name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              last_name: e.target.value,
                            }))
                          }
                        />
                        <span>Last Name</span>
                      </label>
                      {fieldErrors.last_name && (
                        <p className="text-error">{fieldErrors.last_name[0]}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="floating-label">
                      <input
                        type="text"
                        placeholder="Job Title"
                        className="input input-lg w-full"
                        name="job_title"
                        value={formData.job_title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            job_title: e.target.value,
                          }))
                        }
                      />
                      <span>Job Title</span>
                    </label>
                    {fieldErrors.job_title && (
                      <p className="text-error">{fieldErrors.job_title[0]}</p>
                    )}
                  </div>
                  {error && <div className="text-error">{error}</div>}
                  <div className="flex justify-end space-x-8 mb-4">
                    <button
                      type="submit"
                      className="btn btn-outline btn-primary">
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
            </>
          )}
        </div>
        {/* Contact information */}
        <div className="card bg-base-100 border border-base-300">
          {loading ? (
            <span className="loading loading-spinner loading-xl"></span>
          ) : !editingContactInfo ? (
            <div className="card-body p-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="font-medium mb-2">Contact information</p>
                </div>
                <div>
                  <button
                    className="btn btn-outline btn-primary"
                    onClick={() => setEditingContactInfo(true)}>
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
                      className="lucide lucide-square-pen-icon lucide-square-pen">
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                    </svg>
                    Edit
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <span>
                  {contactInformation.email || (
                    <span className="text-gray-500">No email added</span>
                  )}
                </span>
                <span>
                  {contactInformation.phone_number || (
                    <span className="text-gray-500">No phone number added</span>
                  )}
                </span>
                <span>
                  {contactInformation.location || (
                    <span className="text-gray-500">No location added</span>
                  )}
                </span>
                {contactInformation.portfolio_url ? (
                  <a
                    href={contactInformation.portfolio_url}
                    className="text-info">
                    {contactInformation.portfolio_url}
                  </a>
                ) : (
                  <span className="text-gray-500">No portfolio link added</span>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 mx-6">
              <form
                onSubmit={UpdateContactInformation}
                className="flex flex-col gap-8">
                <div>
                  <label className="floating-label">
                    <input
                      type="email"
                      placeholder="Email"
                      className="input input-lg w-full"
                      name="user.email"
                      value={contactInformation.email}
                      onChange={(e) =>
                        setContactInformation((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    <span>Email</span>
                  </label>
                  {fieldErrors.email && (
                    <p className="text-error">{fieldErrors.email[0]}</p>
                  )}
                </div>
                <div>
                  <label className="floating-label">
                    <input
                      type="text"
                      placeholder="Contact"
                      className="input input-lg w-full"
                      name="Contact"
                      value={contactInformation.phone_number}
                      onChange={(e) =>
                        setContactInformation((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                    />
                    <span>Contact</span>
                  </label>
                  {fieldErrors.phone_number && (
                    <p className="text-error">{fieldErrors.phone_number[0]}</p>
                  )}
                </div>

                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Location"
                    className="input input-lg w-full"
                    name="location"
                    value={contactInformation.location}
                    onChange={(e) =>
                      setContactInformation((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                  />
                  <span>location</span>
                  {fieldErrors.location && (
                    <p className="text-error">{fieldErrors.location[0]}</p>
                  )}
                </label>

                <label className="floating-label">
                  <input
                    type="text"
                    placeholder="Portfolio"
                    className="input input-lg w-full"
                    name="portfolio_url"
                    value={contactInformation.portfolio_url}
                    onChange={(e) =>
                      setContactInformation((prev) => ({
                        ...prev,
                        portfolio_url: e.target.value,
                      }))
                    }
                  />
                  <span>Portfolio</span>
                  {fieldErrors.portfolio_url && (
                    <p className="text-error">{fieldErrors.portfolio_url[0]}</p>
                  )}
                </label>
                {error && <p className="text-error">{error}</p>}
                <div className="flex justify-end space-x-8 mb-4">
                  <button type="submit" className="btn btn-outline btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-error"
                    onClick={() => setEditingContactInfo(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* About */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4">
            <div className="flex justify-between items-baseline">
              <p className="font-medium mb-2">About</p>
              <button
                className="btn btn-outline btn-primary"
                onClick={() => setEditingAbout(true)}>
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
                  className="lucide lucide-square-pen-icon lucide-square-pen">
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
                Edit
              </button>
            </div>
            {loading ? (
              <span className="loading loading-dots loading-xl"></span>
            ) : !editingAbout ? (
              <>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {about.about === "" || about.about === null ? (
                    <span className="text-gray-500">
                      No about yet. Click Edit to add one.
                    </span>
                  ) : (
                    about.about
                  )}
                </p>
              </>
            ) : (
              //  About Form
              <div className="mt-8 mx-6">
                <form onSubmit={UpdateAbout} className="flex flex-col gap-8">
                  <div>
                    <label className="floating-label">
                      <textarea
                        placeholder="About"
                        className="textarea textarea-lg w-full h-40"
                        name="about"
                        value={about.about}
                        onChange={(e) =>
                          setAbout((prev) => ({
                            ...prev,
                            about: e.target.value,
                          }))
                        }></textarea>

                      <span>About</span>
                    </label>
                    {fieldErrors.about && (
                      <p className="text-error">{fieldErrors.about[0]}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-8 mb-4">
                    <button
                      type="submit"
                      className="btn btn-outline btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-error"
                      onClick={() => setEditingAbout(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        {/* Work experience */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4">
            <div className="flex justify-between items-baseline">
              <p className="font-medium mb-3">Work experience</p>
            </div>

            <div className="flex flex-col gap-4">
              {!experience.experiences ||
              experience.experiences.length === 0 ? (
                <span className="text-gray-500">
                  No experience yet. Click "Add Experience" to add one.
                </span>
              ) : (
                experience.experiences.map((exp, index) => (
                  <React.Fragment key={exp.id || index}>
                    <div>
                      {editingId === exp.id ? (
                        <form
                          onSubmit={HandleWorkExperience}
                          className="flex flex-col gap-8">
                          <div className="grid grid-cols-2 gap-6 justify-center">
                            <div>
                              <label className="floating-label">
                                <input
                                  type="text"
                                  className="input input-bordered input-lg w-full"
                                  value={experienceFormData.title}
                                  onChange={(e) =>
                                    setExperienceFormData((prev) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                  placeholder="Job title"
                                />
                                <span>Job Title</span>
                              </label>
                              {fieldErrors.title && (
                                <p className="text-error">
                                  {fieldErrors.title[0]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="floating-label">
                                <input
                                  type="text"
                                  className="input input-bordered input-lg w-full"
                                  value={experienceFormData.company}
                                  onChange={(e) =>
                                    setExperienceFormData((prev) => ({
                                      ...prev,
                                      company: e.target.value,
                                    }))
                                  }
                                  placeholder="Company"
                                />
                                <span>Company</span>
                              </label>
                              {fieldErrors.company && (
                                <p className="text-error">
                                  {fieldErrors.company[0]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="floating-label">
                                <input
                                  type="date"
                                  className="input input-bordered input-lg w-full"
                                  value={experienceFormData.start_date}
                                  onChange={(e) =>
                                    setExperienceFormData((prev) => ({
                                      ...prev,
                                      start_date: e.target.value,
                                    }))
                                  }
                                  placeholder="Start date"
                                />
                                <span>Start Date</span>
                              </label>
                              {fieldErrors.start_date && (
                                <p className="text-error">
                                  {fieldErrors.start_date[0]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="floating-label">
                                <input
                                  type="date"
                                  className="input input-bordered input-lg w-full"
                                  value={experienceFormData.end_date}
                                  onChange={(e) =>
                                    setExperienceFormData((prev) => ({
                                      ...prev,
                                      end_date: e.target.value,
                                    }))
                                  }
                                  placeholder="End date"
                                  disabled={exp.is_current}
                                />
                                <span>End Date</span>
                              </label>
                              {fieldErrors.end_date && (
                                <p className="text-error">
                                  {fieldErrors.end_date[0]}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="floating-label">
                              <textarea
                                className="textarea textarea-bordered textarea-lg w-full"
                                value={experienceFormData.description}
                                onChange={(e) =>
                                  setExperienceFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                placeholder="Description"
                              />
                              <span>Job Description</span>
                            </label>
                            {fieldErrors.description && (
                              <p className="text-error">
                                {fieldErrors.description[0]}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary">
                              Save Changes
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-ghost"
                              onClick={() => {
                                // const cancelledEntry =
                                //   experience.experiences.find(
                                //     (exp) => exp.id === editingId,
                                //   );
                                // if (cancelledEntry?.isNew) {
                                //   setExperience((prev) => ({
                                //     ...prev,
                                //     experiences: prev.experiences.filter(
                                //       (exp) => exp.id !== editingId,
                                //     ),
                                //   }));
                                // }
                                setEditingId(null);
                                setIsNew(false);
                                setExperienceFormData(emptyForm);
                              }}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-baseline">
                            <p className="font-medium text-sm">{exp.title}</p>
                            <p className="text-xs text-base-content/60">
                              {`${formatDate(exp.start_date)} - ${exp.end_date ? formatDate(exp.end_date) : "Present"}`}
                            </p>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-outline btn-primary"
                                onClick={() => {
                                  setEditingId(exp.id);
                                  setExperienceFormData({
                                    title: exp.title,
                                    company: exp.company,
                                    start_date: exp.start_date
                                      ? exp.start_date
                                      : "",
                                    end_date: exp.end_date ? exp.end_date : "",
                                    description: exp.description,
                                  });
                                }}>
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
                                  className="lucide lucide-square-pen-icon lucide-square-pen">
                                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                                </svg>
                              </button>
                              <button
                                className="btn btn-sm btn-outline btn-error"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Delete this experience entry?",
                                    )
                                  ) {
                                    HandleDeleteWorkExperience(exp.id);
                                  }
                                }}>
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
                                  className="lucide lucide-trash2-icon lucide-trash-2">
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-base-content/80">
                            {exp.company}
                          </p>
                          <p className="text-sm text-base-content/60 mt-1 leading-relaxed">
                            {exp.description}
                          </p>
                        </>
                      )}
                    </div>

                    {index < experience.experiences.length - 1 && (
                      <div className="divider my-0" />
                    )}
                  </React.Fragment>
                ))
              )}
              {isNew && (
                <form
                  onSubmit={HandleWorkExperience}
                  className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-6 justify-center">
                    <div>
                      <label className="floating-label">
                        <input
                          type="text"
                          className="input input-bordered input-lg w-full"
                          value={experienceFormData.title}
                          onChange={(e) =>
                            setExperienceFormData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Job title"
                        />
                        <span>Job Title</span>
                      </label>
                      {fieldErrors.title && (
                        <p className="text-error">{fieldErrors.title[0]}</p>
                      )}
                    </div>
                    <div>
                      <label className="floating-label">
                        <input
                          type="text"
                          className="input input-bordered input-lg w-full"
                          value={experienceFormData.company}
                          onChange={(e) =>
                            setExperienceFormData((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                          placeholder="Company"
                        />
                        <span>Company</span>
                      </label>
                      {fieldErrors.company && (
                        <p className="text-error">{fieldErrors.company[0]}</p>
                      )}
                    </div>
                    <div>
                      <label className="floating-label">
                        <input
                          type="date"
                          className="input input-bordered input-lg w-full"
                          value={experienceFormData.start_date}
                          onChange={(e) =>
                            setExperienceFormData((prev) => ({
                              ...prev,
                              start_date: e.target.value,
                            }))
                          }
                          placeholder="Start date"
                        />
                        <span>Start Date</span>
                      </label>
                      {fieldErrors.start_date && (
                        <p className="text-error">
                          {fieldErrors.start_date[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="floating-label">
                        <input
                          type="date"
                          className="input input-bordered input-lg w-full"
                          value={experienceFormData.end_date}
                          onChange={(e) =>
                            setExperienceFormData((prev) => ({
                              ...prev,
                              end_date: e.target.value,
                            }))
                          }
                          placeholder="End date"
                        />
                        <span>End Date</span>
                      </label>
                      {fieldErrors.end_date && (
                        <p className="text-error">{fieldErrors.end_date[0]}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="floating-label">
                      <textarea
                        className="textarea textarea-bordered textarea-lg w-full"
                        value={experienceFormData.description}
                        onChange={(e) =>
                          setExperienceFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description"
                      />
                      <span>Job Description</span>
                    </label>
                    {fieldErrors.description && (
                      <p className="text-error">{fieldErrors.description[0]}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" className="btn btn-sm btn-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => {
                        setEditingId(null);
                        setIsNew(false);
                        setExperienceFormData(emptyForm);
                      }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="divider my-0" />
              <div>
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => {
                    setExperienceFormData(emptyForm);
                    setEditingId(null);
                    setIsNew(true);
                  }}>
                  Add Experience
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4">
            <div className="flex justify-between items-baseline">
              <p className="font-medium mb-3">Education</p>
            </div>
            <div className="flex flex-col gap-4 ">
              {!education.educations || education.educations.length === 0 ? (
                <span className="text-gray-500">
                  No education yet. Click "Add Education" to add one.
                </span>
              ) : (
                education.educations.map((educ, index) => (
                  <React.Fragment key={educ.id || index}>
                    <div>
                      {editingId === educ.id ? (
                        // --- Inline edit form ---
                        <form
                          onSubmit={HandleEducation}
                          className="flex flex-col gap-8">
                          <div className="grid grid-cols-2 gap-6 justify-center">
                            <div>
                              <label className="floating-label">
                                <input
                                  type="text"
                                  className="input input-bordered input-lg w-full"
                                  value={educationFormData.degree}
                                  onChange={(e) =>
                                    setEducationFormData((prev) => ({
                                      ...prev,
                                      degree: e.target.value,
                                    }))
                                  }
                                  placeholder="Degree"
                                />
                                <span>Degree</span>
                              </label>
                              {fieldErrors.degree && (
                                <p className="text-error">
                                  {fieldErrors.degree[0]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="floating-label">
                                <input
                                  type="text"
                                  className="input input-bordered input-lg w-full"
                                  value={educationFormData.school}
                                  onChange={(e) =>
                                    setEducationFormData((prev) => ({
                                      ...prev,
                                      school: e.target.value,
                                    }))
                                  }
                                  placeholder="School"
                                />
                                <span>School</span>
                              </label>
                              {fieldErrors.school && (
                                <p className="text-error">
                                  {fieldErrors.school[0]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="floating-label">
                                <select
                                  className="select select-bordered select-lg w-full"
                                  value={educationFormData.start_year}
                                  onChange={(e) =>
                                    setEducationFormData((prev) => ({
                                      ...prev,
                                      start_year: e.target.value,
                                    }))
                                  }>
                                  <option value="">Select year</option>
                                  {Array.from(
                                    { length: 60 },
                                    (_, i) => new Date().getFullYear() + 5 - i,
                                  ).map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                                <span>Start Year</span>
                              </label>
                              {fieldErrors.start_year && (
                                <p className="text-error">
                                  {fieldErrors.start_year[0]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="floating-label">
                                <select
                                  className="select select-bordered select-lg w-full"
                                  value={educationFormData.end_year}
                                  onChange={(e) =>
                                    setEducationFormData((prev) => ({
                                      ...prev,
                                      end_year: e.target.value,
                                    }))
                                  }>
                                  <option value="">Select year</option>
                                  {Array.from(
                                    { length: 60 },
                                    (_, i) => new Date().getFullYear() + 5 - i,
                                  ).map((year) => (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  ))}
                                </select>
                                <span>End Year</span>
                              </label>
                              {fieldErrors.end_year && (
                                <p className="text-error">
                                  {fieldErrors.end_year[0]}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* <label className="label cursor-pointer justify-start gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            defaultChecked={exp.is_current}
                          />
                          <span className="label-text text-sm">
                            I currently work here
                          </span>
                        </label> */}

                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="submit"
                              className="btn btn-sm btn-primary">
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        // --- Summary view ---
                        <>
                          <div className="flex justify-between items-baseline">
                            <p className="font-medium text-sm">{educ.degree}</p>
                            <p className="text-xs text-base-content/60">
                              {`${educ.start_year} - ${educ.end_year ? educ.end_year : "Present"}`}
                            </p>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-outline btn-primary"
                                onClick={() => {
                                  setEditingId(educ.id);
                                  setEducationFormData({
                                    degree: educ.degree,
                                    school: educ.school,
                                    start_year: educ.start_year
                                      ? educ.start_year
                                      : "",
                                    end_year: educ.end_year
                                      ? educ.end_year
                                      : "",
                                  });
                                }}>
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
                                  className="lucide lucide-square-pen-icon lucide-square-pen">
                                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                                </svg>
                              </button>
                              <button
                                className="btn btn-sm btn-outline btn-error"
                                onClick={() => {
                                  if (
                                    window.confirm("Delete this education?")
                                  ) {
                                    HandleDeleteEducation(educ.id);
                                  }
                                }}>
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
                                  className="lucide lucide-trash2-icon lucide-trash-2">
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-base-content/80">
                            {educ.school}
                          </p>
                        </>
                      )}
                    </div>

                    {index < education.educations.length - 1 && (
                      <div className="divider my-0" />
                    )}
                  </React.Fragment>
                ))
              )}
              {isEducNew && (
                <form
                  onSubmit={HandleEducation}
                  className="flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-6 justify-center">
                    <div>
                      <label className="floating-label">
                        <input
                          type="text"
                          className="input input-bordered input-lg w-full"
                          value={educationFormData.degree}
                          onChange={(e) =>
                            setEducationFormData((prev) => ({
                              ...prev,
                              degree: e.target.value,
                            }))
                          }
                          placeholder="Degree"
                        />
                        <span>Degree</span>
                      </label>
                      {fieldErrors.degree && (
                        <p className="text-error">{fieldErrors.degree[0]}</p>
                      )}
                    </div>
                    <div>
                      <label className="floating-label">
                        <input
                          type="text"
                          className="input input-bordered input-lg w-full"
                          value={educationFormData.school}
                          onChange={(e) =>
                            setEducationFormData((prev) => ({
                              ...prev,
                              school: e.target.value,
                            }))
                          }
                          placeholder="School"
                        />
                        <span>School</span>
                      </label>
                      {fieldErrors.school && (
                        <p className="text-error">{fieldErrors.school[0]}</p>
                      )}
                    </div>
                    <div>
                      <label className="floating-label">
                        <select
                          className="select select-bordered select-lg w-full"
                          value={educationFormData.start_year}
                          onChange={(e) =>
                            setEducationFormData((prev) => ({
                              ...prev,
                              start_year: e.target.value,
                            }))
                          }>
                          <option value="">Select year</option>
                          {Array.from(
                            { length: 60 },
                            (_, i) => new Date().getFullYear() + 5 - i,
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <span>Start Year</span>
                      </label>
                      {fieldErrors.start_year && (
                        <p className="text-error">
                          {fieldErrors.start_year[0]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="floating-label">
                        <select
                          className="select select-bordered select-lg w-full"
                          value={educationFormData.end_year}
                          onChange={(e) =>
                            setEducationFormData((prev) => ({
                              ...prev,
                              end_year: e.target.value,
                            }))
                          }>
                          <option value="">Select year</option>
                          {Array.from(
                            { length: 60 },
                            (_, i) => new Date().getFullYear() + 5 - i,
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <span>End Year</span>
                      </label>
                      {fieldErrors.end_year && (
                        <p className="text-error">{fieldErrors.end_year[0]}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" className="btn btn-sm btn-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost"
                      onClick={() => {
                        setEditingId(null);
                        setIsEducNew(false);
                        setEducationFormData(emptyForm);
                      }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              <div className="divider my-0" />
              <div>
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => {
                    setEducationFormData(emptyEducationForm);
                    setEditingId(null);
                    setIsEducNew(true);
                  }}>
                  Add Education
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Skills</p>
              <button
                className="btn btn-outline btn-primary btn-sm gap-1"
                onClick={() => setShowSkillInput(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center mt-3">
              {(!skill.skills || skill.skills.length === 0) &&
                !showSkillInput && (
                  <span className="text-gray-500">
                    No skill yet. Click "Add Skill" to add one.
                  </span>
                )}
              {skill.skills &&
                skill.skills.map((sk, index) => (
                  <span
                    key={sk.id || index}
                    className="badge badge-ghost gap-2 pl-3 pr-1 py-3">
                    {sk.name}
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this skill?")) {
                          RemoveSkill(sk.id);
                        }
                      }}
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-error text-error-content text-xs leading-none cursor-pointer">
                      x
                    </button>
                  </span>
                ))}
              {showSkillInput && (
                <div>
                  <input
                    autoFocus
                    className="input input-sm input-bordered w-48"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        CreateSkill();
                      }
                      if (e.key === "Escape") {
                        setSkillInput("");
                        setShowSkillInput(false);
                      }
                    }}
                    onBlur={CreateSkill}
                    placeholder="Type and press Enter"
                  />
                  {fieldErrors.name && (
                    <p className="text-error">{fieldErrors.name[0]}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Resume */}
        {!isResumeEditing ? (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <div className="flex justify-between">
                <p className="font-medium mb-2">My Resume</p>

                <button
                  className="btn btn-outline btn-info flex items-center gap-2"
                  onClick={() => setResumeEditing(true)}>
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
                    className="lucide lucide-upload-icon lucide-upload">
                    <path d="M12 3v12" />
                    <path d="m17 8-5-5-5 5" />
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  </svg>
                  Upload
                </button>
              </div>

              <div className="flex flex-row items-center gap-4 mt-4">
                {resume.length === 0 || resume === "" ? (
                  <span className="text-gray-500">
                    No resume yet. Click "Upload" to add one.
                  </span>
                ) : (
                  <>
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
                      className="lucide lucide-file-text-icon lucide-file-text">
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <h3 className="text-lg">{resume.split("/").pop()}</h3>
                      </div>
                      <div>
                        <div className="flex gap-4 mt-4">
                          <div>
                            <button
                              className="btn btn-outline btn-primary flex items-center gap-2"
                              onClick={() => {
                                handleDownloadResume(resume);
                              }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M12 15V3" />
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <path d="m7 10 5 5 5-5" />
                              </svg>
                            </button>
                          </div>

                          <div>
                            <button
                              className="btn btn-outline btn-error flex items-center gap-2"
                              onClick={() => DeleteResume()}>
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
                                className="lucide lucide-trash2-icon lucide-trash-2">
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <path d="M3 6h18" />
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium mb-2">My Resume </p>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full">
                    <input
                      type="file"
                      className="file-input file-input-info w-full"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setResume(file);
                        }
                      }}
                    />
                    {/* <p className="mt-4">
                      Current Resume:
                      <span className="ml-2">{resume.split("/").pop()}</span>
                    </p> */}
                    {fieldErrors.resume && (
                      <p className="text-error">{fieldErrors.resume[0]}</p>
                    )}
                  </div>
                  <div className="flex justify-end w-full gap-8">
                    <button
                      onClick={HandleResume}
                      className="btn btn-outline btn-primary">
                      Save Changes
                    </button>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => {
                        setResumeEditing(false);
                      }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export function SeekerAccountTab({ MyProfile, setMyProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState(MyProfile?.user.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  async function HandleUpdate(e) {
    e.preventDefault();
    setFieldErrors({});
    setError("");

    if (!newPassword.trim()) {
      setError("Password is required.");
      return;
    }
    if (!confirmPassword.trim()) {
      setError("Confirm password is required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const payload = {
      password: newPassword.trim(),
    };
    try {
      const data = await UpdateJobSeekerPassword(payload);
      console.log(data);
      setIsEditing(false);
    } catch (err) {
      setFieldErrors(err);
      console.log(err);
    }

    // try {
    //   const data = await UpdateEmployerProfile(formData);
    //   setFormData((prev) => ({ ...prev, data }));
    //   setIsEditing(false);
    // } catch (err) {
    //   console.error(err.message);
    // }
  }
  return (
    <>
      {!isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <h6 className="text-2xl">
                My Account
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
            <p>
              <input
                type="password"
                value="*********"
                readOnly
                className="border-none outline-none"
              />
            </p>
            <div className="divider m-0"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 ">
          <div>
            <h6 className="text-2xl">
              My Account
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
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <span>New Password</span>
                </label>
                {fieldErrors.password && (
                  <p className="text-error">{fieldErrors.password[0]}</p>
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
              {error && <p className="text-error">{error}</p>}
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
