import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-left: 12px;
  color: #666;
  font-size: 14px;
`;

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Yükleniyor...', 
  size = 'medium' 
}) => {
  const spinnerSize = size === 'small' ? 24 : size === 'large' ? 56 : 40;
  const borderWidth = size === 'small' ? 2 : size === 'large' ? 6 : 4;

  return (
    <SpinnerContainer>
      <Spinner 
        style={{ 
          width: spinnerSize, 
          height: spinnerSize, 
          borderWidth: borderWidth 
        }} 
      />
      {text && <LoadingText>{text}</LoadingText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
