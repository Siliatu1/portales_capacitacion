import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getHorariosSemana } from "../services/horariosService";

import {
  calcularSemana,
  formatearFecha,
  formatearRangoFechas
} from "../utils/dateUtils";

import {
  CARGOS_ADMINISTRATIVOS
} from "../utils/constants";

export const useDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [horarios, setHorarios] = useState([]);

  const [showProfileModal, setShowProfileModal] =
    useState(false);

  const [infoSemana, setInfoSemana] =
    useState(null);

  useEffect(() => {
    validarUsuario();
  }, []);

  useEffect(() => {
    if (user) {
      cargarHorarios();
    }
  }, [user]);

  const validarUsuario = () => {
    const userData =
      localStorage.getItem("user");

    if (!userData) {
      navigate("/", { replace: true });
      return;
    }

    const parsedUser = JSON.parse(userData);

    if (
      CARGOS_ADMINISTRATIVOS.includes(
        parsedUser.cargo
      )
    ) {
      navigate("/vista-administrativa", {
        replace: true
      });

      return;
    }

    setUser(parsedUser);
  };

  const cargarHorarios = async () => {
    try {
      const semana = calcularSemana();

      setInfoSemana(semana);

      const documento =
        user?.document_number ||
        user?.documento ||
        user?.cedula;

      const fechaInicio =
        semana.fechaInicio
          .toISOString()
          .split("T")[0];

      const fechaFin =
        semana.fechaFin
          .toISOString()
          .split("T")[0];

      const data = await getHorariosSemana(
        documento,
        fechaInicio,
        fechaFin
      );

      setHorarios(data);
    } catch (error) {
      console.error(
        "Error cargando horarios",
        error
      );
    }
  };

  const totalHoras = useMemo(() => {
    return horarios.reduce((total, item) => {
      const inicio =
        item.attributes?.hora_inicio;

      const fin =
        item.attributes?.hora_fin;

      if (!inicio || !fin) return total;

      const [h1, m1] =
        inicio.split(":").map(Number);

      const [h2, m2] =
        fin.split(":").map(Number);

      return (
        total +
        ((h2 * 60 + m2 -
          (h1 * 60 + m1)) /
          60)
      );
    }, 0);
  }, [horarios]);

  return {
    navigate,
    user,
    horarios,
    totalHoras,
    infoSemana,
    showProfileModal,
    setShowProfileModal,
    formatearFecha,
    formatearRangoFechas
  };
};