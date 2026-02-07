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
    return value !== null && value !== undefined && value !== "";
  };

  const validateFile = (file) => {
    if (!file) return false;
    const validTypes = ["image/jpeg", "image/jpg"];
    return validTypes.includes(file.type);
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword && password.length > 0;
  };

  const validatePhone = (phone) => {
    return phone && phone.trim().length >= 7;
  };

  const validatePostalCode = (code) => {
    return code && code.trim().length >= 4;
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
  };
}
