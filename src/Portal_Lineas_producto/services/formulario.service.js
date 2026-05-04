const API = "https://macfer.crepesywaffles.com/api";

export const guardarInscripcion = async (data) => {
  const res = await fetch(`${API}/cap-cafes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });

  return res.json();
};

export const getInscripciones = async () => {
  const res = await fetch(`${API}/cap-cafes`);
  return res.json();
};