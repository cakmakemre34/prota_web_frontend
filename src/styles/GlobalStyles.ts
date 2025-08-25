import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
    color: #333;
    line-height: 1.6;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    
    @media (min-width: 768px) {
      padding: 0 24px;
    }
  }
`;

export const colors = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#f59e0b',
  background: '#ffffff',
  backgroundSecondary: '#f8f9fa',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gradient: 'linear-gradient(90deg, #5c6ecf 0%, #6550a3 100%)',
  gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
};

export const shadows = {
  small: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
};

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  
  @media (min-width: ${breakpoints.tablet}) {
    padding: 0 24px;
  }
`;

export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'center' | 'space-between' | 'space-around' | 'flex-start' | 'flex-end';
  align?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  gap?: string;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || '0'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

export const Card = styled.div<{ padding?: string; shadow?: boolean }>`
  background: white;
  border-radius: 16px;
  padding: ${props => props.padding || '20px'};
  box-shadow: ${props => props.shadow ? shadows.medium : 'none'};
  border: 1px solid ${colors.border};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.shadow ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.shadow ? shadows.large : 'none'};
  }
`;

export const GradientBackground = styled.div<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'secondary' ? colors.gradientSecondary : colors.gradient};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;
