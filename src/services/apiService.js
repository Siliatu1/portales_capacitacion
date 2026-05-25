const API_URL = "https://macfer.crepesywaffles.com/api";

const buildUrl = (endpoint, query = "") => {
  const cleanQuery = String(query || "").replace(/^\?/, "");
  return `${API_URL}/${endpoint}${cleanQuery ? `?${cleanQuery}` : ""}`;
};

const requestJson = async (url, options) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error API ${response.status}: ${url}`);
  }

  return response.json();
};

const getCollection = (endpoint, query) => requestJson(buildUrl(endpoint, query));

const createRecord = (endpoint, payload) =>
  requestJson(buildUrl(endpoint), {
    method: "POST",
    body: JSON.stringify(payload),
  });

const updateRecord = (endpoint, id, payload) =>
  requestJson(buildUrl(`${endpoint}/${id}`), {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const getCapInstructoras = (query = "") => getCollection("cap-instructoras", query);

export const getCapPdvs = (query = "") => getCollection("cap-pdvs", query);

export const getPdvIps = (query = "") => getCollection("pdv-Ips", query);

export const getHorariosInstructoras = (query = "") =>
  getCollection("horarios-instructoras", query);

export const createHorarioInstructora = (payload) =>
  createRecord("horarios-instructoras", payload);

export const updateHorarioInstructora = (id, payload) =>
  updateRecord("horarios-instructoras", id, payload);
