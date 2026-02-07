import { ref, computed } from "vue";

export function useFormValidation() {
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAge = (birthDate) => {
    if (!birthDate) return false;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age >= 18;
  };

  const validateDocumentNumber = (documentNumber) => {
    const numberRegex = /^\d{5,}$/;
    return numberRegex.test(documentNumber);
  };

  const validateRequired = (value) => {
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    if (value instanceof File) {
      return value !== null;
    }
    return value !== null && value !== undefined && value !== "";
  };

  const validateFile = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/jpg"];
    return validTypes.includes(file.type);
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword && password && password.length > 0;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{7,}$/;
    return phoneRegex.test(phone);
  };

  const validatePostalCode = (code) => {
    return code && code.trim().length >= 4 && /^\d+$/.test(code);
  };

  const validateMinLength = (value, minLength) => {
    return value && value.trim().length >= minLength;
  };

  const validateMaxLength = (value, maxLength) => {
    return value && value.trim().length <= maxLength;
  };

  const validateNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  const validateAlphanumeric = (value) => {
    return /^[a-zA-Z0-9]+$/.test(value);
  };

  // Función para obtener mensajes de error
  const getErrorMessage = (field, value, customMessages = {}) => {
    const defaultMessages = {
      required: "Este campo es requerido",
      email: "Ingrese un correo electrónico válido",
      phone: "Ingrese un número de teléfono válido",
      documentNumber: "Debe contener al menos 5 dígitos numéricos",
      passwordMatch: "Las contraseñas no coinciden",
      age: "Debe ser mayor de 18 años",
      file: "Por favor cargue un archivo JPG válido",
      postalCode: "Ingrese un código postal válido (mínimo 4 caracteres)",
    };

    return customMessages[field] || defaultMessages[field] || "Campo inválido";
  };

  return {
    validateEmail,
    validateAge,
    validateDocumentNumber,
    validateRequired,
    validateFile,
    validatePasswordMatch,
    validatePhone,
    validatePostalCode,
    validateMinLength,
    validateMaxLength,
    validateNumeric,
    validateAlphanumeric,
    getErrorMessage,
  };
}
