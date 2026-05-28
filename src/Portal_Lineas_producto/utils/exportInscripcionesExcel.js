import { asistenciaLabel } from "./asistencia.utils";
import { evaluacionEstadoLabel } from "./estadoInscripcion.utils";

const parseLocalDate = (value) => {
  if (!value) {
    return null;
  }

  if (
    value instanceof Date &&
    !Number.isNaN(value.getTime())
  ) {
    return value;
  }

  const raw = String(value);
  const isoMatch = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (isoMatch) {
    return new Date(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3])
    );
  }

  const parsed = new Date(raw);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
};

const formatDate = (value) => {
  const parsed = parseLocalDate(value);

  if (!parsed) {
    return value || "";
  }

  return parsed.toLocaleDateString("es-CO");
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const sanitizeFileName = (value) =>
  String(value || "inscripciones")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

const columnsByFormType = {
  heladeria: [
    {
      header: "Cedula",
      value: (item) => item.cedula,
    },
    {
      header: "Nombres",
      value: (item) => item.nombres,
    },
    {
      header: "Telefono",
      value: (item) => item.telefono,
    },
    {
      header: "Cargo a Evaluar",
      value: (item) => item.cargo,
    },
    {
      header: "Punto de Venta",
      value: (item) =>
        item.puntoVenta ||
        item.area_nombre,
    },
    {
      header: "Nombre Lider",
      value: (item) => item.lider,
    },
    {
      header: "Dia",
      value: (item) => formatDate(item.dia),
    },
    {
      header: "Asistencia",
      value: (item) =>
        asistenciaLabel(item.asistencia),
    },
  ],

  todera: [
    {
      header: "Cedula",
      value: (item) => item.cedula,
    },
    {
      header: "Nombres",
      value: (item) => item.nombres,
    },
    {
      header: "Telefono",
      value: (item) => item.telefono,
    },
    {
      header: "Cargo a Evaluar",
      value: (item) => item.cargo,
    },
    {
      header: "Punto de Venta",
      value: (item) =>
        item.puntoVenta ||
        item.area_nombre,
    },
    {
      header: "Instructora",
      value: (item) =>
        item.instructora ||
        item.lider,
    },
    {
      header: "Categoria",
      value: (item) => item.categoria,
    },
    {
      header: "Dia Inscripcion",
      value: (item) => formatDate(item.dia),
    },
    {
      header: "Estado",
      value: (item) =>
        evaluacionEstadoLabel(
          item.estado
        ),
    },
    {
      header: "Observacion",
      value: (item) => item.observacion,
    },
  ],
};

const buildRows = (data, columns) =>
  data.map((item) =>
    columns.map((column) =>
      column.value(item) ?? ""
    )
  );

export const downloadInscripcionesExcel = ({
  data,
  formType,
  fileName,
  sheetName,
}) => {
  const rows = Array.isArray(data)
    ? data
    : [];

  const columns =
    columnsByFormType[
      String(formType || "").toLowerCase()
    ] || [];

  const tableRows = [
    columns.map((column) => column.header),
    ...buildRows(rows, columns),
  ];

  const htmlRows = tableRows
    .map((row, rowIndex) => {
      const tag = rowIndex === 0 ? "th" : "td";

      const cells = row
        .map(
          (cell) =>
            `<${tag} style="mso-number-format:'\\@';">${escapeHtml(
              cell
            )}</${tag}>`
        )
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <table>
      <thead></thead>
      <tbody>${htmlRows}</tbody>
    </table>
  </body>
</html>`;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date()
    .toISOString()
    .slice(0, 10);
  const safeFileName = sanitizeFileName(
    `${fileName || sheetName || "inscripciones"}_${date}`
  );

  link.href = url;
  link.download = `${safeFileName}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
