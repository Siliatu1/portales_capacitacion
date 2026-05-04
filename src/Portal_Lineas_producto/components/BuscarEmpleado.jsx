const BuscarEmpleado = ({ documento, setDocumento, onBuscar, loading }) => {
  return (
    <div className="form-section">
      <label>NÚMERO DE DOCUMENTO</label>

      <div className="search-input-container">
        <input
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
        />

        <button onClick={onBuscar} disabled={loading}>
          Buscar
        </button>
      </div>
    </div>
  );
};

export default BuscarEmpleado;