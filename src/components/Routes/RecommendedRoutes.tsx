import React from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../../styles/GlobalStyles';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { Route } from '../../types';

const Section = styled.section`
  padding: 80px 16px;
  background: white;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 100px 24px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: 64px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 12px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 36px;
    margin-bottom: 16px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 16px;
  color: ${colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 18px;
  }
`;

const RoutesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 48px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RouteCard = styled(Card)`
  overflow: hidden;
  padding: 0;
  height: 400px;
  display: flex;
  flex-direction: column;

  @media (min-width: ${breakpoints.tablet}) {
    height: 450px;
  }
`;

const RouteImage = styled.div<{ backgroundImage: string }>`
  height: 200px;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }

  ${RouteCard}:hover & {
    transform: scale(1.02);
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 220px;
  }
`;

const RouteContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 24px;
  }
`;

const RouteInfo = styled.div`
  margin-bottom: 16px;
`;

const RouteTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 8px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 22px;
  }
`;

const RouteDescription = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.5;
  margin-bottom: 16px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 15px;
  }
`;

const RouteDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${colors.textSecondary};
  background: ${colors.backgroundSecondary};
  padding: 6px 12px;
  border-radius: 20px;

  span {
    font-size: 16px;
  }

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 14px;
  }
`;

const RouteActions = styled.div`
  display: flex;
  gap: 12px;
`;

const StatusBadge = styled.div<{ visited: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: ${props => props.visited ? colors.success : colors.warning};
  z-index: 1;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 13px;
    padding: 8px 16px;
  }
`;

const recommendedRoutes: Route[] = [
  {
    id: 1,
    title: 'Ege Turu',
    desc: 'İzmir, Bodrum, Kuşadası rotasında deniz kenarında unutulmaz tatil',
    image: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    visited: false,
    hotel: { name: 'Blue Hotel' },
    restaurant: { name: 'Lezzet Sofrası' }
  },
  {
    id: 2,
    title: 'Karadeniz Turu',
    desc: 'Trabzon, Rize, Artvin doğa harikası yaylaları ve yaşayan kültür',
    image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' },
    visited: true,
    hotel: { name: 'City Inn' },
    restaurant: { name: 'Fish & More' }
  },
  {
    id: 3,
    title: 'Kapadokya Balon Turu',
    desc: 'Kapadokya, Göreme, Ürgüp bölgesinde sıcak hava balonu deneyimi',
    image: { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' },
    visited: false,
    hotel: { name: 'Cave Suites' },
    restaurant: { name: 'Balloon View' }
  },
  {
    id: 4,
    title: 'İstanbul Şehir Turu',
    desc: 'Tarihi Yarımada, Boğaz, Adalar kültür ve tarih dolu keşif',
    image: { uri: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80' },
    visited: true,
    hotel: { name: 'Bosphorus Hotel' },
    restaurant: { name: 'Galata Fish' }
  },
  {
    id: 5,
    title: 'Akdeniz Kıyıları',
    desc: 'Antalya, Kas, Kalkan kristal berraklığında deniz ve antik şehirler',
    image: { uri: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=800&q=80' },
    visited: false,
    hotel: { name: 'Seaside Resort' },
    restaurant: { name: 'Marina Balık' }
  },
  {
    id: 6,
    title: 'Orta Anadolu Kültür Turu',
    desc: 'Ankara, Konya, Kayseri tarih kokan şehirlerde kültürel yolculuk',
    image: { uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80' },
    visited: false,
    hotel: { name: 'Heritage Hotel' },
    restaurant: { name: 'Anadolu Mutfağı' }
  }
];

interface RecommendedRoutesProps {
  onRouteClick?: (route: Route) => void;
}

const RecommendedRoutes: React.FC<RecommendedRoutesProps> = ({ 
  onRouteClick 
}) => {
  return (
    <Section id="routes">
      <Container>
        <SectionHeader>
          <SectionTitle>Önerilen Rotalar</SectionTitle>
          <SectionSubtitle>
            Uzman ekibimiz tarafından özenle hazırlanmış rotalar ile 
            Türkiye'nin en güzel köşelerini keşfedin.
          </SectionSubtitle>
        </SectionHeader>

        <RoutesGrid>
          {recommendedRoutes.map((route) => (
            <RouteCard
              key={route.id}
              hover
              onClick={() => onRouteClick?.(route)}
            >
              <RouteImage backgroundImage={route.image.uri}>
                <StatusBadge visited={route.visited}>
                  {route.visited ? '✅ Tamamlandı' : '📍 Planlanan'}
                </StatusBadge>
              </RouteImage>
              
              <RouteContent>
                <RouteInfo>
                  <RouteTitle>{route.title}</RouteTitle>
                  <RouteDescription>{route.desc}</RouteDescription>
                  
                  <RouteDetails>
                    <DetailItem>
                      <span>🏨</span>
                      {route.hotel?.name}
                    </DetailItem>
                    <DetailItem>
                      <span>🍽️</span>
                      {route.restaurant?.name}
                    </DetailItem>
                  </RouteDetails>
                </RouteInfo>

                <RouteActions>
                  <Button 
                    variant="primary" 
                    size="small" 
                    fullWidth
                    onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                      e?.stopPropagation();
                      onRouteClick?.(route);
                    }}
                  >
                    Detayları Gör
                  </Button>
                </RouteActions>
              </RouteContent>
            </RouteCard>
          ))}
        </RoutesGrid>

        <div style={{ textAlign: 'center' }}>
          <Button variant="outline" size="large">
            Tüm Rotaları Görüntüle
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default RecommendedRoutes;
