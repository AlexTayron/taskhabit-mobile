interface PasswordValidation {
  isValid: boolean;
  message: string;
}

export const validatePasswordStrength = (password: string): PasswordValidation => {
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'A senha deve ter pelo menos 8 caracteres',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'A senha deve conter pelo menos uma letra minúscula',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: 'A senha deve conter pelo menos um número',
    };
  }

  return {
    isValid: true,
    message: 'Senha válida',
  };
};

export const sanitizeTextInput = (text: string, maxLength: number): string => {
  // Remove caracteres especiais e espaços extras
  const sanitized = text
    .trim()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ');

  // Limita o tamanho do texto
  return sanitized.slice(0, maxLength);
};

export const validateAvatarUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}; 