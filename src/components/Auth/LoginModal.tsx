import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, shadows, breakpoints } from '../../styles/GlobalStyles';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { authAPI, tokenUtils } from '../../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 16px;
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${shadows.xl};
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.9)'};
  transition: transform 0.3s ease;
  position: relative;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 40px 32px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${colors.textSecondary};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.backgroundSecondary};
    color: ${colors.text};
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${colors.textSecondary};
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GoogleButton = styled(Button)`
  background: white;
  color: ${colors.text};
  border: 2px solid ${colors.border};
  font-weight: 500;
  
  &:hover:not(:disabled) {
    border-color: ${colors.primary};
    color: ${colors.primary};
    background: white;
    transform: translateY(-1px);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${colors.border};
  }
  
  span {
    color: ${colors.textSecondary};
    font-size: 14px;
  }
`;

const SwitchText = styled.p`
  text-align: center;
  color: ${colors.textSecondary};
  font-size: 14px;
  margin-top: 24px;
  
  button {
    color: ${colors.primary};
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    
    &:hover {
      color: ${colors.primaryDark};
    }
  }
`;

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToSignup,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) newErrors.email = 'E-posta adresi gerekli';
    if (!password.trim()) newErrors.password = 'Şifre gerekli';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.login(email, password);
      
      // Store token and user data
      tokenUtils.setToken(response.token);
      tokenUtils.setUser(response.user);
      
      // Success - close modal and redirect
      onClose();
      window.location.reload(); // Refresh to update auth state
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.msg || 'Giriş yapılırken bir hata oluştu';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login attempt');
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Header>
          <Title>Hoş Geldiniz</Title>
          <Subtitle>Hesabınıza giriş yapın</Subtitle>
        </Header>

        <GoogleButton 
          fullWidth 
          size="large" 
          onClick={handleGoogleLogin}
        >
          🌐 Google ile Giriş Yap
        </GoogleButton>

        <Divider>
          <span>veya</span>
        </Divider>

        <Form onSubmit={handleSubmit}>
          <Input
            label="E-posta Adresi"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            fullWidth
            icon={<span>📧</span>}
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={setPassword}
            error={errors.password}
            fullWidth
            icon={<span>🔒</span>}
          />

          {errors.general && (
            <div style={{ color: colors.error, fontSize: '14px', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
          >
            Giriş Yap
          </Button>
        </Form>

        <SwitchText>
          Henüz hesabınız yok mu?{' '}
          <button onClick={onSwitchToSignup}>
            Üye Ol
          </button>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;
