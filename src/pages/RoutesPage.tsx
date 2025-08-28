import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/GlobalStyles';
import Header from '../components/Layout/Header';

const RoutesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundSecondary} 100%);
  display: flex;
  flex-direction: column;
`;

const RoutesContent = styled.div`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;

  @media (max-width: ${breakpoints.tablet}) {
    margin-bottom: 32px;
  }
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${breakpoints.tablet}) {
    padding: 40px 16px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 48px;
    margin-bottom: 20px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px 0;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 20px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  opacity: 0.8;
  margin: 0 0 32px 0;
  line-height: 1.6;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 14px;
    margin-bottom: 24px;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 14px 28px;
    font-size: 14px;
  }
`;

const SavedRoutesSection = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const SavedRoutesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SavedRouteCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 20px;
  }
`;

const SavedRouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const SavedRouteTitle = styled.h3`
  color: ${colors.primary};
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 18px;
  }
`;

const SavedRouteDate = styled.div`
  color: ${colors.textSecondary};
  font-size: 14px;
  background: rgba(99, 102, 241, 0.1);
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  white-space: nowrap;
`;

const SavedRouteSummary = styled.div`
  margin-bottom: 20px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: ${colors.textSecondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  font-weight: 500;
`;

const SummaryValue = styled.span`
  color: ${colors.text};
  font-weight: 600;
`;

const SavedRouteActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const ViewDetailsButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }
`;

const DeleteButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

// Route Details Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  padding: 24px;
  border-radius: 24px 24px 0 0;
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 20px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 24px;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 20px;
  }
`;

const PreferencesSection = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #dee2e6;
`;

const PreferencesTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primary};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const PreferenceItem = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
`;

const PreferenceLabel = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const PreferenceValue = styled.div`
  font-size: 14px;
  color: ${colors.text};
  font-weight: 500;
`;

const SelectionsSection = styled.div`
  margin-bottom: 24px;
`;

const SelectionsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SelectionItem = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const SelectionImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const SelectionContent = styled.div``;

const SelectionIcon = styled.div`
  font-size: 20px;
  margin-bottom: 4px;
`;

const SelectionCategory = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SelectionName = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

const SelectionPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 8px;
`;

const TotalCostSection = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  margin-top: 24px;
`;

const TotalLabel = styled.div`
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const TotalAmount = styled.div`
  color: #059669;
  font-size: 28px;
  font-weight: 800;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 24px;
  }
`;

// Data types
interface SelectionItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
}

interface Selections {
  hotel: SelectionItem | null;
  restaurant: SelectionItem | null;
  activity: SelectionItem | null;
  transport: SelectionItem | null;
}

interface UserPreferences {
  destination?: string;
  budget?: string;
  duration?: string;
  interests?: string[];
  accommodation?: string;
  food?: string;
  transport?: string;
  travelStyle?: string;
}

interface SavedRoute {
  id: string;
  createdAt: string;
  selections: Selections;
  preferences: UserPreferences;
  totalCost: number;
  status: 'active' | 'archived';
}

const RoutesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load saved routes from localStorage
    try {
      const saved = localStorage.getItem('savedRoutes');
      if (saved) {
        const parsedRoutes = JSON.parse(saved);
        setSavedRoutes(parsedRoutes);
      }
    } catch (error) {
      console.error('Saved routes yüklenirken hata:', error);
    }
  }, []);

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      hotel: { icon: '🏨', name: 'Konaklama' },
      restaurant: { icon: '🍽️', name: 'Yemek' },
      activity: { icon: '🎯', name: 'Aktivite' },
      transport: { icon: '🚗', name: 'Ulaşım' }
    };
    return categoryMap[category as keyof typeof categoryMap] || { icon: '📍', name: 'Diğer' };
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleStartNewPlan = () => {
    navigate('/chatbox');
  };

  const handleViewRouteDetails = (route: SavedRoute) => {
    setSelectedRoute(route);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoute(null);
  };

  const handleDeleteRoute = (routeId: string) => {
    if (window.confirm('Bu rotayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        const updatedRoutes = savedRoutes.filter(route => route.id !== routeId);
        setSavedRoutes(updatedRoutes);
        localStorage.setItem('savedRoutes', JSON.stringify(updatedRoutes));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
          z-index: 10000;
          font-weight: 600;
          animation: slideIn 0.3s ease-out;
        `;
        successMessage.innerHTML = '🗑️ Rota başarıyla silindi!';
        document.body.appendChild(successMessage);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          if (successMessage.parentNode) {
            successMessage.parentNode.removeChild(successMessage);
          }
        }, 3000);
        
      } catch (error) {
        console.error('Rota silinirken hata oluştu:', error);
        alert('Rota silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <RoutesContainer>
      <Header onLoginClick={() => {}} onSignupClick={() => {}} isScrolled={false} />
      
      <RoutesContent>
        <PageHeader>
          <PageTitle>🗺️ Rotalarım</PageTitle>
          <PageSubtitle>Seyahat planlarınız ve kaydedilen rotalarınız</PageSubtitle>
        </PageHeader>

        {savedRoutes.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🧳</EmptyIcon>
            <EmptyTitle>Henüz kaydedilmiş rota yok</EmptyTitle>
            <EmptyDescription>
              Seyahat asistanımız ile konuşarak kişiselleştirilmiş rotalarınızı oluşturun ve kaydedin
            </EmptyDescription>
            <ActionButton onClick={handleStartNewPlan}>
              Yeni Plan Oluştur
            </ActionButton>
          </EmptyState>
        ) : (
          <SavedRoutesSection>
            <SectionTitle>💾 Kaydedilen Rotalar</SectionTitle>
            <SavedRoutesGrid>
              {savedRoutes.map((route) => (
                <SavedRouteCard key={route.id}>
                  <SavedRouteHeader>
                    <SavedRouteTitle>
                      {route.preferences.destination || 'Yeni Rota'} - {new Date(route.createdAt).toLocaleDateString('tr-TR')}
                    </SavedRouteTitle>
                    <SavedRouteDate>
                      {new Date(route.createdAt).toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </SavedRouteDate>
                  </SavedRouteHeader>
                  
                  <SavedRouteSummary>
                    <SummaryItem>
                      <SummaryLabel>Destinasyon:</SummaryLabel>
                      <SummaryValue>{route.preferences.destination || 'Belirtilmemiş'}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Toplam Maliyet:</SummaryLabel>
                      <SummaryValue>{formatPrice(route.totalCost)}</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Seçimler:</SummaryLabel>
                      <SummaryValue>{Object.values(route.selections).filter(Boolean).length}/4</SummaryValue>
                    </SummaryItem>
                    <SummaryItem>
                      <SummaryLabel>Bütçe:</SummaryLabel>
                      <SummaryValue>{route.preferences.budget || 'Belirtilmemiş'}</SummaryValue>
                    </SummaryItem>
                  </SavedRouteSummary>
                  
                  <SavedRouteActions>
                    <ViewDetailsButton onClick={() => handleViewRouteDetails(route)}>
                      🔍 Rota Detaylarını Görüntüle
                    </ViewDetailsButton>
                    <DeleteButton onClick={() => handleDeleteRoute(route.id)}>
                      🗑️ Sil
                    </DeleteButton>
                  </SavedRouteActions>
                </SavedRouteCard>
              ))}
            </SavedRoutesGrid>
          </SavedRoutesSection>
        )}

        {/* Route Details Modal */}
        {showModal && selectedRoute && (
          <ModalOverlay onClick={handleCloseModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  🗺️ Rota Detayları
                  <span style={{ fontSize: '16px', opacity: 0.9 }}>
                    {new Date(selectedRoute.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </ModalTitle>
                <CloseButton onClick={handleCloseModal}>×</CloseButton>
              </ModalHeader>

              <ModalBody>
                {/* Preferences Summary */}
                <PreferencesSection>
                  <PreferencesTitle>📋 Rota Tercihleri</PreferencesTitle>
                  <PreferencesGrid>
                    {selectedRoute.preferences.destination && (
                      <PreferenceItem>
                        <PreferenceLabel>Destinasyon</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.destination}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.budget && (
                      <PreferenceItem>
                        <PreferenceLabel>Bütçe</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.budget}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.duration && (
                      <PreferenceItem>
                        <PreferenceLabel>Süre</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.duration}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.interests && (
                      <PreferenceItem>
                        <PreferenceLabel>İlgi Alanları</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.interests.join(', ')}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.accommodation && (
                      <PreferenceItem>
                        <PreferenceLabel>Konaklama</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.accommodation}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.food && (
                      <PreferenceItem>
                        <PreferenceLabel>Yemek</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.food}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.transport && (
                      <PreferenceItem>
                        <PreferenceLabel>Ulaşım</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.transport}</PreferenceValue>
                      </PreferenceItem>
                    )}
                    {selectedRoute.preferences.travelStyle && (
                      <PreferenceItem>
                        <PreferenceLabel>Seyahat Tarzı</PreferenceLabel>
                        <PreferenceValue>{selectedRoute.preferences.travelStyle}</PreferenceValue>
                      </PreferenceItem>
                    )}
                  </PreferencesGrid>
                </PreferencesSection>

                {/* Selections */}
                <SelectionsSection>
                  <SelectionsTitle>🎯 Seçilen Öğeler</SelectionsTitle>
                  <SelectionsGrid>
                    {Object.entries(selectedRoute.selections).map(([category, item]) => {
                      if (!item) return null;
                      const categoryInfo = getCategoryInfo(category);
                      
                      return (
                        <SelectionItem key={category}>
                          <SelectionImage src={item.image} alt={item.name} />
                          <SelectionContent>
                            <SelectionIcon>{categoryInfo.icon}</SelectionIcon>
                            <SelectionCategory>{categoryInfo.name}</SelectionCategory>
                            <SelectionName>{item.name}</SelectionName>
                            <SelectionPrice>{item.price}</SelectionPrice>
                            {item.description && (
                              <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>
                                {item.description}
                              </p>
                            )}
                          </SelectionContent>
                        </SelectionItem>
                      );
                    })}
                  </SelectionsGrid>
                </SelectionsSection>

                {/* Total Cost */}
                <TotalCostSection>
                  <TotalLabel>Toplam Tahmini Maliyet</TotalLabel>
                  <TotalAmount>{formatPrice(selectedRoute.totalCost)}</TotalAmount>
                </TotalCostSection>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        )}
      </RoutesContent>
    </RoutesContainer>
  );
};

export default RoutesPage;
