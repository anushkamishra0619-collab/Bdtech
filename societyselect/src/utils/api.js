const API_BASE = (
  import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

let refreshRequest;

const request = (path, options, accessToken) => {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
};

const readResponse = async (response) => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.message ||
      payload?.message ||
      (typeof payload === "string" && payload.trim()) ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
};

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = (async () => {
      try {
        const response = await request(
          "/api/auth/refresh",
          { method: "POST" },
          null
        );
        const data = await readResponse(response);
        if (!data?.accessToken) {
          throw new Error("Session refresh did not return an access token.");
        }
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        throw error;
      } finally {
        refreshRequest = null;
      }
    })();
  }
  return refreshRequest;
};

export const apiRequest = async (path, options = {}) => {
  const { auth = true, body, ...fetchOptions } = options;
  const method = fetchOptions.method || (body === undefined ? "GET" : "POST");
  const requestOptions = {
    ...fetchOptions,
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  };
  let accessToken = auth ? localStorage.getItem("accessToken") : null;
  let response = await request(path, requestOptions, accessToken);

  if (response.status === 401 && accessToken && path !== "/api/auth/refresh") {
    accessToken = await refreshAccessToken();
    response = await request(path, requestOptions, accessToken);
  }

  return readResponse(response);
};
