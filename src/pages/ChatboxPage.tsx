import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, breakpoints } from '../styles/GlobalStyles';

const ChatboxContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
`;

const RedHeader = styled.div`
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
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
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

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: ${breakpoints.tablet}) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const MobileToggleButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
  }
`;

const MobileOverlay = styled.div<{ isVisible?: boolean }>`
  display: none;
  
  @media (max-width: ${breakpoints.tablet}) {
    display: ${props => props.isVisible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const BlueSelectionPanel = styled.div<{ isVisible?: boolean }>`
  width: 350px;
  background: linear-gradient(180deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  padding: 24px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  @media (max-width: ${breakpoints.tablet}) {
    position: fixed;
    top: 70px;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: 400px;
    padding: 16px;
    z-index: 1000;
    transform: ${props => props.isVisible ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isVisible ? '4px 0 20px rgba(0, 0, 0, 0.3)' : 'none'};
  }

  @media (max-width: 480px) {
    max-width: 100%;
    width: 85%;
    top: 60px;
  }

  /* Custom Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin: 8px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.5) 100%);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.6) 100%);
      border-color: rgba(255, 255, 255, 0.3);
    }

    &:active {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.7) 100%);
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.4) rgba(255, 255, 255, 0.1);
`;

const GreenChatbox = styled.div`
  flex: 1;
  background: ${colors.gradient};
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: ${breakpoints.tablet}) {
    height: calc(100vh - 70px);
    width: 100%;
  }

  @media (max-width: 480px) {
    height: calc(100vh - 60px);
  }
`;

// Selection Panel Components
const SelectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: white;
`;

const SelectionCategory = styled.div`
  margin-bottom: 24px;
`;

const CategoryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
`;

const SelectionItem = styled.div<{ selected?: boolean }>`
  background: ${props => props.selected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 0;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  ${props => props.selected && `
    &::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
      color: ${colors.primary};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  `}
`;

const ItemImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
`;

const ItemContent = styled.div`
  padding: 12px;
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.3;
`;

const ItemPrice = styled.div`
  font-size: 13px;
  opacity: 0.8;
  font-weight: 500;
`;

const ItemDescription = styled.div`
  font-size: 12px;
  opacity: 0.7;
  margin-top: 4px;
  line-height: 1.2;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: ${breakpoints.tablet}) {
    gap: 6px;
    margin-top: 10px;
    padding-top: 6px;
  }
`;

const ActionButton = styled.button<{ variant?: 'select' | 'details' }>`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: ${breakpoints.tablet}) {
    padding: 6px 8px;
    font-size: 11px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 6px;
    font-size: 10px;
  }
  
  ${props => props.variant === 'select' ? `
    background: rgba(34, 197, 94, 0.2);
    color: white;
    border-color: rgba(34, 197, 94, 0.4);
    
    &:hover {
      background: rgba(34, 197, 94, 0.3);
      border-color: rgba(34, 197, 94, 0.6);
    }
  ` : `
    background: rgba(59, 130, 246, 0.2);
    color: white;
    border-color: rgba(59, 130, 246, 0.4);
    
    &:hover {
      background: rgba(59, 130, 246, 0.3);
      border-color: rgba(59, 130, 246, 0.6);
    }
  `}

  &:active {
    transform: scale(0.95);
  }
`;

const CompleteButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Chatbox Components
const ChatboxHeader = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChatboxTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 18px;
  text-align: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.05);

  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 85%;
  margin-bottom: 10px;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};

  @media (min-width: ${breakpoints.tablet}) {
    max-width: 75%;
    margin-bottom: 12px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    max-width: 70%;
  }
`;

const MessageContent = styled.div<{ isUser: boolean }>`
  background: ${props => props.isUser 
    ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)` 
    : 'rgba(255, 255, 255, 0.95)'
  };
  color: ${props => props.isUser ? 'white' : colors.text};
  padding: 12px 16px;
  border-radius: 18px;
  border-top-${props => props.isUser ? 'right' : 'left'}-radius: 6px;
  font-size: 15px;
  line-height: 1.4;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isUser 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.3)'
  };
  position: relative;
  word-wrap: break-word;
  
  /* Message tail */
  &::after {
    content: '';
    position: absolute;
    ${props => props.isUser ? 'right: -6px' : 'left: -6px'};
    bottom: 8px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-${props => props.isUser ? 'left' : 'right'}-color: ${props => props.isUser 
      ? colors.primary 
      : 'rgba(255, 255, 255, 0.95)'
    };
  }
`;

const MessageTime = styled.div<{ isUser: boolean }>`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  text-align: ${props => props.isUser ? 'right' : 'left'};
  margin-top: 4px;
  margin-${props => props.isUser ? 'right' : 'left'}: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 8px 16px;
  margin: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: ${breakpoints.tablet}) {
    margin: 12px;
    padding: 6px 12px;
    gap: 8px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    margin: 8px;
    padding: 4px 8px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 8px 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${props => props.disabled 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.8)'
  };
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.5)' : colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
    background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.2)' : 'white'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  border-top-left-radius: 6px;
  max-width: 80px;
  margin-bottom: 12px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  /* Typing indicator tail */
  &::after {
    content: '';
    position: absolute;
    left: -6px;
    bottom: 8px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-right-color: rgba(255, 255, 255, 0.95);
  }
`;

const TypingDot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  background: ${colors.textSecondary};
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;

  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// Data Types
interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SelectionItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  image: string;
  images?: string[]; // Added for carousel
  rating?: number; // Added for rating
  reviews?: string[]; // Added for reviews
  openingHours?: string; // Added for opening hours
  phone?: string; // Added for phone
  website?: string; // Added for website
  address?: string; // Added for address
  amenities?: string[]; // Added for amenities
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

const ChatboxPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Merhaba! Ben seyahat planlama asistanınız. Size en uygun seyahat planını oluşturmak için birkaç soru sormak istiyorum. Nereye gitmek istiyorsunuz? 🌍',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selections, setSelections] = useState<Selections>({
    hotel: null,
    restaurant: null,
    activity: null,
    transport: null
  });
  
  // Add missing state variables
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const [conversationStep, setConversationStep] = useState<'destination' | 'budget' | 'duration' | 'interests' | 'accommodation' | 'food' | 'transport' | 'travelStyle' | 'complete'>('destination');
  
  // Mobile panel visibility state
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  // Business details modal state
  const [selectedBusiness, setSelectedBusiness] = useState<SelectionItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle returning from selection page for new options
  useEffect(() => {
    if (location.state?.requestNewOptions) {
      const botMessage: Message = {
        id: Date.now(),
        text: 'Anladım! Mevcut seçeneklerden memnun değilsiniz. Size yeni seçenekler sunayım. Hangi konuda daha spesifik olmak istiyorsunuz?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Reset conversation to gather more specific preferences
      setConversationStep('destination');
      setUserPreferences(location.state.preferences || {});
    }
  }, [location.state]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sample data with images
  const sampleData = {
    hotels: [
      { 
        id: 'h1', 
        name: 'Grand Palace Hotel', 
        price: '₺2,500/gece', 
        description: '5 yıldızlı lüks otel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Sultanahmet Mahallesi, Ayasofya Caddesi No:15, Fatih/İstanbul',
        phone: '+90 212 555 0123',
        website: 'www.grandpalacehotel.com',
        rating: 4.8,
        amenities: ['WiFi', 'Havuz', 'Spa', 'Restoran', 'Bar', 'Otopark', '24/7 Resepsiyon'],
        openingHours: 'Check-in: 14:00, Check-out: 11:00',
        reviews: [
          'Muhteşem manzara ve mükemmel hizmet!',
          'Çok temiz ve konforlu odalar.',
          'Personel çok ilgili ve yardımsever.'
        ]
      },
      { 
        id: 'h2', 
        name: 'City Center Hotel', 
        price: '₺1,200/gece', 
        description: '4 yıldızlı şehir merkezi',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Beyoğlu Mahallesi, İstiklal Caddesi No:45, Beyoğlu/İstanbul',
        phone: '+90 212 555 0456',
        website: 'www.citycenterhotel.com',
        rating: 4.2,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark', 'Resepsiyon'],
        openingHours: 'Check-in: 15:00, Check-out: 12:00',
        reviews: [
          'Şehir merkezinde ideal konum.',
          'Fiyat-performans oranı iyi.',
          'Temiz ve düzenli.'
        ]
      },
      { 
        id: 'h3', 
        name: 'Budget Inn', 
        price: '₺600/gece', 
        description: '3 yıldızlı ekonomik',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Kadıköy Mahallesi, Moda Caddesi No:78, Kadıköy/İstanbul',
        phone: '+90 216 555 0789',
        website: 'www.budgetinn.com',
        rating: 3.8,
        amenities: ['WiFi', 'Ortak Mutfak', 'Çamaşırhane', 'Resepsiyon'],
        openingHours: 'Check-in: 13:00, Check-out: 10:00',
        reviews: [
          'Ekonomik fiyat, temiz oda.',
          'Genç gezginler için ideal.',
          'Basit ama işlevsel.'
        ]
      },
    ],
    restaurants: [
      { 
        id: 'r1', 
        name: 'Sunset Restaurant', 
        price: '₺200/kişi', 
        description: 'Deniz manzaralı restoran',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Bodrum Mahallesi, Yalı Caddesi No:10, Bodrum/Muğla',
        phone: '+90 212 555 0456',
        website: 'www.sunsetrestaurant.com',
        rating: 4.5,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 10:00, Check-out: 22:00',
        reviews: [
          'Çok lezzetli yemekler, harika manzara!',
          'Personel çok ilgili ve hizmet veriyor.',
          'Fiyat-performans oranı iyi.'
        ]
      },
      { 
        id: 'r2', 
        name: 'Local Taste', 
        price: '₺120/kişi', 
        description: 'Yerel lezzetler',
        image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Kadıköy Mahallesi, Moda Caddesi No:15, Kadıköy/İstanbul',
        phone: '+90 216 555 0123',
        website: 'www.localtaste.com',
        rating: 4.0,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 10:00, Check-out: 22:00',
        reviews: [
          'Yerel lezzetleri denemek için harika bir yer.',
          'Fiyat-performans oranı iyi.',
          'Personel çok ilgili.'
        ]
      },
      { 
        id: 'r3', 
        name: 'Fast Food Corner', 
        price: '₺60/kişi', 
        description: 'Hızlı servis',
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Beyoğlu Mahallesi, İstiklal Caddesi No:20, Beyoğlu/İstanbul',
        phone: '+90 212 555 0789',
        website: 'www.fastfoodcorner.com',
        rating: 3.9,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 08:00, Check-out: 20:00',
        reviews: [
          'Hızlı ve ucuz bir yer.',
          'Çok iyi bir hizmet.',
          'Personel çok ilgili.'
        ]
      },
    ],
    activities: [
      { 
        id: 'a1', 
        name: 'Şehir Turu', 
        price: '₺150/kişi', 
        description: 'Rehberli şehir gezisi',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Sultanahmet Mahallesi, Ayasofya Caddesi No:5, Fatih/İstanbul',
        phone: '+90 212 555 0123',
        website: 'www.sehirturu.com',
        rating: 4.7,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 09:00, Check-out: 18:00',
        reviews: [
          'Çok eğlenceli bir gezi.',
          'Rehber çok bilgili ve yardımcı oldu.',
          'Fiyat-performans oranı iyi.'
        ]
      },
      { 
        id: 'a2', 
        name: 'Müze Ziyareti', 
        price: '₺80/kişi', 
        description: 'Tarihi müzeler',
        image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Beyoğlu Mahallesi, İstiklal Caddesi No:10, Beyoğlu/İstanbul',
        phone: '+90 212 555 0456',
        website: 'www.muzeziyareti.com',
        rating: 4.2,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 09:00, Check-out: 18:00',
        reviews: [
          'Tarihi müzeleri ziyaret etmek için harika bir yer.',
          'Fiyat-performans oranı iyi.',
          'Personel çok ilgili.'
        ]
      },
      { 
        id: 'a3', 
        name: 'Tekne Turu', 
        price: '₺300/kişi', 
        description: 'Boğaz turu',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Bodrum Mahallesi, Yalı Caddesi No:20, Bodrum/Muğla',
        phone: '+90 212 555 0789',
        website: 'www.tekneturu.com',
        rating: 4.6,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 08:00, Check-out: 18:00',
        reviews: [
          'Boğaz turu çok eğlenceli.',
          'Tekne çok temiz ve konforlu.',
          'Personel çok ilgili.'
        ]
      },
    ],
    transport: [
      { 
        id: 't1', 
        name: 'Özel Araç', 
        price: '₺800/gün', 
        description: 'Şoförlü araç',
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Sultanahmet Mahallesi, Ayasofya Caddesi No:10, Fatih/İstanbul',
        phone: '+90 212 555 0123',
        website: 'www.ozelarac.com',
        rating: 4.9,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 07:00, Check-out: 20:00',
        reviews: [
          'Çok hızlı ve güvenli bir ulaşım.',
          'Şoför çok bilgili ve yardımcı oldu.',
          'Fiyat-performans oranı iyi.'
        ]
      },
      { 
        id: 't2', 
        name: 'Taksi', 
        price: '₺200/mesafe', 
        description: 'Taksi hizmeti',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Beyoğlu Mahallesi, İstiklal Caddesi No:15, Beyoğlu/İstanbul',
        phone: '+90 212 555 0456',
        website: 'www.taksi.com',
        rating: 4.1,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 00:00, Check-out: 24:00',
        reviews: [
          'Hızlı ve güvenli bir ulaşım.',
          'Fiyat-performans oranı iyi.',
          'Personel çok ilgili.'
        ]
      },
      { 
        id: 't3', 
        name: 'Toplu Taşıma', 
        price: '₺50/gün', 
        description: 'Otobüs-metro',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300&h=200&fit=crop&crop=center',
        images: [
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop&crop=center',
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop&crop=center'
        ],
        address: 'Kadıköy Mahallesi, Moda Caddesi No:10, Kadıköy/İstanbul',
        phone: '+90 216 555 0789',
        website: 'www.toplutaşıma.com',
        rating: 4.0,
        amenities: ['WiFi', 'Restoran', 'Bar', 'Otopark'],
        openingHours: 'Check-in: 05:00, Check-out: 23:00',
        reviews: [
          'Otobüs-metro çok iyi bir ulaşım.',
          'Fiyat-performans oranı iyi.',
          'Personel çok ilgili.'
        ]
      },
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // URL'den query parametresini al
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('q');
    
    if (queryParam) {
      setTimeout(() => {
        handleSendMessage(queryParam);
      }, 1000);
    }
  }, [location.search]);

  const handleSelectionChange = (category: keyof Selections, item: SelectionItem) => {
    setSelections(prev => ({
      ...prev,
      [category]: item // Aynı kategoriden başka seçenek seçilirse eskisi otomatik iptal olur
    }));

    // Mobilde panel seçim sonrası kapansın
    if (window.innerWidth <= 768) {
      setIsPanelVisible(false);
    }

    // Seçim değişikliğini chatbox'a bildir
    const categoryNames = {
      hotel: 'Otel',
      restaurant: 'Restoran', 
      activity: 'Aktivite',
      transport: 'Ulaşım'
    };

    const botMessage: Message = {
      id: Date.now(),
      text: `${categoryNames[category]} seçildi: ${item.name} (${item.price})`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleShowDetails = (item: SelectionItem, category: string) => {
    setSelectedBusiness(item);
    setIsDetailsModalOpen(true);
  };

  const handleCompleteSelection = () => {
    const selectedCount = Object.values(selections).filter(Boolean).length;
    if (selectedCount === 0) {
      alert('Lütfen en az bir seçim yapın!');
      return;
    }

    // Başarı mesajı göster
    const botMessage: Message = {
      id: Date.now(),
      text: `🎉 Harika! ${selectedCount} öğe seçtiniz. Rotalarım sayfasına yönlendiriliyorsunuz...`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);

    // 2 saniye bekle ve yönlendir
    setTimeout(() => {
      navigate('/routes', { state: { selections } });
    }, 2000);
  };

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const newMessage: Message = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  // Intelligent conversation flow functions
  const getNextQuestion = (): string => {
    switch (conversationStep) {
      case 'destination':
        return 'Nereye gitmek istiyorsunuz? (Örn: İstanbul, Kapadokya, Antalya)';
      case 'budget':
        return 'Bütçeniz nasıl? (Ekonomik / Orta / Lüks)';
      case 'duration':
        return 'Kaç günlük bir seyahat planlıyorsunuz?';
      case 'interests':
        return 'Hangi aktiviteleri tercih edersiniz? (Kültür, Doğa, Deniz, Şehir hayatı)';
      case 'accommodation':
        return 'Konaklama tercihiniz nedir? (Otel, Villa, Hostel, Camping)';
      case 'food':
        return 'Yemek tercihleriniz neler? (Geleneksel, Modern, Fast food, Vegetarian)';
      case 'transport':
        return 'Ulaşım tercihiniz nedir? (Uçak, Otobüs, Tren, Araba)';
      case 'travelStyle':
        return 'Seyahat tarzınız nasıl? (Macera, Rahat, Kültür odaklı, Ekonomik)';
      default:
        return 'Başka bir detay eklemek ister misiniz?';
    }
  };

  const getSuggestionsForStep = (): string[] => {
    switch (conversationStep) {
      case 'destination':
        return ['İstanbul', 'Kapadokya', 'Antalya', 'Bodrum', 'Trabzon'];
      case 'budget':
        return ['Ekonomik', 'Orta', 'Lüks'];
      case 'duration':
        return ['1-3 gün', '4-7 gün', '1-2 hafta', '1 ay+'];
      case 'interests':
        return ['Kültür', 'Doğa', 'Deniz', 'Şehir hayatı', 'Macera'];
      case 'accommodation':
        return ['Otel', 'Villa', 'Hostel', 'Camping'];
      case 'food':
        return ['Geleneksel', 'Modern', 'Fast food', 'Vegetarian'];
      case 'transport':
        return ['Uçak', 'Otobüs', 'Tren', 'Araba'];
      case 'travelStyle':
        return ['Macera', 'Rahat', 'Kültür odaklı', 'Ekonomik'];
      default:
        return [];
    }
  };

  const processUserInput = (userMessage: string) => {
    const message = userMessage.toLowerCase();
    
    // Update preferences based on conversation step
    switch (conversationStep) {
      case 'destination':
        setUserPreferences(prev => ({ ...prev, destination: userMessage }));
        setConversationStep('budget');
        break;
      case 'budget':
        if (message.includes('ekonomik')) {
          setUserPreferences(prev => ({ ...prev, budget: 'low' }));
        } else if (message.includes('orta')) {
          setUserPreferences(prev => ({ ...prev, budget: 'medium' }));
        } else if (message.includes('lüks')) {
          setUserPreferences(prev => ({ ...prev, budget: 'high' }));
        } else {
          setUserPreferences(prev => ({ ...prev, budget: userMessage }));
        }
        setConversationStep('duration');
        break;
      case 'duration':
        setUserPreferences(prev => ({ ...prev, duration: userMessage }));
        setConversationStep('interests');
        break;
      case 'interests':
        const interests = userMessage.split(',').map(i => i.trim());
        setUserPreferences(prev => ({ ...prev, interests }));
        setConversationStep('accommodation');
        break;
      case 'accommodation':
        setUserPreferences(prev => ({ ...prev, accommodation: userMessage }));
        setConversationStep('food');
        break;
      case 'food':
        setUserPreferences(prev => ({ ...prev, food: userMessage }));
        setConversationStep('transport');
        break;
      case 'transport':
        setUserPreferences(prev => ({ ...prev, transport: userMessage }));
        setConversationStep('travelStyle');
        break;
      case 'travelStyle':
        setUserPreferences(prev => ({ ...prev, travelStyle: userMessage }));
        setConversationStep('complete');
        break;
      default:
        break;
    }

    // Check if we have enough information to proceed to selection
    if (conversationStep === 'complete' || 
        (userPreferences.destination && userPreferences.budget && userPreferences.duration)) {
      
      const botMessage: Message = {
        id: Date.now(),
        text: 'Mükemmel! Tercihlerinizi aldım. Şimdi size uygun seçenekleri sunayım. Seçim ekranına yönlendiriliyorsunuz...',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      setTimeout(() => {
        navigate('/selection', { state: { preferences: userPreferences } });
      }, 2000);
    } else {
      // Ask next question
      const nextQuestion = getNextQuestion();
      const botMessage: Message = {
        id: Date.now(),
        text: nextQuestion,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    // Process user input for conversation flow
    processUserInput(userMessage);
    
    // Return immediate response based on current step
    const selectedCount = Object.values(selections).filter(Boolean).length;
    
    if (selectedCount > 0) {
      return `Harika! ${selectedCount} seçim yaptınız. Bu seçimler hakkında daha fazla bilgi verebilirim. Başka neleri merak ediyorsunuz?`;
    }
    
    // Return contextual response based on conversation step
    switch (conversationStep) {
      case 'destination':
        return 'Harika bir destinasyon seçimi! Şimdi bütçenizi öğrenelim.';
      case 'budget':
        return 'Bütçe bilgisi alındı. Seyahat sürenizi belirtelim.';
      case 'duration':
        return 'Süre bilgisi alındı. İlgi alanlarınızı öğrenelim.';
      case 'interests':
        return 'İlgi alanlarınız kaydedildi. Konaklama tercihinizi belirtelim.';
      case 'accommodation':
        return 'Konaklama tercihi alındı. Yemek tercihlerinizi öğrenelim.';
      case 'food':
        return 'Yemek tercihleri kaydedildi. Ulaşım tercihinizi belirtelim.';
      case 'transport':
        return 'Ulaşım tercihi alındı. Son olarak seyahat tarzınızı öğrenelim.';
      case 'travelStyle':
        return 'Mükemmel! Tüm tercihlerinizi aldım. Size uygun seçenekleri hazırlıyorum...';
      default:
        return 'Tercihlerinizi toplamaya devam edelim.';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <ChatboxContainer>
      {/* Red Header */}
      <RedHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MobileToggleButton onClick={() => setIsPanelVisible(!isPanelVisible)}>
            {isPanelVisible ? '✕' : '☰'} Seçenekler
          </MobileToggleButton>
          <HeaderTitle>🧳 Seyahat Planlama Asistanı</HeaderTitle>
        </div>
        <BackButton onClick={() => navigate('/')}>
          ← Ana Sayfa
        </BackButton>
      </RedHeader>

      {/* Mobile Overlay */}
      <MobileOverlay 
        isVisible={isPanelVisible} 
        onClick={() => setIsPanelVisible(false)} 
      />

      {/* Main Content */}
      <MainContent>
        {/* Blue Selection Panel */}
        <BlueSelectionPanel isVisible={isPanelVisible}>
          <SelectionTitle>Seçimlerinizi Yapın</SelectionTitle>
          
          {/* Hotels */}
          <SelectionCategory>
            <CategoryTitle>🏨 Oteller</CategoryTitle>
            {sampleData.hotels.map(hotel => (
              <SelectionItem
                key={hotel.id}
                selected={selections.hotel?.id === hotel.id}
              >
                <ItemImage src={hotel.image} alt={hotel.name} />
                <ItemContent>
                  <ItemName>{hotel.name}</ItemName>
                  <ItemPrice>{hotel.price}</ItemPrice>
                  <ItemDescription>{hotel.description}</ItemDescription>
                  <ItemActions>
                    <ActionButton 
                      variant="select" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectionChange('hotel', hotel);
                      }}
                    >
                      ✓ Seç
                    </ActionButton>
                    <ActionButton 
                      variant="details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(hotel, 'hotel');
                      }}
                    >
                      🔍 Detayları Görüntüle
                    </ActionButton>
                  </ItemActions>
                </ItemContent>
              </SelectionItem>
            ))}
          </SelectionCategory>

          {/* Restaurants */}
          <SelectionCategory>
            <CategoryTitle>🍽️ Restoranlar</CategoryTitle>
            {sampleData.restaurants.map(restaurant => (
              <SelectionItem
                key={restaurant.id}
                selected={selections.restaurant?.id === restaurant.id}
              >
                <ItemImage src={restaurant.image} alt={restaurant.name} />
                <ItemContent>
                  <ItemName>{restaurant.name}</ItemName>
                  <ItemPrice>{restaurant.price}</ItemPrice>
                  <ItemDescription>{restaurant.description}</ItemDescription>
                  <ItemActions>
                    <ActionButton 
                      variant="select" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectionChange('restaurant', restaurant);
                      }}
                    >
                      ✓ Seç
                    </ActionButton>
                    <ActionButton 
                      variant="details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(restaurant, 'restaurant');
                      }}
                    >
                      🔍 Detayları Görüntüle
                    </ActionButton>
                  </ItemActions>
                </ItemContent>
              </SelectionItem>
            ))}
          </SelectionCategory>

          {/* Activities */}
          <SelectionCategory>
            <CategoryTitle>🎯 Aktiviteler</CategoryTitle>
            {sampleData.activities.map(activity => (
              <SelectionItem
                key={activity.id}
                selected={selections.activity?.id === activity.id}
              >
                <ItemImage src={activity.image} alt={activity.name} />
                <ItemContent>
                  <ItemName>{activity.name}</ItemName>
                  <ItemPrice>{activity.price}</ItemPrice>
                  <ItemDescription>{activity.description}</ItemDescription>
                  <ItemActions>
                    <ActionButton 
                      variant="select" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectionChange('activity', activity);
                      }}
                    >
                      ✓ Seç
                    </ActionButton>
                    <ActionButton 
                      variant="details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(activity, 'activity');
                      }}
                    >
                      🔍 Detayları Görüntüle
                    </ActionButton>
                  </ItemActions>
                </ItemContent>
              </SelectionItem>
            ))}
          </SelectionCategory>

          {/* Transport */}
          <SelectionCategory>
            <CategoryTitle>🚗 Ulaşım</CategoryTitle>
            {sampleData.transport.map(transport => (
              <SelectionItem
                key={transport.id}
                selected={selections.transport?.id === transport.id}
              >
                <ItemImage src={transport.image} alt={transport.name} />
                <ItemContent>
                  <ItemName>{transport.name}</ItemName>
                  <ItemPrice>{transport.price}</ItemPrice>
                  <ItemDescription>{transport.description}</ItemDescription>
                  <ItemActions>
                    <ActionButton 
                      variant="select" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectionChange('transport', transport);
                      }}
                    >
                      ✓ Seç
                    </ActionButton>
                    <ActionButton 
                      variant="details"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(transport, 'transport');
                      }}
                    >
                      🔍 Detayları Görüntüle
                    </ActionButton>
                  </ItemActions>
                </ItemContent>
              </SelectionItem>
            ))}
          </SelectionCategory>

          <CompleteButton 
            onClick={handleCompleteSelection}
            disabled={Object.values(selections).every(s => !s)}
          >
            ✅ Seçimleri Tamamla
          </CompleteButton>
        </BlueSelectionPanel>

        {/* Green Chatbox */}
        <GreenChatbox>
          <ChatboxHeader>
            <ChatboxTitle>💬 Sohbet Asistanı</ChatboxTitle>
          </ChatboxHeader>

          <MessagesContainer>
            {messages.map((message) => (
              <MessageBubble key={message.id} isUser={message.isUser}>
                <MessageContent isUser={message.isUser}>
                  {message.text}
                </MessageContent>
                <MessageTime isUser={message.isUser}>
                  {formatTime(message.timestamp)}
                </MessageTime>
              </MessageBubble>
            ))}
            
            {isTyping && (
              <MessageBubble isUser={false}>
                <TypingIndicator>
                  <TypingDot delay={0} />
                  <TypingDot delay={0.2} />
                  <TypingDot delay={0.4} />
                </TypingIndicator>
              </MessageBubble>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <MessageInput
              type="text"
              placeholder="Mesajınızı yazın..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SendButton 
              onClick={() => handleSendMessage()} 
              disabled={!inputValue.trim()}
            >
              ➤
            </SendButton>
          </InputContainer>
        </GreenChatbox>

        {/* Business Details Modal */}
        {isDetailsModalOpen && selectedBusiness && (
          <BusinessDetailsModal
            business={selectedBusiness}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedBusiness(null);
            }}
          />
        )}
      </MainContent>
    </ChatboxContainer>
  );
};

// Business Details Modal Component
const BusinessDetailsModal: React.FC<{
  business: SelectionItem;
  onClose: () => void;
}> = ({ business, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'reviews'>('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (business.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (business.images?.length || 1) - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{business.name}</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        {/* Image Carousel */}
        <ImageCarouselContainer>
          <CarouselImage 
            src={business.images?.[currentImageIndex] || business.image} 
            alt={`${business.name} - Fotoğraf ${currentImageIndex + 1}`} 
          />
          
          {/* Navigation Arrows */}
          {business.images && business.images.length > 1 && (
            <>
              <CarouselArrow 
                direction="left" 
                onClick={prevImage}
                aria-label="Önceki fotoğraf"
              >
                ‹
              </CarouselArrow>
              <CarouselArrow 
                direction="right" 
                onClick={nextImage}
                aria-label="Sonraki fotoğraf"
              >
                ›
              </CarouselArrow>
            </>
          )}

          {/* Image Indicators */}
          {business.images && business.images.length > 1 && (
            <ImageIndicators>
              {business.images.map((_, index) => (
                <ImageIndicator 
                  key={index}
                  active={index === currentImageIndex}
                  onClick={() => goToImage(index)}
                  aria-label={`Fotoğraf ${index + 1}`}
                />
              ))}
            </ImageIndicators>
          )}

          {/* Image Counter */}
          {business.images && business.images.length > 1 && (
            <ImageCounter>
              {currentImageIndex + 1} / {business.images.length}
            </ImageCounter>
          )}
        </ImageCarouselContainer>
        
        <ModalTabs>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Genel Bakış
          </TabButton>
          <TabButton 
            active={activeTab === 'amenities'} 
            onClick={() => setActiveTab('amenities')}
          >
            Özellikler
          </TabButton>
          <TabButton 
            active={activeTab === 'reviews'} 
            onClick={() => setActiveTab('reviews')}
          >
            Yorumlar
          </TabButton>
        </ModalTabs>

        <ModalBody>
          {activeTab === 'overview' && (
            <OverviewTab business={business} />
          )}
          {activeTab === 'amenities' && (
            <AmenitiesTab business={business} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab business={business} />
          )}
        </ModalBody>

        <ModalFooter>
          <ActionButton variant="select" onClick={onClose}>
            Kapat
          </ActionButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// Tab Components
const OverviewTab: React.FC<{ business: SelectionItem }> = ({ business }) => (
  <TabContent>
    <InfoSection>
      <InfoTitle>📍 Adres</InfoTitle>
      <InfoText>{business.address || 'Adres bilgisi mevcut değil'}</InfoText>
    </InfoSection>
    
    <InfoSection>
      <InfoTitle>📞 İletişim</InfoTitle>
      <InfoText>
        <strong>Telefon:</strong> {business.phone || 'Telefon bilgisi mevcut değil'}<br />
        <strong>Website:</strong> {business.website ? (
          <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer">
            {business.website}
          </a>
        ) : 'Website bilgisi mevcut değil'}
      </InfoText>
    </InfoSection>

    <InfoSection>
      <InfoTitle>⭐ Değerlendirme</InfoTitle>
      <RatingContainer>
        <Stars rating={business.rating || 0} />
        <RatingText>{business.rating || 'N/A'}/5.0</RatingText>
      </RatingContainer>
    </InfoSection>

    <InfoSection>
      <InfoTitle>⏰ Çalışma Saatları</InfoTitle>
      <InfoText>{business.openingHours || 'Çalışma saati bilgisi mevcut değil'}</InfoText>
    </InfoSection>

    <InfoSection>
      <InfoTitle>💰 Fiyat</InfoTitle>
      <PriceText>{business.price}</PriceText>
    </InfoSection>

    <InfoSection>
      <InfoTitle>📝 Açıklama</InfoTitle>
      <InfoText>{business.description || 'Açıklama bilgisi mevcut değil'}</InfoText>
    </InfoSection>
  </TabContent>
);

const AmenitiesTab: React.FC<{ business: SelectionItem }> = ({ business }) => (
  <TabContent>
    <InfoSection>
      <InfoTitle>✨ Özellikler</InfoTitle>
      {business.amenities && business.amenities.length > 0 ? (
        <AmenitiesGrid>
          {business.amenities.map((amenity, index) => (
            <AmenityItem key={index}>
              <AmenityIcon>✓</AmenityIcon>
              {amenity}
            </AmenityItem>
          ))}
        </AmenitiesGrid>
      ) : (
        <InfoText>Özellik bilgisi mevcut değil</InfoText>
      )}
    </InfoSection>
  </TabContent>
);

const ReviewsTab: React.FC<{ business: SelectionItem }> = ({ business }) => (
  <TabContent>
    <InfoSection>
      <InfoTitle>💬 Müşteri Yorumları</InfoTitle>
      {business.reviews && business.reviews.length > 0 ? (
        <ReviewsList>
          {business.reviews.map((review, index) => (
            <ReviewItem key={index}>
              <ReviewText>"{review}"</ReviewText>
              <ReviewAuthor>- Müşteri {index + 1}</ReviewAuthor>
            </ReviewItem>
          ))}
        </ReviewsList>
      ) : (
        <InfoText>Henüz yorum bulunmuyor</InfoText>
      )}
    </InfoSection>
  </TabContent>
);

// Stars Component
const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <StarsContainer>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`}>★</Star>
      ))}
      {hasHalfStar && <Star>☆</Star>}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`}>☆</Star>
      ))}
    </StarsContainer>
  );
};

// Modal Styled Components
const ModalOverlay = styled.div`
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
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
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

// Image Carousel Components
const ImageCarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 0;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const CarouselArrow = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 16px' : 'right: 16px'};
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

const ImageIndicators = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const ImageIndicator = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  background: ${props => props.active ? 'white' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  &:hover {
    background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
    transform: scale(1.2);
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 10;
  backdrop-filter: blur(10px);
`;

const ModalTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 16px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? colors.primary : '#6b7280'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid ${props => props.active ? colors.primary : 'transparent'};

  &:hover {
    background: ${props => props.active ? 'white' : '#f3f4f6'};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  min-height: 300px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
`;

const TabContent = styled.div`
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const InfoSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;

  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  color: #fbbf24;
  font-size: 20px;
`;

const RatingText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${colors.text};
`;

const PriceText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.primary};
`;

const AmenitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

const AmenityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 14px;
  color: ${colors.text};
`;

const AmenityIcon = styled.span`
  color: #10b981;
  font-weight: bold;
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewItem = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid ${colors.primary};
`;

const ReviewText = styled.div`
  font-size: 14px;
  color: ${colors.text};
  font-style: italic;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const ReviewAuthor = styled.div`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

export default ChatboxPage;
