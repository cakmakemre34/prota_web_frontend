import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/GlobalStyles';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
`;

const InputWrapper = styled.div<{ hasError?: boolean; disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid ${props => props.hasError ? colors.error : colors.border};
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;

  &:focus-within {
    border-color: ${props => props.hasError ? colors.error : colors.primary};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)'};
  }

  ${props => props.disabled && `
    background: ${colors.backgroundSecondary};
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  font-size: 16px;
  color: ${colors.text};
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: ${colors.textSecondary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  color: ${colors.textSecondary};
`;

const PasswordToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: transparent;
  border: none;
  color: ${colors.textSecondary};
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: ${colors.text};
  }
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: ${colors.error};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  icon,
  fullWidth = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // Focus state for future use
  // const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <InputContainer fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      
      <InputWrapper 
        hasError={!!error} 
        disabled={disabled}
      >
        {icon && <IconContainer>{icon}</IconContainer>}
        
        <StyledInput
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          // Future: focus state handlers
          // onFocus={() => console.log('focused')}
          // onBlur={() => console.log('blurred')}
        />
        
        {type === 'password' && (
          <PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </PasswordToggle>
        )}
      </InputWrapper>
      
      {error && (
        <ErrorMessage>
          ⚠️ {error}
        </ErrorMessage>
      )}
    </InputContainer>
  );
};

export default Input;
