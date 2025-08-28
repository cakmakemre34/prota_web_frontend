import React from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../../styles/GlobalStyles';
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
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: ${breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
  }
`;

const DestinationCard = styled(Card)`
  overflow: hidden;
  padding: 0;
  height: 280px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  @media (min-width: ${breakpoints.tablet}) {
    height: 320px;
  }
`;

const DestinationImage = styled.div<{ backgroundImage: string }>`
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
      rgba(0, 0, 0, 0.4) 100%
    );
  }

  ${DestinationCard}:hover & {
    transform: scale(1.05);
  }

  @media (min-width: ${breakpoints.tablet}) {
    height: 240px;
  }
`;

const DestinationContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 20px;
  }
`;

const DestinationName = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.text};
  margin-bottom: 8px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 20px;
  }
`;

const DestinationIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 28px;
  }
`;

const popularDestinations: (Destination & { icon: string })[] = [
  {
    name: 'Kapadokya',
    image: { uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' },
    icon: '🎈'
  },
  {
    name: 'Antalya',
    image: { uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    icon: '🏖️'
  },
  {
    name: 'İstanbul',
    image: { uri: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80' },
    icon: '🕌'
  },
  {
    name: 'Bodrum',
    image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' },
    icon: '⛵'
  },
  {
    name: 'Pamukkale',
    image: { uri: 'https://images.unsplash.com/photo-1544461559-7ad1e81b02ba?auto=format&fit=crop&w=800&q=80' },
    icon: '🏛️'
  },
  {
    name: 'Trabzon',
    image: { uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80' },
    icon: '🌲'
  },
  {
    name: 'Fethiye',
    image: { uri: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0d67e?auto=format&fit=crop&w=800&q=80' },
    icon: '🏝️'
  },
  {
    name: 'Konya',
    image: { uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80' },
    icon: '🕌'
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
            Türkiye'nin en çok tercih edilen tatil noktalarını keşfedin 
            ve unutulmaz anılar biriktirin.
          </SectionSubtitle>
        </SectionHeader>

        <DestinationsGrid>
          {popularDestinations.map((destination, index) => (
            <DestinationCard
              key={index}
              hover
              onClick={() => onDestinationClick?.(destination)}
            >
              <DestinationImage backgroundImage={destination.image.uri} />
              
              <DestinationContent>
                <DestinationIcon>{destination.icon}</DestinationIcon>
                <DestinationName>{destination.name}</DestinationName>
              </DestinationContent>
            </DestinationCard>
          ))}
        </DestinationsGrid>
      </Container>
    </Section>
  );
};

export default PopularDestinations;
