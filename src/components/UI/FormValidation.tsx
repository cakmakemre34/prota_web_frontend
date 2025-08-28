import React from 'react';
import styled from 'styled-components';

// Validation error styles
export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
`;

export const InputError = styled.input<{ hasError?: boolean }>`
  border-color: ${props => props.hasError ? '#dc3545' : '#ced4da'};
  
  &:focus {
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: ${props => props.hasError 
      ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' 
      : '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    };
  }
`;

export const TextAreaError = styled.textarea<{ hasError?: boolean }>`
  border-color: ${props => props.hasError ? '#dc3545' : '#ced4da'};
  
  &:focus {
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff' };
    box-shadow: ${props => props.hasError 
      ? '0 0 0 0.2rem rgba(220, 53, 69, 0.25)' 
      : '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    };
  }
`;

// Validation rules
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation functions
export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
  const errors: string[] = [];

  if (rules.required && !value.trim()) {
    errors.push('Bu alan zorunludur');
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    errors.push(`En az ${rules.minLength} karakter olmalıdır`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`En fazla ${rules.maxLength} karakter olmalıdır`);
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    errors.push('Geçersiz format');
  }

  if (value && rules.custom) {
    const customResult = rules.custom(value);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (!customResult) {
      errors.push('Geçersiz değer');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (data: Record<string, string>, validationSchema: Record<string, ValidationRule>): Record<string, ValidationResult> => {
  const results: Record<string, ValidationResult> = {};

  Object.keys(validationSchema).forEach(fieldName => {
    const value = data[fieldName] || '';
    const rules = validationSchema[fieldName];
    results[fieldName] = validateField(value, rules);
  });

  return results;
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d{1,2})?$/
};

// Common validation rules
export const VALIDATION_RULES = {
  required: { required: true },
  email: { required: true, pattern: VALIDATION_PATTERNS.email },
  phone: { required: true, pattern: VALIDATION_PATTERNS.phone },
  password: { required: true, pattern: VALIDATION_PATTERNS.password },
  url: { pattern: VALIDATION_PATTERNS.url },
  numeric: { pattern: VALIDATION_PATTERNS.numeric },
  decimal: { pattern: VALIDATION_PATTERNS.decimal }
};

// Custom validation functions
export const CUSTOM_VALIDATIONS = {
  // Turkish phone number validation
  turkishPhone: (value: string): boolean | string => {
    const cleanValue = value.replace(/\s/g, '');
    if (!/^(\+90|90|0)?5[0-9]{9}$/.test(cleanValue)) {
      return 'Geçerli bir Türk telefon numarası giriniz';
    }
    return true;
  },

  // Turkish ID number validation
  turkishId: (value: string): boolean | string => {
    if (!/^\d{11}$/.test(value)) {
      return 'TC Kimlik numarası 11 haneli olmalıdır';
    }
    
    // Basic TC ID validation algorithm
    let oddSum = 0;
    let evenSum = 0;
    
    for (let i = 0; i < 9; i++) {
      if (i % 2 === 0) {
        oddSum += parseInt(value[i]);
      } else {
        evenSum += parseInt(value[i]);
      }
    }
    
    const digit10 = ((oddSum * 7) - evenSum) % 10;
    const digit11 = (oddSum + evenSum + digit10) % 10;
    
    if (parseInt(value[9]) !== digit10 || parseInt(value[10]) !== digit11) {
      return 'Geçersiz TC Kimlik numarası';
    }
    
    return true;
  },

  // Date validation (not in the past)
  futureDate: (value: string): boolean | string => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return 'Geçmiş bir tarih seçemezsiniz';
    }
    
    return true;
  },

  // Age validation (18+)
  adultAge: (value: string): boolean | string => {
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return '18 yaşından büyük olmalısınız';
    }
    
    return true;
  }
};

// Hook for form validation
export const useFormValidation = (initialData: Record<string, string>, validationSchema: Record<string, ValidationRule>) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, ValidationResult>>({});
  const [isValid, setIsValid] = React.useState(false);

  const validate = React.useCallback(() => {
    const validationResults = validateForm(formData, validationSchema);
    setErrors(validationResults);
    
    const formIsValid = Object.values(validationResults).every(result => result.isValid);
    setIsValid(formIsValid);
    
    return formIsValid;
  }, [formData, validationSchema]);

  const updateField = React.useCallback((fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate single field
    if (validationSchema[fieldName]) {
      const fieldValidation = validateField(value, validationSchema[fieldName]);
      setErrors(prev => ({ ...prev, [fieldName]: fieldValidation }));
    }
  }, [validationSchema]);

  const resetForm = React.useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setIsValid(false);
  }, [initialData]);

  React.useEffect(() => {
    validate();
  }, [validate]);

  return {
    formData,
    errors,
    isValid,
    updateField,
    validate,
    resetForm
  };
};
