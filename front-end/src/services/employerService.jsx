import { authFetch } from "./authService";
const API_URL = import.meta.env.VITE_API_URL;

export async function MyProfile() {
  const response = await authFetch(`${API_URL}employer/me/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function UpdateEmployerCompanyProfile(payload) {
  const response = await authFetch(
    `${API_URL}api/employer/update/company-profile/`,
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
export async function UpdateEmployerCompanyContact(payload) {
  const response = await authFetch(
    `${API_URL}api/employer/update/company-contact/`,
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
export async function ChangePassword(payload) {
  const response = await authFetch(`${API_URL}api/account/change-password/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function UploadPhoto(payload) {
  const response = await authFetch(`${API_URL}api/employer/upload/photo/`, {
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
export async function countTotalJobAndActive() {
  const response = await authFetch(`${API_URL}api/job/total/`, {
    method: "GET",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function CountApplicants() {
  const response = await authFetch(`${API_URL}api/job-application/total/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function GetEmployerApplicants(
  jobTitle = null,
  jobStatus = null,
  page = null,
) {
  const params = new URLSearchParams();

  if (jobTitle) params.append("job_title", jobTitle);
  if (jobStatus) params.append("job_status", jobStatus);
  if (page) params.append("page", page);

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await authFetch(
    `${API_URL}api/employer/applicants/${query}`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function GetApplicantById(id) {
  const response = await authFetch(`${API_URL}api/employer/applicant/${id}/`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}

export async function UpdateApplicantStatus(payload, id) {
  const response = await authFetch(
    `${API_URL}api/job-application/update/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}
