import React from 'react';
import styled from 'styled-components';
import { colors, shadows, breakpoints } from '../../styles/GlobalStyles';
import Card from '../UI/Card';
import { Destination } from '../../types';

const Section = styled.section`
  padding: 80px 16px;
  background: ${colors.backgroundSecondary};

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

const DestinationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
  }
`;

const DestinationCard = styled(Card)`
  overflow: hidden;
  padding: 0;
  height: 300px;
  position: relative;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}) {
    height: 350px;
  }
`;

const DestinationImage = styled.div<{ backgroundImage: string }>`
  width: 100%;
  height: 100%;
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
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
  }

  ${DestinationCard}:hover & {
    transform: scale(1.05);
  }
`;

const DestinationContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  color: white;
  z-index: 2;
`;

const DestinationName = styled.h3`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 28px;
  }
`;

const DestinationInfo = styled.p`
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }
`;

const ViewAllButton = styled.button`
  display: block;
  margin: 0 auto;
  padding: 16px 32px;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${shadows.medium};

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${shadows.large};
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 18px 40px;
    font-size: 18px;
  }
`;

const popularDestinations: Destination[] = [
  {
    name: 'Kapadokya',
    image: { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' }
  },
  {
    name: 'Antalya',
    image: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' }
  },
  {
    name: 'İstanbul',
    image: { uri: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80' }
  },
  {
    name: 'Bodrum',
    image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' }
  },
  {
    name: 'Trabzon',
    image: { uri: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' }
  },
  {
    name: 'Pamukkale',
    image: { uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80' }
  }
];

interface PopularDestinationsProps {
  onDestinationClick?: (destination: Destination) => void;
}

const PopularDestinations: React.FC<PopularDestinationsProps> = ({ 
  onDestinationClick 
}) => {
  return (
    <Section id="destinations">
      <Container>
        <SectionHeader>
          <SectionTitle>Popüler Destinasyonlar</SectionTitle>
          <SectionSubtitle>
            En çok tercih edilen ve görülmeye değer destinasyonları keşfedin. 
            Her biri eşsiz deneyimler sunuyor.
          </SectionSubtitle>
        </SectionHeader>

        <DestinationsGrid>
          {popularDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.name}
              hover
              onClick={() => onDestinationClick?.(destination)}
            >
              <DestinationImage backgroundImage={destination.image.uri}>
                <DestinationContent>
                  <DestinationName>{destination.name}</DestinationName>
                  <DestinationInfo>
                    {index % 2 === 0 ? 'Doğal güzellikler' : 'Tarihi ve kültürel'}
                  </DestinationInfo>
                </DestinationContent>
              </DestinationImage>
            </DestinationCard>
          ))}
        </DestinationsGrid>

        <ViewAllButton>
          Tüm Destinasyonları Gör
        </ViewAllButton>
      </Container>
    </Section>
  );
};

export default PopularDestinations;
