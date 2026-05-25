import { useMemo, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { updateHorario } from '../services/horariosInstructoras.service';
import Swal from 'sweetalert2';
import {
  buildBaseUser,
  buildEditFormData,
  buildHorarioPayload,
  buildHorariosState,
  buildSemanaQuery,
  INITIAL_MODAL_FORM,
  MOTIVOS_BASICOS,
  validateEditForm,
} from '../components/dashboard.helpers';
import { useHorariosQuery, usePdvIpsQuery } from './useHorariosInstructorasQueries';

export function useDashboardController() {
  const { user: userData, logout } = useAuth();
  const user = useMemo(() => buildBaseUser(userData || {}), [userData]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [semanaPreview, setSemanaPreview] = useState(null);
  const [modalEditar, setModalEditar] = useState(false);
  const [eventoEditar, setEventoEditar] = useState(null);
  const [showMoreMotivos, setShowMoreMotivos] = useState(false);
  const [filaExpandida, setFilaExpandida] = useState(null);
  const [formDataModal, setFormDataModal] = useState(INITIAL_MODAL_FORM);
  const [guardando, setGuardando] = useState(false);

  const semana = useMemo(() => buildSemanaQuery(semanaOffset), [semanaOffset]);
  const puntosVentaQuery = usePdvIpsQuery('populate=*&pagination[pageSize]=1000', Boolean(user.documento));
  const puntosVenta = useMemo(
    () => (puntosVentaQuery.data || [])
      .map((pdv) => ({ id: pdv.id, nombre: pdv.attributes?.pdv || pdv.attributes?.nombre || '' }))
      .filter((pdv) => pdv.nombre)
      .sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [puntosVentaQuery.data]
  );

  const horariosQueryString = user.documento
    ? `filters[documento][$eq]=${user.documento}&filters[fecha][$gte]=${semana.fechaInicioStr}&filters[fecha][$lte]=${semana.fechaFinStr}&pagination[pageSize]=40000`
    : '';
  const horariosQuery = useHorariosQuery(
    horariosQueryString,
    Boolean(user.documento),
    (response) => buildHorariosState(response?.data, semana)
  );

  const horariosDetalles = useMemo(
    () => horariosQuery.data?.detalles || [],
    [horariosQuery.data]
  );
  const horariosData = useMemo(
    () => horariosQuery.data?.filas || [],
    [horariosQuery.data]
  );
  const infoSemana = horariosQuery.data?.infoSemana || {
    numero: semana.numeroSemana,
    fechaInicio: semana.lunes,
    fechaFin: semana.domingo,
  };
  const totalHoras = useMemo(
    () => horariosData.reduce((sum, item) => sum + item.totalHoras, 0),
    [horariosData]
  );

  const cerrarModal = () => {
    setModalEditar(false);
    setEventoEditar(null);
    setFormDataModal(INITIAL_MODAL_FORM);
    setShowMoreMotivos(false);
  };

  const actions = {
    logout,
    setShowProfileModal,
    setShowPreviewModal,
    setFilaExpandida,
    setShowMoreMotivos,
    cambiarSemana: (delta) => {
      setSemanaOffset((prev) => prev + delta);
      setFilaExpandida(null);
    },
    verSemana: (semanaRecord) => {
      setSemanaPreview(semanaRecord);
      setShowPreviewModal(true);
    },
    editarActividad: (detalle) => {
      const { formData, showMoreMotivos: expanded } = buildEditFormData(detalle, puntosVenta);
      setFormDataModal(formData);
      setShowMoreMotivos(expanded);
      setEventoEditar(detalle);
      setModalEditar(true);
    },
    cerrarModal,
    fieldChange: (field, value) => setFormDataModal((prev) => ({ ...prev, [field]: value })),
    selectMotivo: (motivo) => {
      setFormDataModal((prev) => ({
        ...prev,
        motivo,
        detalleCubrir: motivo !== 'cubrir_puesto' ? '' : prev.detalleCubrir,
        detalleOtro: motivo !== 'otro' ? '' : prev.detalleOtro,
      }));

      if (MOTIVOS_BASICOS.includes(motivo)) {
        setShowMoreMotivos(false);
      }
    },
    guardarEdicion: async () => {
      if (!eventoEditar) return;

      const validationError = validateEditForm(formDataModal);
      if (validationError) {
        Swal.fire({
          title: 'Datos incompletos',
          text: validationError,
          icon: 'warning',
          confirmButtonColor: '#6B4E3D',
        });
        return;
      }

      const { payload } = buildHorarioPayload(formDataModal, eventoEditar, user.documento, puntosVenta);

      const result = await Swal.fire({
        title: 'Confirmar cambios',
        text: 'Deseas guardar los cambios de esta actividad?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#6B4E3D',
        cancelButtonColor: '#c9a984',
      });

      if (!result.isConfirmed) return;

      try {
        setGuardando(true);
        await updateHorario(eventoEditar.apiId, payload);
        await horariosQuery.refetch();
        cerrarModal();
        Swal.fire({
          title: 'Actividad actualizada',
          text: 'Los cambios fueron guardados correctamente',
          icon: 'success',
          confirmButtonColor: '#6B4E3D',
        });
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'No fue posible guardar los cambios. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#6B4E3D',
        });
      } finally {
        setGuardando(false);
      }
    },
    setFotoPerfilError: () => {
    },
  };

  return {
    user,
    data: {
      puntosVenta,
      horariosDetalles,
      horariosData,
      infoSemana,
      totalHoras,
    },
    ui: {
      showProfileModal,
      showPreviewModal,
      semanaPreview,
      modalEditar,
      showMoreMotivos,
      filaExpandida,
      formDataModal,
    },
    loading: {
      horarios: horariosQuery.isFetching,
      puntosVenta: puntosVentaQuery.isFetching,
      guardando,
    },
    actions,
  };
}
