import { authFetch } from "./authService";

const API_URL = "http://127.0.0.1:8000/";

export async function ViewAllJobs(job_title, page) {
  const params = new URLSearchParams();
  if (job_title !== null) params.append("title", job_title);
  if (page !== null) params.append("page", page);
  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await authFetch(`${API_URL}api/job/${query}`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}
export async function getAllJobPostsByEmployer(is_active = null, page) {
  const params = new URLSearchParams();
  if (is_active !== null) params.append("is_active", is_active);
  if (page !== null) params.append("page", page);
  const query = params.toString() ? `?${params.toString()}` : "";
  const response = await authFetch(`${API_URL}api/job/employer/${query}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail);
  }

  return await response.json();
}

export async function addJobPost(data) {
  const response = await authFetch(`${API_URL}api/job/create/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail);
  }

  return await response.json();
}

export async function updateJobPost(data, id) {
  const response = await authFetch(`${API_URL}api/job/update/${id}/`, {
    method: "PUT",

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail);
  }

  return await response.json();
}

export async function closeJobPost(payload, id) {
  const response = await authFetch(`${API_URL}api/job/update/${id}/`, {
    method: "PATCH",

    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }

  return data;
}
