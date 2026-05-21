const StatsCard = ({
  icon,
  title,
  value,
  color = "green",
}) => {
  return (
    <div className="stats-card">
      {/* =========================
          ICON
      ========================= */}

      <div
        className={`stats-icon ${color}`}
      >
        {icon}
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="stats-content">
        <h3>{value}</h3>

        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;