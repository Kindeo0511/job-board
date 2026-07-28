const API_URL = "http://127.0.0.1:8000/";

export async function login(username, password) {
  const response = await fetch(`${API_URL}api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw data;
  }

  return data;
}
export async function getRole(accessToken) {
  const response = await fetch(`${API_URL}api/account/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return data;
}

export function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export async function RegisterEmployer(userData) {
  const response = await fetch(`${API_URL}api/register/employer/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}
export async function RegisterJobSeeker(userData) {
  const response = await fetch(`${API_URL}api/register/jobseeker/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}

export async function SendOTP(email) {
  const response = await fetch(`${API_URL}api/otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function VerifyOTP(email, otp) {
  const response = await fetch(`${API_URL}api/verify-otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function ResetPassword(payload) {
  const response = await fetch(`${API_URL}api/account/reset-password/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}
async function refresh() {
  const refresh = localStorage.getItem("refresh");

  const response = await fetch(`${API_URL}api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "Application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }
  const data = await response.json();
  localStorage.setItem("access", data.access);
  return data.access;
}
export async function authFetch(url, options = {}) {
  const access = localStorage.getItem("access");
  let response = await fetch(url, {
    ...options,
    headers: {
      ...(!(options.body instanceof FormData) && {
        "Content-Type": "application/json",
      }),
      Authorization: `Bearer ${access}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const newAccess = await refresh();
    if (!newAccess) return;

    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccess}`,
        ...options.headers,
      },
    });
  }

  return response;
}
export async function myAccount() {
  const response = await authFetch(`${API_URL}api/account/me/`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}

export async function employerProfile() {
  const response = await authFetch(`${API_URL}api/account/me/`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail);
  return data;
}
export async function jobSeekerProfile() {
  const response = await fetch(`${API_URL}api/job-seeker/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("access")}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch profile");
  }

  return await response.json();
}
