import "../styles/BuscarEmpleado.css";

const BuscarEmpleado = ({
  documento,
  setDocumento,
  onBuscar,
  loading,
}) => {
  return (
    <div className="buscar-empleado-container">
      <label className="buscar-empleado-label">
        NÚMERO DE DOCUMENTO
      </label>

      <div className="search-input-container">
        <input
          className="buscar-empleado-input"
          type="text"
          placeholder="Ingrese el documento"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <button
          className="buscar-empleado-btn"
          onClick={onBuscar}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>
    </div>
  );
};

export default BuscarEmpleado;