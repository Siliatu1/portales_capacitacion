import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchCapPdvs,
  fetchHorariosInstructoras,
  fetchInstructoras,
  fetchPdvIps,
} from '../services/horariosInstructoras.service';

export const HORARIOS_QUERY_KEYS = {
  root: ['horarios-instructoras'],
  instructoras: (query = '') => ['horarios-instructoras', 'instructoras', query],
  pdvs: (query = '') => ['horarios-instructoras', 'pdvs', query],
  pdvIps: (query = '') => ['horarios-instructoras', 'pdv-ips', query],
  horarios: (query = '') => ['horarios-instructoras', 'horarios', query],
};

const STALE_TIME = 5 * 60 * 1000;

function useAsyncQuery({ queryKey, queryFn, enabled = true, select }) {
  const requestIdRef = useRef(0);
  const [state, setState] = useState({
    data: undefined,
    error: null,
    isFetching: false,
    isLoading: Boolean(enabled),
  });

  const cacheKey = JSON.stringify(queryKey);

  const refetch = useCallback(async () => {
    if (!enabled) {
      setState((prev) => ({
        ...prev,
        isFetching: false,
        isLoading: false,
      }));
      return undefined;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setState((prev) => ({
      ...prev,
      error: null,
      isFetching: true,
      isLoading: prev.data === undefined,
    }));

    try {
      const response = await queryFn();
      const data = select ? select(response) : response;

      if (requestIdRef.current === requestId) {
        setState({
          data,
          error: null,
          isFetching: false,
          isLoading: false,
        });
      }

      return data;
    } catch (error) {
      if (requestIdRef.current === requestId) {
        setState((prev) => ({
          ...prev,
          error,
          isFetching: false,
          isLoading: false,
        }));
      }

      return undefined;
    }
  }, [cacheKey, enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    ...state,
    refetch,
  };
}

export function useInstructorasQuery(query, enabled = true) {
  return useAsyncQuery({
    queryKey: HORARIOS_QUERY_KEYS.instructoras(query),
    queryFn: () => fetchInstructoras(query),
    enabled,
    staleTime: STALE_TIME,
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
  });
}

export function useCapPdvsQuery(query, enabled = true) {
  return useAsyncQuery({
    queryKey: HORARIOS_QUERY_KEYS.pdvs(query),
    queryFn: () => fetchCapPdvs(query),
    enabled,
    staleTime: STALE_TIME,
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
  });
}

export function usePdvIpsQuery(query, enabled = true) {
  return useAsyncQuery({
    queryKey: HORARIOS_QUERY_KEYS.pdvIps(query),
    queryFn: () => fetchPdvIps(query),
    enabled,
    staleTime: STALE_TIME,
    select: (response) => (Array.isArray(response?.data) ? response.data : []),
  });
}

export function useHorariosQuery(query, enabled = true, select) {
  return useAsyncQuery({
    queryKey: HORARIOS_QUERY_KEYS.horarios(query),
    queryFn: () => fetchHorariosInstructoras(query),
    enabled,
    staleTime: STALE_TIME,
    select,
  });
}

