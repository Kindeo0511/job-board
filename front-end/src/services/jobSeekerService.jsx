import { authFetch } from "./authService";
const API_URL = "http://127.0.0.1:8000/api/";

export async function MyProfile() {
  const response = await authFetch(`${API_URL}job-seeker/profile/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.details);
  }

  return data;
}

export async function UpdateBasicInfo(payload) {
  const response = await authFetch(`${API_URL}job-seeker/update/basic-info/`, {
    method: "PUT",

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function UpdateContactInfo(payload) {
  const response = await authFetch(
    `${API_URL}job-seeker/update/contact-info/`,
    {
      method: "PUT",

      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function UpdateAboutInfo(payload) {
  const response = await authFetch(`${API_URL}job-seeker/update/about/`, {
    method: "PUT",

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function UpdateJobSeekerProfile(payload) {
  const response = await authFetch(`${API_URL}job-seeker/update/`, {
    method: "PATCH",

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function UpdateJobSeekerPassword(password) {
  const response = await authFetch(`${API_URL}account/change-password/`, {
    method: "PUT",
    body: JSON.stringify(password),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function SendResumeToEmployer(payload, id) {
  const response = await authFetch(`${API_URL}job-application/${id}/apply/`, {
    method: "POST",
    body: payload,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function UploadPhotoJobSeeker(payload) {
  const response = await authFetch(`${API_URL}job-seeker/upload/photo/`, {
    method: "PATCH",
    body: payload,
  });

  const data = await response.json();
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    errorDetail = data.detail || errorDetail;

    throw new Error(errorDetail);
  }

  return data;
}
export async function UpdateResume(payload) {
  const response = await authFetch(`${API_URL}job-seeker/upload/resume/`, {
    method: "PUT",
    body: payload,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function GetResume() {
  const response = await authFetch(`${API_URL}job-seeker/my/resume/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function RemoveResume() {
  const response = await authFetch(`${API_URL}job-seeker/delete/resume/`, {
    method: "DELETE",
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || `Request failed with status ${response.status}`,
    );
  }

  return null;
}
export async function MyJobApplications(status, page) {
  const params = new URLSearchParams();

  if (status !== null) params.append("status", status);
  if (page !== null) params.append("page", page);
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await authFetch(`${API_URL}my-job-application/${query}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function AddWorkExperience(payload) {
  const response = await authFetch(`${API_URL}add/experience/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function UpdateWorkExperience(payload, id) {
  const response = await authFetch(`${API_URL}update/experience/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function DeleteWorkExperience(id) {
  const response = await authFetch(`${API_URL}delete/experience/${id}/`, {
    method: "DELETE",
  });

  const data = await response.json();
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    const errData = await response.json();
    errorDetail = errData.detail || errorDetail;

    throw new Error(errorDetail);
  }

  if (response.status !== 204) {
    return response.json();
  }

  return null;
}

// EDUCATION
export async function AddEducation(payload) {
  const response = await authFetch(`${API_URL}add/education/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function UpdateEducation(payload, id) {
  const response = await authFetch(`${API_URL}update/education/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function DeleteEducation(id) {
  const response = await authFetch(`${API_URL}delete/education/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    const errData = await response.json();

    errorDetail = errData.detail || errorDetail;

    throw new Error(errorDetail);
  }

  return null;
}

// SKILL
export async function AddSkill(payload) {
  const response = await authFetch(`${API_URL}add/skill/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function DeleteSkill(id) {
  const response = await authFetch(`${API_URL}delete/skill/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    const errorData = await response.json();
    errorDetail = errorData.detail || errorDetail;

    throw new Error(errorDetail);
  }

  return null;
}
