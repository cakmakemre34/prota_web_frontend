import React from 'react';
import styled from 'styled-components';
import { colors, shadows } from '../../styles/GlobalStyles';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 8px 16px;
          font-size: 14px;
          min-height: 36px;
        `;
      case 'large':
        return `
          padding: 16px 32px;
          font-size: 16px;
          min-height: 56px;
        `;
      default:
        return `
          padding: 12px 24px;
          font-size: 15px;
          min-height: 48px;
        `;
    }
  }}

  /* Color variants */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${colors.secondary};
          color: white;
          box-shadow: ${shadows.small};
          
          &:hover:not(:disabled) {
            background: #d97706;
            transform: translateY(-1px);
            box-shadow: ${shadows.medium};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${colors.primary};
          border: 2px solid ${colors.primary};
          
          &:hover:not(:disabled) {
            background: ${colors.primary};
            color: white;
            transform: translateY(-1px);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${colors.primary};
          
          &:hover:not(:disabled) {
            background: rgba(99, 102, 241, 0.1);
          }
        `;
      default:
        return `
          background: ${colors.primary};
          color: white;
          box-shadow: ${shadows.small};
          
          &:hover:not(:disabled) {
            background: ${colors.primaryDark};
            transform: translateY(-1px);
            box-shadow: ${shadows.medium};
          }
        `;
    }
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${shadows.small};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${props => props.loading && `
    color: transparent;
  `}
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};

export default Button;
