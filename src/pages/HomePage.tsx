import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Layout/Header';
import HeroSection from '../components/Home/HeroSection';
import PopularDestinations from '../components/Home/PopularDestinations';
import RecommendedRoutes from '../components/Routes/RecommendedRoutes';
import LoginModal from '../components/Auth/LoginModal';
import SignupModal from '../components/Auth/SignupModal';
import { Destination, Route } from '../types';
import ChatboxModal from '../components/Chatbox/ChatboxModal';

const PageContainer = styled.div`
  min-height: 100vh;
`;

const Footer = styled.footer`
  background: #1f2937;
  color: white;
  padding: 60px 16px 40px;
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 60px;
  }
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FooterLink = styled.a`
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatQuery, setChatQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    // Chatbox modal'ını aç
    setChatQuery(query);
    setIsChatModalOpen(true);
  };

  const handleDestinationClick = (destination: Destination) => {
    console.log('Destination clicked:', destination);
    // Navigate to destination page
  };

  const handleRouteClick = (route: Route) => {
    console.log('Route clicked:', route);
    // Navigate to route detail page
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <PageContainer>
      <Header
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        isScrolled={isScrolled}
      />

      <main>
        <HeroSection onSearchClick={handleSearch} />
        <PopularDestinations onDestinationClick={handleDestinationClick} />
        <RecommendedRoutes onRouteClick={handleRouteClick} />
      </main>

      <Footer>
        <FooterContent>
          <FooterSection>
            <FooterTitle>🌍 Prota Travel</FooterTitle>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.6' }}>
              Seyahat planlamanın en kolay ve eğlenceli yolu. 
              Hayalinizdeki tatili gerçeğe dönüştürün.
            </p>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Keşfet</FooterTitle>
            <FooterLink href="#destinations">Destinasyonlar</FooterLink>
            <FooterLink href="#routes">Rotalar</FooterLink>
            <FooterLink href="#businesses">İşletmeler</FooterLink>
            <FooterLink href="#experiences">Deneyimler</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Şirket</FooterTitle>
            <FooterLink href="#about">Hakkımızda</FooterLink>
            <FooterLink href="#careers">Kariyer</FooterLink>
            <FooterLink href="#press">Basın</FooterLink>
            <FooterLink href="#contact">İletişim</FooterLink>
          </FooterSection>
          
          <FooterSection>
            <FooterTitle>Destek</FooterTitle>
            <FooterLink href="#help">Yardım Merkezi</FooterLink>
            <FooterLink href="#safety">Güvenlik</FooterLink>
            <FooterLink href="#terms">Şartlar</FooterLink>
            <FooterLink href="#privacy">Gizlilik</FooterLink>
          </FooterSection>
        </FooterContent>
        
        <FooterBottom>
          © 2024 Prota Travel. Tüm hakları saklıdır.
        </FooterBottom>
      </Footer>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />

      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Chatbox Modal */}
      <ChatboxModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        initialQuery={chatQuery}
      />
    </PageContainer>
  );
};

export default HomePage;
