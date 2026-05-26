import { useEffect, useReducer } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  buildProgramacionFromApi,
  createEmptyProgramacionSemanal,
  getFechasSemana,
  getInfoSemana,
} from '../components/programacionHorarios.helpers';
import { loadCustomMotivoOptions } from '../components/vistaAdministrativa.helpers';
import { useHorariosQuery, usePdvIpsQuery } from './useHorariosInstructorasQueries';

const buildUser = (userData) => ({
  documento: userData?.document_number || '',
  nombre: userData?.nombre || '',
  correo: userData?.correo || '',
  telefono: userData?.Celular || '',
  cargo: userData?.cargo || '',
  foto: userData?.foto || '',
});

const mapPdvIps = (items) => items
  .map((pdv) => ({
    id: pdv.id,
    nombre: pdv.attributes?.pdv || pdv.attributes?.nombre || pdv.pdv || pdv.nombre || '',
  }))
  .filter((pdv) => pdv.nombre)
  .sort((a, b) => a.nombre.localeCompare(b.nombre));

const programacionReducer = (state, action) => {
  if (typeof action === 'function') {
    return action(state);
  }

  if (action?.type === 'replace') {
    return action.payload;
  }

  return action;
};

export function useProgramacionHorariosData(semanaOffset) {
  const { user: userData, logout } = useAuth();
  const user = userData ? buildUser(userData) : null;
  const fechasSemana = getFechasSemana(semanaOffset);
  const infoSemana = getInfoSemana(fechasSemana);

  const puntosVentaQuery = usePdvIpsQuery('populate=*&pagination[pageSize]=1000');
  const puntosVenta = mapPdvIps(puntosVentaQuery.data || []);

  const fechaInicio = fechasSemana[0].toISOString().slice(0, 10);
  const fechaFin = fechasSemana[6].toISOString().slice(0, 10);
  const horariosQueryString = user?.documento
    ? `filters[documento][$eq]=${user.documento}&filters[fecha][$gte]=${fechaInicio}&filters[fecha][$lte]=${fechaFin}&pagination[pageSize]=40000`
    : '';

  const horariosQuery = useHorariosQuery(
    horariosQueryString,
    Boolean(user?.documento),
    (response) => (Array.isArray(response?.data) ? response.data : [])
  );

  const [programacionSemanal, dispatchProgramacion] = useReducer(
    programacionReducer,
    undefined,
    createEmptyProgramacionSemanal
  );

  useEffect(() => {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('programacion_'))
      .forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    if (!userData) {
      logout();
      return;
    }

    if (horariosQuery.isLoading) return;

    if (horariosQuery.data?.length > 0) {
      dispatchProgramacion({
        type: 'replace',
        payload: buildProgramacionFromApi(
          horariosQuery.data,
          getFechasSemana(semanaOffset),
          loadCustomMotivoOptions()
        )
      });
      return;
    }

    dispatchProgramacion({ type: 'replace', payload: createEmptyProgramacionSemanal() });
  }, [horariosQuery.data, horariosQuery.isLoading, logout, semanaOffset, userData]);

  return {
    user,
    fechasSemana,
    infoSemana,
    puntosVenta,
    programacionSemanal,
    setProgramacionSemanal: dispatchProgramacion,
    loadingPuntos: puntosVentaQuery.isFetching,
    loadingProgramacion: horariosQuery.isFetching,
    refetchProgramacion: horariosQuery.refetch,
    logout,
  };
}
