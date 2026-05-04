const EmpleadoInfo = ({ empleado }) => {
  if (!empleado) return null;

  return (
    <div>
      <h3>{empleado.nombre}</h3>
      <p>{empleado.cargo}</p>
    </div>
  );
};

export default EmpleadoInfo;