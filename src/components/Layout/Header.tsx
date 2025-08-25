import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { colors, shadows, breakpoints } from '../../styles/GlobalStyles';

const HeaderContainer = styled.header<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.isScrolled ? 'rgba(255, 255, 255, 0.98)' : colors.gradient};
  backdrop-filter: ${props => props.isScrolled ? 'blur(20px)' : 'none'};
  border-bottom: ${props => props.isScrolled ? `1px solid rgba(255, 255, 255, 0.2)` : 'none'};
  transition: all 0.3s ease;
  padding: 12px 0;
  box-shadow: ${props => props.isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'};

  @media (min-width: ${breakpoints.tablet}) {
    padding: 16px 0;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 20px 0;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 12px;
  position: relative;
  z-index: 2;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 0 20px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 0 24px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.img<{ isScrolled: boolean }>`
  width: 40px;
  height: 40px;
  filter: ${props => props.isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'};
  transition: all 0.3s ease;

  @media (min-width: ${breakpoints.tablet}) {
    width: 48px;
    height: 48px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    width: 56px;
    height: 56px;
  }
`;

const Nav = styled.nav<{ isOpen: boolean; isScrolled: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: ${shadows.large};
  padding: 20px 12px;
  gap: 16px;
  max-height: 80vh;
  overflow-y: auto;

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
    flex-direction: row;
    position: static;
    background: none;
    backdrop-filter: none;
    border: none;
    box-shadow: none;
    padding: 0;
    gap: 24px;
    max-height: none;
    overflow-y: visible;
  }

  @media (min-width: ${breakpoints.desktop}) {
    gap: 40px;
  }
`;

const NavLink = styled.button<{ active?: boolean; isScrolled: boolean }>`
  background: none;
  border: none;
  color: ${props => props.isScrolled ? colors.primary : 'white'};
  font-weight: 500;
  font-size: 18px;
  font-family: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
  text-shadow: ${props => props.isScrolled ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.3)'};
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  width: 100%;
  text-align: left;

  &:hover {
    color: ${props => props.isScrolled ? colors.primary : 'white'};
    background: ${props => props.isScrolled ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 15px;
    padding: 8px 12px;
    width: auto;
    text-align: center;
    border-radius: 8px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 16px;
    padding: 6px 12px;
  }
`;

const ActionButtons = styled.div`
  display: none;
  align-items: center;
  gap: 12px;

  @media (min-width: ${breakpoints.tablet}) {
    display: flex;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'outline'; isScrolled: boolean }>`
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid;
  
  ${props => props.variant === 'primary' ? `
    background: ${colors.primary};
    color: white;
    border-color: ${colors.primary};
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    
    &:hover {
      background: ${colors.primaryDark};
      border-color: ${colors.primaryDark};
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
    }
  ` : `
    background: ${props.isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props.isScrolled ? colors.primary : 'white'};
    border-color: ${props.isScrolled ? colors.primary : 'white'};
    backdrop-filter: blur(10px);
    
    &:hover {
      background: ${colors.primary};
      color: white;
      border-color: ${colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }
  `}

  @media (min-width: ${breakpoints.tablet}) {
    padding: 10px 20px;
    font-size: 13px;
  }
`;

const MobileMenuButton = styled.button<{ isScrolled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: ${props => props.isScrolled ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.isScrolled ? colors.border : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.isScrolled ? colors.backgroundSecondary : 'rgba(255, 255, 255, 0.2)'};
    transform: scale(1.05);
  }

  @media (min-width: ${breakpoints.tablet}) {
    display: none;
  }
`;

const MenuLine = styled.div<{ isOpen: boolean; index: number; isScrolled: boolean }>`
  width: 20px;
  height: 2px;
  background: ${props => props.isScrolled ? colors.text : 'white'};
  transition: all 0.3s ease;
  transform-origin: center;
  border-radius: 1px;

  ${props => props.isOpen && props.index === 0 && `
    transform: rotate(45deg) translate(5px, 5px);
  `}

  ${props => props.isOpen && props.index === 1 && `
    opacity: 0;
  `}

  ${props => props.isOpen && props.index === 2 && `
    transform: rotate(-45deg) translate(5px, -5px);
  `}
`;

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  isScrolled?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onLoginClick, 
  onSignupClick, 
  isScrolled = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    if (location.pathname === '/') {
      // Ana sayfadaysa scroll yap
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Başka sayfadaysa ana sayfaya git ve sonra scroll yap
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <HeaderContainer isScrolled={isScrolled}>
      <HeaderContent>
        <Logo onClick={handleHomeClick}>
          <LogoIcon 
            isScrolled={isScrolled}
            src="/prota-logo.png"
            alt="Prota Travel Logo"
          />
        </Logo>

        <Nav isOpen={isMenuOpen} isScrolled={isScrolled}>
          <NavLink 
            onClick={handleHomeClick}
            active 
            isScrolled={isScrolled}
          >
            Ana Sayfa
          </NavLink>
          <NavLink onClick={() => navigate('/routes')} isScrolled={isScrolled}>
            Rotalarım
          </NavLink>
          <NavLink onClick={() => handleNavigation('#group-travel')} isScrolled={isScrolled}>
            Toplu Seyahat
          </NavLink>
          <NavLink onClick={() => handleNavigation('#popular-routes')} isScrolled={isScrolled}>
            Popüler Rotalar
          </NavLink>
          <NavLink onClick={() => navigate('/chatbox')} isScrolled={isScrolled}>
            Chatbox
          </NavLink>
        </Nav>

        <ActionButtons>
          <Button variant="outline" isScrolled={isScrolled} onClick={onLoginClick}>
            Giriş Yap
          </Button>
          <Button variant="primary" isScrolled={isScrolled} onClick={onSignupClick}>
            Üye Ol
          </Button>
        </ActionButtons>

        <MobileMenuButton isScrolled={isScrolled} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuLine isOpen={isMenuOpen} index={0} isScrolled={isScrolled} />
          <MenuLine isOpen={isMenuOpen} index={1} isScrolled={isScrolled} />
          <MenuLine isOpen={isMenuOpen} index={2} isScrolled={isScrolled} />
        </MobileMenuButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
