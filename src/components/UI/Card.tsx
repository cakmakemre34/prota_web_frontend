import React from 'react';
import styled from 'styled-components';
import { colors, shadows, breakpoints } from '../../styles/GlobalStyles';

interface CardProps {
  children: React.ReactNode;
  padding?: 'small' | 'medium' | 'large';
  shadow?: boolean;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

const StyledCard = styled.div<{
  padding: 'small' | 'medium' | 'large';
  shadow: boolean;
  hover: boolean;
  clickable: boolean;
}>`
  background: white;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  transition: all 0.3s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  ${props => {
    switch (props.padding) {
      case 'small':
        return 'padding: 12px;';
      case 'large':
        return 'padding: 24px;';
      default:
        return 'padding: 20px;';
    }
  }}

  ${props => props.shadow && `
    box-shadow: ${shadows.medium};
  `}

  ${props => props.hover && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${shadows.xl};
      border-color: ${colors.primary};
    }
  `}

  @media (min-width: ${breakpoints.tablet}) {
    border-radius: 20px;
    
    ${props => {
      switch (props.padding) {
        case 'small':
          return 'padding: 16px;';
        case 'large':
          return 'padding: 32px;';
        default:
          return 'padding: 24px;';
      }
    }}
  }
`;

const Card: React.FC<CardProps> = ({
  children,
  padding = 'medium',
  shadow = true,
  hover = false,
  onClick,
  className,
}) => {
  return (
    <StyledCard
      padding={padding}
      shadow={shadow}
      hover={hover}
      clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

export default Card;

