import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

// Accessible button component
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const AccessibleButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#6c757d' : '#007bff'};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  outline: none;

  &:hover:not(:disabled) {
    background: ${props => props.disabled ? '#6c757d' : '#0056b3'};
    transform: translateY(-1px);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const AccessibleButtonComponent: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  role = 'button',
  tabIndex = 0,
  onKeyDown
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <AccessibleButton
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={handleKeyDown}
    >
      {children}
    </AccessibleButton>
  );
};

// Accessible input component
interface AccessibleInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  
  &[data-required="true"]::after {
    content: " *";
    color: #dc3545;
  }
`;

const StyledInput = styled.input<{ hasError?: boolean; disabled?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#ced4da'};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  color: ${props => props.disabled ? '#6c757d' : '#333'};

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.hasError 
      ? 'rgba(220, 53, 69, 0.25)' 
      : 'rgba(0, 123, 255, 0.25)'
    };
  }

  &:disabled {
    cursor: not-allowed;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
  margin-left: 4px;
`;

const HelperText = styled.div`
  color: #6c757d;
  font-size: 14px;
  margin-top: 4px;
  margin-left: 4px;
`;

export const AccessibleInput: React.FC<AccessibleInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const inputId = `input-${id}`;
  const errorId = `error-${id}`;
  const helperId = `helper-${id}`;

  const ariaDescribedBy = [errorId, helperId].filter(Boolean).join(' ');

  return (
    <InputContainer>
      <InputLabel 
        htmlFor={inputId}
        data-required={required}
      >
        {label}
      </InputLabel>
      
      <StyledInput
        ref={inputRef}
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy || undefined}
        aria-required={required}
      />
      
      {error && (
        <ErrorText id={errorId} role="alert" aria-live="polite">
          {error}
        </ErrorText>
      )}
      
      {helperText && (
        <HelperText id={helperId}>
          {helperText}
        </HelperText>
      )}
    </InputContainer>
  );
};

// Skip to main content link for keyboard navigation
const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 6px;
  background: #007bff;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s ease;

  &:focus {
    top: 6px;
  }
`;

export const SkipToMainContent: React.FC = () => {
  return (
    <SkipLink href="#main-content">
      Ana içeriğe geç
    </SkipLink>
  );
};

// Focus trap for modals
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
};

// Screen reader only text
const ScreenReaderOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const ScreenReaderText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ScreenReaderOnly>{children}</ScreenReaderOnly>;
};

// Accessible modal component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  outline: none;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  ariaLabel,
  ariaDescribedBy
}) => {
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Announce modal to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.textContent = `${title} modal açıldı`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, title]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={ariaDescribedBy}
    >
      <ModalContent
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="dialog"
        aria-label={ariaLabel}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <CloseButton
            onClick={onClose}
            aria-label="Modalı kapat"
          >
            ×
          </CloseButton>
        </ModalHeader>
        
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

// Accessible navigation component
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  current?: boolean;
}

interface AccessibleNavigationProps {
  items: NavigationItem[];
  onNavigate: (href: string) => void;
}

const NavContainer = styled.nav`
  display: flex;
  gap: 16px;
`;

const NavItem = styled.a<{ isCurrent?: boolean }>`
  padding: 8px 16px;
  text-decoration: none;
  color: ${props => props.isCurrent ? '#007bff' : '#333'};
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: #f8f9fa;
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  &[aria-current="page"] {
    background-color: #e3f2fd;
    font-weight: 600;
  }
`;

export const AccessibleNavigation: React.FC<AccessibleNavigationProps> = ({
  items,
  onNavigate
}) => {
  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <NavContainer role="navigation" aria-label="Ana navigasyon">
      {items.map((item) => (
        <NavItem
          key={item.id}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          onKeyDown={(e) => handleKeyDown(e, item.href)}
          aria-current={item.current ? 'page' : undefined}
          tabIndex={0}
        >
          {item.label}
        </NavItem>
      ))}
    </NavContainer>
  );
};
