import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/GlobalStyles';

const SelectionContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 80px;
  background: ${colors.gradient};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const SelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userPreferences, setUserPreferences] = useState<any>({});

  useEffect(() => {
    if (location.state?.preferences) {
      setUserPreferences(location.state.preferences);
    }
  }, [location.state]);

  return (
    <SelectionContainer>
      <Header>
        <HeaderTitle>🎯 Seçim Ekranı</HeaderTitle>
        <BackButton onClick={() => navigate('/')}>
          ← Ana Sayfa
        </BackButton>
      </Header>

      <MainContent>
        <h2>Seçim Ekranı</h2>
        <p>Bu sayfa henüz geliştirilme aşamasında.</p>
        <p>Tercihleriniz: {JSON.stringify(userPreferences)}</p>
      </MainContent>
    </SelectionContainer>
  );
};

export default SelectionPage;
