import Swal from "sweetalert2";

export const showRequiredFieldAlert = (fieldName) =>
  Swal.fire({
    title: "Dato requerido",
    text: `Hace falta ${fieldName}.`,
    icon: "warning",
    confirmButtonText: "OK",
    confirmButtonColor: "#7a5039",
  });

export const showDocumentRequiredAlert = () =>
  showRequiredFieldAlert("ingresar el número de documento");
