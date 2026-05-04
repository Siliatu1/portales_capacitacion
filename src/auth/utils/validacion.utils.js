export const validarUsuario = (empleados, documento) => {
  if (!documento) return null;

  const doc = documento.trim();

  const usuario = empleados.find(
    (emp) => String(emp.document_number).trim() === doc
  );

  return usuario || null;
};

export default validarUsuario;