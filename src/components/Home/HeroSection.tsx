import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, breakpoints, GradientBackground } from '../../styles/GlobalStyles';
import Button from '../UI/Button';

const HeroContainer = styled(GradientBackground)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 12px 40px;
  text-align: center;
  position: relative;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 100px 20px 60px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 120px 24px 80px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  color: white;
`;

const HeroTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 40px;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 56px;
    margin-bottom: 24px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  margin-bottom: 32px;
  opacity: 0.95;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 0 8px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 18px;
    margin-bottom: 40px;
    padding: 0;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 20px;
    margin-bottom: 48px;
  }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin: 0 8px 24px 8px;

  @media (min-width: ${breakpoints.tablet}) {
    flex-direction: row;
    padding: 8px;
    gap: 8px;
    border-radius: 20px;
    margin: 0 0 32px 0;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 12px;
    margin-bottom: 40px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border: none;
  outline: none;
  font-size: 16px;
  border-radius: 10px;
  background: ${colors.backgroundSecondary};
  color: ${colors.text};

  &::placeholder {
    color: ${colors.textSecondary};
  }

  @media (min-width: ${breakpoints.tablet}) {
    background: transparent;
    padding: 16px 20px;
    border-radius: 12px;
  }
`;

const SearchButton = styled(Button)`
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 600;
  
  @media (min-width: ${breakpoints.tablet}) {
    padding: 16px 28px;
    white-space: nowrap;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 16px 32px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 32px;
  padding: 0 8px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 48px;
    padding: 0;
  }

  @media (min-width: ${breakpoints.desktop}) {
    gap: 32px;
    margin-top: 64px;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 28px;
    margin-bottom: 6px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 32px;
    margin-bottom: 8px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 14px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 16px;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const FloatingIcon = styled.div<{ 
  left: string; 
  top: string; 
  delay: string; 
  size: string; 
}>`
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  font-size: ${props => props.size};
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
  animation-delay: ${props => props.delay};

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }
`;

interface HeroSectionProps {
  onSearchClick: (query: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearchClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchClick(searchQuery.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <HeroContainer>
      <FloatingElements>
        <FloatingIcon left="10%" top="20%" delay="0s" size="48px">🏔️</FloatingIcon>
        <FloatingIcon left="85%" top="15%" delay="1s" size="36px">🏖️</FloatingIcon>
        <FloatingIcon left="15%" top="70%" delay="2s" size="42px">🗺️</FloatingIcon>
        <FloatingIcon left="80%" top="75%" delay="3s" size="40px">✈️</FloatingIcon>
        <FloatingIcon left="50%" top="10%" delay="4s" size="32px">🧳</FloatingIcon>
        <FloatingIcon left="20%" top="40%" delay="5s" size="38px">📍</FloatingIcon>
      </FloatingElements>

      <HeroContent>
        <HeroTitle>
          Hayalindeki Yolculuğa Başla
        </HeroTitle>
        
        <HeroSubtitle>
          Seyahatini planla, keşfetmeye başla! Kişiselleştirilmiş rotalar ve 
          AI destekli seyahat asistanı ile unutulmaz deneyimler yaşa.
        </HeroSubtitle>

        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="🔍 Nereye gitmek istersin?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton 
            variant="primary" 
            size="large"
            onClick={handleSearch}
          >
            Keşfet
          </SearchButton>
        </SearchContainer>

        <StatsContainer>
          <StatItem>
            <StatNumber>10K+</StatNumber>
            <StatLabel>Mutlu Gezgin</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>500+</StatNumber>
            <StatLabel>Destinasyon</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>1200+</StatNumber>
            <StatLabel>İşletme</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>Şehir</StatLabel>
          </StatItem>
        </StatsContainer>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
