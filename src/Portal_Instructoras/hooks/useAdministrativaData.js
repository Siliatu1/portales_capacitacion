import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../../auth/hooks/useAuth';
import { getEmpleado } from '../../Portal_Lineas_producto/services/empleado.service';
import {
  ADMIN_ROLES,
  buildInstructorasList,
  createHorarioRecord,
  shiftWeek,
} from '../components/vistaAdministrativa.helpers';
import {
  useHorariosQuery,
  useInstructorasQuery,
  usePdvIpsQuery,
} from './useHorariosInstructorasQueries';

const buildUser = (userData) => {
  const cargo = userData?.cargo || '';
  const profile = String(userData?.profile || userData?.perfil || '').trim().toUpperCase();
  return {
    documento: userData?.document_number || '',
    nombre: userData?.nombre || '',
    correo: userData?.correo || '',
    cargo,
    foto: userData?.foto || '',
    isAdmin: ADMIN_ROLES.includes(cargo) || profile === 'SUPER_ADMIN',
  };
};

const getAttributeValue = (source, keys) => {
  const attributes = source?.attributes || source || {};

  for (const key of keys) {
    const value = attributes[key];

    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return value;
    }
  }

  return '';
};

const getInstructoraDocumento = (instructora) => String(
  getAttributeValue(instructora, [
    'documento',
    'Documento',
    'document_number',
    'documentNumber',
    'document',
    'cedula',
    'Cedula',
    'identificacion',
    'Identificacion',
  ])
).trim();

const getInstructoraNombre = (instructora, documento) => String(
  getAttributeValue(instructora, [
    'Nombre',
    'nombre',
    'name',
    'nombres',
    'fullName',
    'nombre_completo',
  ]) || `Instructora ${documento}`
).trim();

const getEmpleadoNombre = (empleado, documento) => {
  const source = empleado?.attributes || empleado || {};

  return String(
    getAttributeValue(source, [
      'nombre',
      'Nombre',
      'fullName',
      'nombres',
      'name',
      'nombre_completo',
    ]) || ''
  ).trim() || `Instructora ${documento}`;
};

const resolveEmpleadoNombre = async (documento) => {
  const data = await getEmpleado(documento);
  const responseData = data?.data || data || [];
  const empleados = Array.isArray(responseData) ? responseData : [responseData];
  const empleado = empleados.find((item) => {
    const itemDocumento = String(
      getAttributeValue(item, [
        'document_number',
        'documento',
        'document',
        'documento_identidad',
        'cedula',
      ])
    ).trim();

    return itemDocumento === String(documento).trim();
  }) || empleados[0];

  return getEmpleadoNombre(empleado, documento);
};

export function useVistaAdministrativaData({ semanaLunes, lineaSeleccionada }) {
  const { user: userData, logout } = useAuth();
  const [empleadosInstructorasMap, setEmpleadosInstructorasMap] = useState(() => new Map());
  const user = useMemo(() => (userData ? buildUser(userData) : null), [userData]);
  const fechaInicioStr = dayjs(semanaLunes).format('YYYY-MM-DD');
  const fechaFinStr = dayjs(shiftWeek(semanaLunes, 6)).format('YYYY-MM-DD');
  const queryInstructoras = lineaSeleccionada !== 'todas'
    ? `filters[${lineaSeleccionada}][$eq]=true&pagination[pageSize]=1000`
    : 'pagination[pageSize]=1000';

  const pdvsQuery = usePdvIpsQuery('populate=*&pagination[pageSize]=1000');
  const instructorasQuery = useInstructorasQuery(queryInstructoras, Boolean(user?.isAdmin));
  const horariosQuery = useHorariosQuery(
    `filters[fecha][$gte]=${fechaInicioStr}&filters[fecha][$lte]=${fechaFinStr}&pagination[pageSize]=40000`,
    Boolean(user?.isAdmin),
    (response) => (Array.isArray(response?.data) ? response.data : [])
  );

  const puntosVenta = useMemo(() => (pdvsQuery.data || [])
    .map((pdv) => ({ id: pdv.id, nombre: pdv.attributes?.pdv || pdv.attributes?.nombre || '' }))
    .filter((pdv) => pdv.nombre)
    .sort((a, b) => a.nombre.localeCompare(b.nombre)), [pdvsQuery.data]);

  const instructorasData = instructorasQuery.data || [];
  const documentosInstructoras = useMemo(() => instructorasData
    .map(getInstructoraDocumento)
    .filter(Boolean), [instructorasData]);
  const instructorasMap = useMemo(() => new Map(
    instructorasData.map((inst) => {
      const documento = getInstructoraDocumento(inst);
      const nombre = getInstructoraNombre(inst, documento);
      return [documento, nombre];
    }).filter(([documento]) => documento)
  ), [instructorasData]);

  const horariosTodos = useMemo(() => {
    let horarios = (horariosQuery.data || []).map(createHorarioRecord);

    if (lineaSeleccionada !== 'todas') {
      horarios = horarios.filter((horario) => documentosInstructoras.includes(String(horario.documento).trim()));
    }

    return horarios.sort((a, b) => {
      if (a.fecha.getTime() !== b.fecha.getTime()) return a.fecha - b.fecha;
      return a.horaInicio.localeCompare(b.horaInicio);
    });
  }, [documentosInstructoras, horariosQuery.data, lineaSeleccionada]);

  useEffect(() => {
    const documentosPendientes = [...new Set(
      horariosTodos
        .map((horario) => String(horario.documento || '').trim())
        .filter((documento) => (
          documento &&
          !instructorasMap.has(documento) &&
          !empleadosInstructorasMap.has(documento)
        ))
    )];

    if (!documentosPendientes.length) {
      return;
    }

    let isMounted = true;

    Promise.all(
      documentosPendientes.map(async (documento) => {
        try {
          const nombre = await resolveEmpleadoNombre(documento);
          return [documento, nombre];
        } catch {
          return [documento, `Instructora ${documento}`];
        }
      })
    ).then((resolvedNames) => {
      if (!isMounted) {
        return;
      }

      setEmpleadosInstructorasMap((prev) => {
        const next = new Map(prev);
        resolvedNames.forEach(([documento, nombre]) => {
          next.set(documento, nombre);
        });
        return next;
      });
    });

    return () => {
      isMounted = false;
    };
  }, [empleadosInstructorasMap, horariosTodos, instructorasMap]);

  const instructorasResolvedMap = useMemo(() => new Map([
    ...empleadosInstructorasMap,
    ...instructorasMap,
  ]), [empleadosInstructorasMap, instructorasMap]);

  const instructoras = useMemo(
    () => buildInstructorasList(horariosTodos, instructorasResolvedMap),
    [horariosTodos, instructorasResolvedMap]
  );

  return {
    user,
    logout,
    puntosVenta,
    instructoras,
    horariosTodos,
    loading: pdvsQuery.isFetching || instructorasQuery.isFetching || horariosQuery.isFetching,
    refetch: () => {
      pdvsQuery.refetch();
      instructorasQuery.refetch();
      horariosQuery.refetch();
    },
  };
}
