/**
 * Validates a CPF number
 * @param {string} cpf - Raw or masked CPF
 * @returns {boolean} - true if valid
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  
  const cleanCPF = cpf.replace(/\D/g, "");
  
  if (cleanCPF.length !== 11) return false;
  
  // Check for equal digits
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  let remainder;
  
  // Calculate first digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;
  
  // Calculate second digit
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;
  
  return true;
};

/**
 * Validates a CNPJ number
 * @param {string} cnpj - Raw or masked CNPJ
 * @returns {boolean} - true if valid
 */
export const isValidCNPJ = (cnpj) => {
  if (!cnpj) return false;
  
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Check for equal digits
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  // Calculate first digit
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;
  
  // Calculate second digit
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
};

export default { isValidCPF, isValidCNPJ };
