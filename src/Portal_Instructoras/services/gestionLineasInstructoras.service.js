import {
  createCapInstructora,
  deleteCapInstructora,
  getCapInstructoras,
  updateCapInstructora,
} from '../../services/apiService';

const PAGE_SIZE = 100;

export const fetchGestionLineasInstructoras = async () => {
  const firstResponse = await getCapInstructoras(
    `populate=*&pagination[page]=1&pagination[pageSize]=${PAGE_SIZE}`
  );
  const pageCount = firstResponse?.meta?.pagination?.pageCount || 1;
  const instructoras = [...(firstResponse?.data || [])];

  for (let page = 2; page <= pageCount; page += 1) {
    const response = await getCapInstructoras(
      `populate=*&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`
    );

    instructoras.push(...(response?.data || []));
  }

  return instructoras;
};

export const createGestionLineaInstructora = (payload) =>
  createCapInstructora(payload);

export const updateGestionLineaInstructora = (id, payload) =>
  updateCapInstructora(id, payload);

export const deleteGestionLineaInstructora = (id) =>
  deleteCapInstructora(id);
