import { Button } from "antd";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const WeekNavigator = ({
  onPrev,
  onNext,
  title,
  subtitle,
}) => {
  return (
    <div className="week-navigator">
      {/* =========================
          INFO
      ========================= */}

      <div className="week-info">
        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>

      {/* =========================
          ACTIONS
      ========================= */}

      <div className="week-buttons">
        <Button
          onClick={onPrev}
          icon={
            <ChevronLeft
              size={16}
            />
          }
        >
          Semana
          anterior
        </Button>

        <Button
          type="primary"
          onClick={onNext}
          icon={
            <ChevronRight
              size={16}
            />
          }
        >
          Semana
          siguiente
        </Button>
      </div>
    </div>
  );
};

export default WeekNavigator;