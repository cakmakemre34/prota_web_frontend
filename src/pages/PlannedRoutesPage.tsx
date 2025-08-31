import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { colors, breakpoints } from '../styles/GlobalStyles';

interface Route {
  id: string;
  destination: string;
  duration: string;
  people: number;
  accommodation: string;
  budget: number;
  status: 'planned' | 'completed';
  createdAt: Date;
  details?: {
    accommodation: string[];
    activities: string[];
    transportation: string[];
    restaurants: string[];
  };
}

const PlannedRoutesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'planned' | 'completed'>('planned');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // LocalStorage'dan rotaları yükle
    const savedRoutes = localStorage.getItem('travelRoutes');
    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes));
    }
  }, []);

  const handleCreateRoute = () => {
    setShowCreateForm(true);
    setSelectedRoute(null);
  };

  const handleRouteSelect = (route: Route) => {
    setSelectedRoute(route);
    setShowCreateForm(false);
  };

  const handleCompleteRoute = (routeId: string) => {
    const updatedRoutes = routes.map(route => 
      route.id === routeId ? { ...route, status: 'completed' as const } : route
    );
    setRoutes(updatedRoutes);
    localStorage.setItem('travelRoutes', JSON.stringify(updatedRoutes));
  };

  const handleDeleteRoute = (routeId: string) => {
    const updatedRoutes = routes.filter(route => route.id !== routeId);
    setRoutes(updatedRoutes);
    localStorage.setItem('travelRoutes', JSON.stringify(updatedRoutes));
  };

  const filteredRoutes = routes.filter(route => route.status === activeTab);

  return (
    <PageContainer>
      <Header>
        <Title>🚀 Rotalarım</Title>
        <Subtitle>Planlanan ve tamamlanan seyahat rotalarınız</Subtitle>
      </Header>

      <TabContainer>
        <TabButton 
          active={activeTab === 'planned'} 
          onClick={() => setActiveTab('planned')}
        >
          📋 Planlanan Rotalar ({routes.filter(r => r.status === 'planned').length})
        </TabButton>
        <TabButton 
          active={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')}
        >
          ✅ Tamamlanan Rotalar ({routes.filter(r => r.status === 'completed').length})
        </TabButton>
      </TabContainer>

      {activeTab === 'planned' && (
        <ActionSection>
          <CreateButton onClick={handleCreateRoute}>
            ✨ Yeni Rota Oluştur
          </CreateButton>
        </ActionSection>
      )}

      <ContentContainer>
        {showCreateForm && (
          <CreateRouteForm onClose={() => setShowCreateForm(false)} />
        )}

        {selectedRoute && (
          <RouteDetails route={selectedRoute} onClose={() => setSelectedRoute(null)} />
        )}

        {!showCreateForm && !selectedRoute && (
          <RoutesList>
            {filteredRoutes.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🗺️</EmptyIcon>
                <EmptyTitle>
                  {activeTab === 'planned' 
                    ? 'Henüz planlanan rota yok' 
                    : 'Henüz tamamlanan rota yok'
                  }
                </EmptyTitle>
                <EmptyText>
                  {activeTab === 'planned' 
                    ? 'Yeni bir rota oluşturmaya başlayın!' 
                    : 'Planlanan rotalarınızı tamamlayın!'
                  }
                </EmptyText>
                {activeTab === 'planned' && (
                  <EmptyButton onClick={handleCreateRoute}>
                    İlk Rotanızı Oluşturun
                  </EmptyButton>
                )}
              </EmptyState>
            ) : (
              filteredRoutes.map(route => (
                <RouteCard key={route.id} onClick={() => handleRouteSelect(route)}>
                  <RouteHeader>
                    <RouteTitle>{route.destination}</RouteTitle>
                    <RouteStatus status={route.status}>
                      {route.status === 'planned' ? '📋 Planlanıyor' : '✅ Tamamlandı'}
                    </RouteStatus>
                  </RouteHeader>
                  
                  <RouteInfo>
                    <InfoItem>👥 {route.people} kişi</InfoItem>
                    <InfoItem>📅 {route.duration}</InfoItem>
                    <InfoItem>🏨 {route.accommodation}</InfoItem>
                    <InfoItem>💰 {route.budget.toLocaleString('tr-TR')} TL</InfoItem>
                  </RouteInfo>

                  <RouteActions>
                    {route.status === 'planned' && (
                      <>
                        <ActionButton onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteRoute(route.id);
                        }}>
                          ✅ Tamamla
                        </ActionButton>
                        <ActionButton 
                          danger 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRoute(route.id);
                          }}
                        >
                          🗑️ Sil
                        </ActionButton>
                      </>
                    )}
                  </RouteActions>
                </RouteCard>
              ))
            )}
          </RoutesList>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

// Create Route Form Component
const CreateRouteForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    destination: '',
    people: 1,
    duration: '',
    accommodation: '',
    budget: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRoute: Route = {
      id: Date.now().toString(),
      ...formData,
      status: 'planned',
      createdAt: new Date(),
      details: {
        accommodation: [],
        activities: [],
        transportation: [],
        restaurants: []
      }
    };

    const existingRoutes = JSON.parse(localStorage.getItem('travelRoutes') || '[]');
    const updatedRoutes = [...existingRoutes, newRoute];
    localStorage.setItem('travelRoutes', JSON.stringify(updatedRoutes));
    
    onClose();
    window.location.reload(); // Sayfayı yenile
  };

  return (
    <FormOverlay>
      <FormContainer>
        <FormHeader>
          <FormTitle>✨ Yeni Rota Oluştur</FormTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </FormHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>🎯 Destinasyon</Label>
            <Input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              placeholder="Nereye gitmek istiyorsunuz?"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>👥 Kişi Sayısı</Label>
            <Input
              type="number"
              min="1"
              value={formData.people}
              onChange={(e) => setFormData({...formData, people: parseInt(e.target.value)})}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>📅 Süre</Label>
            <Input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="Örn: 3 gece 4 gün"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>🏨 Konaklama Tipi</Label>
            <Select
              value={formData.accommodation}
              onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
              required
            >
              <option value="">Seçiniz</option>
              <option value="otel">Otel</option>
              <option value="airbnb">Airbnb</option>
              <option value="villa">Villa</option>
              <option value="hostel">Hostel</option>
              <option value="resort">Resort</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>💰 Bütçe (TL)</Label>
            <Input
              type="number"
              min="0"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
              placeholder="Toplam bütçeniz"
              required
            />
          </FormGroup>

          <FormActions>
            <CancelButton type="button" onClick={onClose}>
              İptal
            </CancelButton>
            <SubmitButton type="submit">
              🚀 Rotayı Oluştur
            </SubmitButton>
          </FormActions>
        </Form>
      </FormContainer>
    </FormOverlay>
  );
};

// Route Details Component
const RouteDetails: React.FC<{ route: Route; onClose: () => void }> = ({ route, onClose }) => {
  return (
    <DetailsOverlay>
      <DetailsContainer>
        <DetailsHeader>
          <DetailsTitle>🗺️ {route.destination} Rotası</DetailsTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </DetailsHeader>

        <DetailsContent>
          <DetailsSection>
            <SectionTitle>📋 Rota Bilgileri</SectionTitle>
            <InfoGrid>
              <InfoItem>👥 {route.people} kişi</InfoItem>
              <InfoItem>📅 {route.duration}</InfoItem>
              <InfoItem>🏨 {route.accommodation}</InfoItem>
              <InfoItem>💰 {route.budget.toLocaleString('tr-TR')} TL</InfoItem>
            </InfoGrid>
          </DetailsSection>

          <DetailsSection>
            <SectionTitle>🏨 Konaklama Seçenekleri</SectionTitle>
            <OptionsList>
              <OptionItem>🏖️ Deniz manzaralı villa</OptionItem>
              <OptionItem>🌿 Doğaya yakın konum</OptionItem>
              <OptionItem>🏊‍♂️ Özel havuz</OptionItem>
              <OptionItem>🚗 Ücretsiz otopark</OptionItem>
            </OptionsList>
          </DetailsSection>

          <DetailsSection>
            <SectionTitle>🎯 Aktivite Seçenekleri</SectionTitle>
            <OptionsList>
              <OptionItem>🏊‍♂️ Günlük koy turları</OptionItem>
              <OptionItem>🚣‍♀️ Tekne turu</OptionItem>
              <OptionItem>🏃‍♀️ Likya Yolu yürüyüşü</OptionItem>
              <OptionItem>🪂 Yamaç paraşütü</OptionItem>
            </OptionsList>
          </DetailsSection>

          <DetailsSection>
            <SectionTitle>🚗 Ulaşım Seçenekleri</SectionTitle>
            <OptionsList>
              <OptionItem>✈️ Dalaman Havalimanı transfer</OptionItem>
              <OptionItem>🚗 Araç kiralama</OptionItem>
              <OptionItem>🚌 Günübirlik turlar</OptionItem>
            </OptionsList>
          </DetailsSection>
        </DetailsContent>

        <DetailsActions>
          <ActionButton onClick={onClose}>
            Kapat
          </ActionButton>
        </DetailsActions>
      </DetailsContainer>
    </DetailsOverlay>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${colors.textSecondary};
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 10px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? colors.primary : 'white'};
  color: ${props => props.active ? 'white' : colors.text};
  box-shadow: ${props => props.active ? '0 4px 15px rgba(139, 156, 246, 0.3)' : '0 2px 10px rgba(0,0,0,0.1)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 6px 20px rgba(139, 156, 246, 0.4)' : '0 4px 15px rgba(0,0,0,0.15)'};
  }
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const CreateButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 156, 246, 0.3);

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 156, 246, 0.4);
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const RoutesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const RouteCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const RouteTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

const RouteStatus = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => props.status === 'completed' ? '#10b981' : '#f59e0b'};
  color: white;
`;

const RouteInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

const InfoItem = styled.span`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
`;

const RouteActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button<{ danger?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.danger ? '#ef4444' : colors.primary};
  color: white;

  &:hover {
    background: ${props => props.danger ? '#dc2626' : colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  grid-column: 1 / -1;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 10px 0;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: ${colors.textSecondary};
  margin: 0 0 30px 0;
`;

const EmptyButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
  }
`;

// Form Styled Components
const FormOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  color: #6b7280;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const Form = styled.form`
  padding: 25px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.text};
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: white;
  color: ${colors.text};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: ${colors.primary};
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryDark};
  }
`;

// Details Styled Components
const DetailsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const DetailsContainer = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 25px 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const DetailsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

const DetailsContent = styled.div`
  padding: 25px;
`;

const DetailsSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 15px 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OptionItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  color: ${colors.textSecondary};
  font-size: 0.95rem;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailsActions = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px 25px;
  border-top: 1px solid #e5e7eb;
`;

export default PlannedRoutesPage;
