import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/GlobalStyles';

// Types
interface UserPreferences {
  destination?: string;
  budget?: string;
  duration?: string;
  interests?: string[];
  accommodation?: string;
  transport?: string;
}

interface Option {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'hotel' | 'restaurant' | 'activity' | 'transport';
  rating: number;
  features: string[];
}

interface Selections {
  hotel?: Option;
  restaurant?: Option;
  activity?: Option;
  transport?: Option;
}

// Styled Components
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

  @media (max-width: ${breakpoints.tablet}) {
    padding: 0 16px;
    height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
    height: 60px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const MainContent = styled.div`
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

const PreferencesSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px;
    margin-bottom: 24px;
  }
`;

const PreferencesTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: ${colors.primary};
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const PreferenceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PreferenceLabel = styled.span`
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
`;

const PreferenceValue = styled.span`
  font-size: 16px;
  color: #212529;
  font-weight: 600;
`;

const OptionsPanel = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px;
  }
`;

const OptionsTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const OptionCard = styled.div<{ isSelected?: boolean }>`
  border: 2px solid ${props => props.isSelected ? colors.primary : '#e9ecef'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isSelected ? '#f8f9ff' : 'white'};
  position: relative;

  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 16px;
  }
`;

const OptionImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 160px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 16px;

  @media (max-width: ${breakpoints.tablet}) {
    height: 120px;
  }
`;

const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionName = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #212529;
`;

const OptionDescription = styled.p`
  font-size: 14px;
  color: #6c757d;
  margin: 0;
  line-height: 1.5;
`;

const OptionPrice = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.primary};
  margin-top: 8px;
`;

const OptionRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
`;

const StarIcon = styled.span`
  color: #ffc107;
  font-size: 16px;
`;

const RatingText = styled.span`
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
`;

const FeatureTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const FeatureTag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const SelectionActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e9ecef;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const ChatButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const CompleteButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#6c757d' : colors.gradient};
  border: none;
  color: white;
  padding: 12px 32px;
  border-radius: 25px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 10px 24px;
    font-size: 14px;
  }
`;

const TotalCost = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  text-align: center;
  margin-top: 24px;
`;

const TotalCostLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  opacity: 0.9;
`;

const TotalCostAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const SelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [selections, setSelections] = useState<Selections>({});
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (location.state?.preferences) {
      setUserPreferences(location.state.preferences);
      generateOptions(location.state.preferences);
    }
  }, [location.state]);

  // Generate options based on user preferences
  const generateOptions = (preferences: UserPreferences) => {
    const mockOptions: Option[] = [
      {
        id: '1',
        name: 'Luxury Resort & Spa',
        description: 'Deniz manzaralı lüks resort, spa ve havuz imkanları',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        category: 'hotel',
        rating: 4.8,
        features: ['Spa', 'Havuz', 'Restaurant', 'WiFi', 'Parking']
      },
      {
        id: '2',
        name: 'Boutique Hotel',
        description: 'Şehir merkezinde modern tasarım boutique otel',
        price: 1200,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
        category: 'hotel',
        rating: 4.5,
        features: ['WiFi', 'Restaurant', 'Bar', 'Gym']
      },
      {
        id: '3',
        name: 'Fine Dining Restaurant',
        description: 'Geleneksel lezzetleri modern sunumla birleştiren restoran',
        price: 400,
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        category: 'restaurant',
        rating: 4.7,
        features: ['Açık Mutfak', 'Şarap Listesi', 'Teras']
      },
      {
        id: '4',
        name: 'Local Cuisine',
        description: 'Yerel halkın tercih ettiği otantik lezzetler',
        price: 150,
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
        category: 'restaurant',
        rating: 4.3,
        features: ['Geleneksel', 'Uygun Fiyat', 'Kalabalık']
      },
      {
        id: '5',
        name: 'Guided City Tour',
        description: 'Profesyonel rehber eşliğinde şehir turu',
        price: 300,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        category: 'activity',
        rating: 4.6,
        features: ['Rehber', 'Ulaşım', 'Giriş Ücreti Dahil']
      },
      {
        id: '6',
        name: 'Adventure Sports',
        description: 'Macera dolu outdoor aktiviteler',
        price: 500,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
        category: 'activity',
        rating: 4.4,
        features: ['Ekipman', 'Eğitmen', 'Sigorta']
      },
      {
        id: '7',
        name: 'Private Transfer',
        description: 'Lüks araç ile özel transfer hizmeti',
        price: 800,
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80',
        category: 'transport',
        rating: 4.9,
        features: ['Şoför', 'Klimalı', 'WiFi', 'Su']
      },
      {
        id: '8',
        name: 'Public Transport Pass',
        description: 'Şehir içi toplu taşıma kartı',
        price: 100,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        category: 'transport',
        rating: 4.2,
        features: ['Sınırsız Kullanım', 'Ekonomik', 'Kolay Erişim']
      }
    ];

    // Filter options based on preferences
    let filteredOptions = mockOptions;
    
    if (preferences.budget === 'low') {
      filteredOptions = mockOptions.filter(option => option.price <= 500);
    } else if (preferences.budget === 'medium') {
      filteredOptions = mockOptions.filter(option => option.price <= 1500);
    }

    setOptions(filteredOptions);
  };

  const handleOptionSelect = (option: Option) => {
    setSelections(prev => ({
      ...prev,
      [option.category]: option
    }));
  };

  const handleChatButton = () => {
    navigate('/chatbox', { 
      state: { 
        requestNewOptions: true,
        currentSelections: selections,
        preferences: userPreferences
      }
    });
  };

  const handleCompleteSelection = () => {
    const totalCost = Object.values(selections).reduce((sum, option) => sum + (option?.price || 0), 0);
    
    navigate('/routes', {
      state: {
        selections,
        preferences: userPreferences,
        totalCost,
        newRouteId: Date.now().toString()
      }
    });
  };

  const isSelectionComplete = () => {
    return selections.hotel && selections.restaurant && selections.activity && selections.transport;
  };

  const calculateTotalCost = () => {
    return Object.values(selections).reduce((sum, option) => sum + (option?.price || 0), 0);
  };

  const getCategoryOptions = (category: string) => {
    return options.filter(option => option.category === category);
  };

  const getCategoryTitle = (category: string) => {
    const titles = {
      hotel: '🏨 Konaklama Seçenekleri',
      restaurant: '🍽️ Restoran Seçenekleri',
      activity: '🎯 Aktivite Seçenekleri',
      transport: '🚗 Ulaşım Seçenekleri'
    };
    return titles[category as keyof typeof titles] || category;
  };

  const categories = ['hotel', 'restaurant', 'activity', 'transport'];

  return (
    <SelectionContainer>
      <Header>
        <HeaderTitle>🎯 Seçim Ekranı</HeaderTitle>
        <BackButton onClick={() => navigate('/')}>
          ← Ana Sayfa
        </BackButton>
      </Header>

      <MainContent>
        {/* Preferences Summary */}
        <PreferencesSummary>
          <PreferencesTitle>📋 Tercihleriniz</PreferencesTitle>
          <PreferencesGrid>
            {userPreferences.destination && (
              <PreferenceItem>
                <PreferenceLabel>Destinasyon</PreferenceLabel>
                <PreferenceValue>{userPreferences.destination}</PreferenceValue>
              </PreferenceItem>
            )}
            {userPreferences.budget && (
              <PreferenceItem>
                <PreferenceLabel>Bütçe</PreferenceLabel>
                <PreferenceValue>
                  {userPreferences.budget === 'low' ? 'Ekonomik' : 
                   userPreferences.budget === 'medium' ? 'Orta' : 'Lüks'}
                </PreferenceValue>
              </PreferenceItem>
            )}
            {userPreferences.duration && (
              <PreferenceItem>
                <PreferenceLabel>Süre</PreferenceLabel>
                <PreferenceValue>{userPreferences.duration}</PreferenceValue>
              </PreferenceItem>
            )}
            {userPreferences.interests && (
              <PreferenceItem>
                <PreferenceLabel>İlgi Alanları</PreferenceLabel>
                <PreferenceValue>{userPreferences.interests.join(', ')}</PreferenceValue>
              </PreferenceItem>
            )}
          </PreferencesGrid>
        </PreferencesSummary>

        {/* Options for each category */}
        {categories.map(category => (
          <OptionsPanel key={category}>
            <OptionsTitle>
              {getCategoryTitle(category)}
              {selections[category as keyof Selections] && (
                <span style={{ fontSize: '14px', color: '#28a745', fontWeight: '500' }}>
                  ✓ Seçildi
                </span>
              )}
            </OptionsTitle>
            
            <OptionsGrid>
              {getCategoryOptions(category).map(option => (
                <OptionCard
                  key={option.id}
                  isSelected={selections[category as keyof Selections]?.id === option.id}
                  onClick={() => handleOptionSelect(option)}
                >
                  <OptionImage imageUrl={option.image} />
                  <OptionContent>
                    <OptionName>{option.name}</OptionName>
                    <OptionDescription>{option.description}</OptionDescription>
                    <OptionRating>
                      <StarIcon>★</StarIcon>
                      <RatingText>{option.rating}/5.0</RatingText>
                    </OptionRating>
                    <FeatureTags>
                      {option.features.map(feature => (
                        <FeatureTag key={feature}>{feature}</FeatureTag>
                      ))}
                    </FeatureTags>
                    <OptionPrice>₺{option.price.toLocaleString()}</OptionPrice>
                  </OptionContent>
                </OptionCard>
              ))}
            </OptionsGrid>
          </OptionsPanel>
        ))}

        {/* Total Cost */}
        {Object.keys(selections).length > 0 && (
          <TotalCost>
            <TotalCostLabel>Toplam Tahmini Maliyet</TotalCostLabel>
            <TotalCostAmount>₺{calculateTotalCost().toLocaleString()}</TotalCostAmount>
          </TotalCost>
        )}

        {/* Action Buttons */}
        <SelectionActions>
          <ChatButton onClick={handleChatButton}>
            💬 Yeni Seçenekler İste
          </ChatButton>
          
          <CompleteButton 
            onClick={handleCompleteSelection}
            disabled={!isSelectionComplete()}
          >
            {isSelectionComplete() ? '✅ Seçimleri Onayla' : 'Seçimleri Tamamlayın'}
          </CompleteButton>
        </SelectionActions>
      </MainContent>
    </SelectionContainer>
  );
};

export default SelectionPage;
