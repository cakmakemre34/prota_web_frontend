import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, breakpoints, shadows, GradientBackground } from '../styles/GlobalStyles';
import Header from '../components/Layout/Header';

const RoutesContainer = styled(GradientBackground)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const RoutesContent = styled.div`
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 100px 12px 40px;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 120px 20px 60px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 140px 24px 80px;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: 60px;
  }
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 40px;
    margin-bottom: 20px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 48px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 18px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 20px;
  }
`;

const RouteCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: ${shadows.large};
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 32px;
    margin-bottom: 32px;
  }
`;

const RouteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const RouteTitle = styled.h2`
  color: ${colors.primary};
  font-size: 24px;
  font-weight: 700;
  margin: 0;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 28px;
  }
`;

const RouteDate = styled.div`
  color: ${colors.textSecondary};
  font-size: 14px;
  background: rgba(99, 102, 241, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 16px;
    padding: 10px 20px;
  }
`;

const SelectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`;

const SelectionItem = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(159, 122, 234, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(99, 102, 241, 0.3);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(159, 122, 234, 0.15) 100%);
  }
`;

const SelectionIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 36px;
    margin-bottom: 16px;
  }
`;

const SelectionCategory = styled.div`
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 14px;
  }
`;

const SelectionName = styled.h3`
  color: ${colors.text};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.3;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 18px;
  }
`;

const SelectionPrice = styled.div`
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 700;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: white;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 80px 20px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.7;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 80px;
    margin-bottom: 32px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 28px;
    margin-bottom: 20px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 32px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 18px;
    margin-bottom: 40px;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 16px 32px;
    font-size: 18px;
  }
`;

const TotalCost = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-top: 24px;
  text-align: center;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 24px;
    margin-top: 32px;
  }
`;

const TotalLabel = styled.div`
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }
`;

const TotalAmount = styled.div`
  color: #059669;
  font-size: 28px;
  font-weight: 800;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 32px;
  }
`;

// Data types
interface SelectionItem {
  id: string;
  name: string;
  price: string;
  description?: string;
}

interface Selections {
  hotel: SelectionItem | null;
  restaurant: SelectionItem | null;
  activity: SelectionItem | null;
  transport: SelectionItem | null;
}

const RoutesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get selections from navigation state
  const selections: Selections = location.state?.selections || {
    hotel: null,
    restaurant: null,
    activity: null,
    transport: null
  };

  const hasSelections = Object.values(selections).some(item => item !== null);

  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      hotel: { icon: '🏨', name: 'Konaklama' },
      restaurant: { icon: '🍽️', name: 'Yemek' },
      activity: { icon: '🎯', name: 'Aktivite' },
      transport: { icon: '🚗', name: 'Ulaşım' }
    };
    return categoryMap[category as keyof typeof categoryMap] || { icon: '📍', name: 'Diğer' };
  };

  const calculateTotal = () => {
    let total = 0;
    Object.values(selections).forEach(item => {
      if (item?.price) {
        // Extract number from price string (e.g., "₺2,500/gece" -> 2500)
        const priceMatch = item.price.match(/₺([\d,]+)/);
        if (priceMatch) {
          const price = parseInt(priceMatch[1].replace(',', ''));
          total += price;
        }
      }
    });
    return total;
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

  return (
    <RoutesContainer>
      <Header onLoginClick={() => {}} onSignupClick={() => {}} isScrolled={false} />
      
      <RoutesContent>
        <PageHeader>
          <PageTitle>🗺️ Rotalarım</PageTitle>
          <PageSubtitle>Seyahat planlarınız ve seçimleriniz</PageSubtitle>
        </PageHeader>

        {hasSelections ? (
          <RouteCard>
            <RouteHeader>
              <RouteTitle>Son Seyahat Planım</RouteTitle>
              <RouteDate>{new Date().toLocaleDateString('tr-TR')}</RouteDate>
            </RouteHeader>

            <SelectionsGrid>
              {Object.entries(selections).map(([category, item]) => {
                if (!item) return null;
                const categoryInfo = getCategoryInfo(category);
                
                return (
                  <SelectionItem key={category}>
                    <SelectionIcon>{categoryInfo.icon}</SelectionIcon>
                    <SelectionCategory>{categoryInfo.name}</SelectionCategory>
                    <SelectionName>{item.name}</SelectionName>
                    <SelectionPrice>{item.price}</SelectionPrice>
                  </SelectionItem>
                );
              })}
            </SelectionsGrid>

            <TotalCost>
              <TotalLabel>Toplam Tahmini Maliyet</TotalLabel>
              <TotalAmount>{formatPrice(calculateTotal())}</TotalAmount>
            </TotalCost>
          </RouteCard>
        ) : (
          <EmptyState>
            <EmptyIcon>🧳</EmptyIcon>
            <EmptyTitle>Henüz seyahat planınız yok</EmptyTitle>
            <EmptyDescription>
              Seyahat asistanımız ile konuşarak kişiselleştirilmiş rotalarınızı oluşturun
            </EmptyDescription>
            <ActionButton onClick={handleStartNewPlan}>
              Yeni Plan Oluştur
            </ActionButton>
          </EmptyState>
        )}
      </RoutesContent>
    </RoutesContainer>
  );
};

export default RoutesPage;
