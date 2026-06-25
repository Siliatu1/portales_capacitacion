// filtra los pdvs de crepes sa

const COMPANY_KEYS = [
  'compania',
];

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizePdvName = (value) =>
  normalizeText(value)
    .replace(/^(restaurante|heladeria|barra|bar|cw|crepes waffles|crepes y waffles)\s+/g, '')
    .trim();

const extractRelationValue = (value) => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  const attributes = value.attributes || value.data?.attributes || value.data || value;

  return (
    attributes.nombre ||
    attributes.name ||
    attributes.razon_social ||
    attributes.razonSocial ||
    attributes.codigo ||
    ''
  );
};

const getCompanyValue = (item) => {
  const attributes = item?.attributes || item || {};

  for (const key of COMPANY_KEYS) {
    const value = attributes[key];

    if (value !== undefined && value !== null && String(extractRelationValue(value)).trim()) {
      return extractRelationValue(value);
    }
  }

  return '';
};

export const isCrepesSaPdv = (item) => {
  const normalizedCompany = normalizeText(getCompanyValue(item));

  return normalizedCompany === 'crepes sa';
};

export const getPdvName = (item) => {
  const attributes = item?.attributes || item || {};

  return (
    attributes.pdv ||
    attributes.nombre ||
    attributes.name ||
    ''
  );
};

export const buildCrepesSaPdvNameSet = (items = []) => {
  const names = new Set();

  items
    .filter(isCrepesSaPdv)
    .forEach((item) => {
      const name = getPdvName(item);
      const normalizedName = normalizePdvName(name);

      if (normalizedName) {
        names.add(normalizedName);
      }
    });

  return names;
};

export const isPdvNameInSet = (item, nameSet) => {
  if (!nameSet?.size) {
    return true;
  }

  const normalizedName = normalizePdvName(getPdvName(item));

  return normalizedName && nameSet.has(normalizedName);
};
