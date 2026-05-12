
import { useState } from "react";

export const useFormulario = (config) => {
  const [formData, setFormData] = useState(config.initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const reset = () => {
    setFormData(config.initialState);
  };

  return {
    formData,
    setFormData,
    handleChange,
    loading,
    setLoading,
    reset,
    // alias para compatibilidad en componentes
    resetForm: reset,
  };
};

export default useFormulario