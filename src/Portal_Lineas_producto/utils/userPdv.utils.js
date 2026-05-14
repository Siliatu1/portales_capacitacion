export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getUserPdv = (user) => {
  return (
    user?.pdv ||
    user?.puntoVenta ||
    user?.area_nombre ||
    user?.area ||
    ""
  );
};
