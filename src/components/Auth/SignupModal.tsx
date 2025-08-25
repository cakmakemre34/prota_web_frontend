import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, shadows, breakpoints } from '../../styles/GlobalStyles';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { authAPI, tokenUtils } from '../../services/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 16px 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${colors.primary};
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.5;
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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

const SignupModal: React.FC<SignupModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Ad soyad gerekli';
    if (!formData.email.trim()) newErrors.email = 'E-posta adresi gerekli';
    if (!formData.password.trim()) newErrors.password = 'Şifre gerekli';
    if (formData.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Kullanım şartlarını kabul etmelisiniz';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Store token and user data
      tokenUtils.setToken(response.token);
      tokenUtils.setUser(response.user);
      
      // Success - close modal and redirect
      onClose();
      window.location.reload(); // Refresh to update auth state
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.msg || 'Kayıt olurken bir hata oluştu';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup attempt');
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Header>
          <Title>Hesap Oluşturun</Title>
          <Subtitle>Seyahat dünyasına katılın</Subtitle>
        </Header>

        <GoogleButton 
          fullWidth 
          size="large" 
          onClick={handleGoogleSignup}
        >
          🌐 Google ile Kayıt Ol
        </GoogleButton>

        <Divider>
          <span>veya</span>
        </Divider>

        <Form onSubmit={handleSubmit}>
          <Input
            label="Ad Soyad"
            type="text"
            placeholder="Ad ve soyadınız"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            error={errors.name}
            fullWidth
            icon={<span>👤</span>}
          />

          <Input
            label="E-posta Adresi"
            type="email"
            placeholder="ornek@email.com"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            fullWidth
            icon={<span>📧</span>}
          />

          <Input
            label="Şifre"
            type="password"
            placeholder="En az 6 karakter"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            error={errors.password}
            fullWidth
            icon={<span>🔒</span>}
          />

          <Input
            label="Şifre Tekrar"
            type="password"
            placeholder="Şifrenizi tekrar girin"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            fullWidth
            icon={<span>🔒</span>}
          />

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            />
            <CheckboxLabel htmlFor="agreeToTerms">
              <a href="#terms">Kullanım Şartları</a> ve{' '}
              <a href="#privacy">Gizlilik Politikası</a>'nı okudum ve kabul ediyorum.
            </CheckboxLabel>
          </CheckboxContainer>

          {errors.agreeToTerms && (
            <div style={{ color: colors.error, fontSize: '14px' }}>
              {errors.agreeToTerms}
            </div>
          )}

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
            Hesap Oluştur
          </Button>
        </Form>

        <SwitchText>
          Zaten hesabınız var mı?{' '}
          <button onClick={onSwitchToLogin}>
            Giriş Yap
          </button>
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SignupModal;
