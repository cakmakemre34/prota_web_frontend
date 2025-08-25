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
  display: flex;
  overflow: hidden;
`;

const BlueSelectionPanel = styled.div`
  width: 350px;
  background: linear-gradient(180deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: white;
  padding: 24px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);

  @media (max-width: ${breakpoints.tablet}) {
    width: 300px;
    padding: 16px;
  }
`;

const GreenChatbox = styled.div`
  flex: 1;
  background: ${colors.gradient};
  display: flex;
  flex-direction: column;
  position: relative;
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
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ItemName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-size: 14px;
  opacity: 0.8;
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
}

interface Selections {
  hotel: SelectionItem | null;
  restaurant: SelectionItem | null;
  activity: SelectionItem | null;
  transport: SelectionItem | null;
}

const ChatboxPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Merhaba! Seyahat planınız için seçimlerinizi yapalım. Sol panelden tercihlerinizi seçin ve benimle konuşarak planınızı detaylandıralım! 🌍',
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample data
  const sampleData = {
    hotels: [
      { id: 'h1', name: 'Grand Palace Hotel', price: '₺2,500/gece', description: '5 yıldızlı lüks otel' },
      { id: 'h2', name: 'City Center Hotel', price: '₺1,200/gece', description: '4 yıldızlı şehir merkezi' },
      { id: 'h3', name: 'Budget Inn', price: '₺600/gece', description: '3 yıldızlı ekonomik' },
    ],
    restaurants: [
      { id: 'r1', name: 'Sunset Restaurant', price: '₺200/kişi', description: 'Deniz manzaralı restoran' },
      { id: 'r2', name: 'Local Taste', price: '₺120/kişi', description: 'Yerel lezzetler' },
      { id: 'r3', name: 'Fast Food Corner', price: '₺60/kişi', description: 'Hızlı servis' },
    ],
    activities: [
      { id: 'a1', name: 'Şehir Turu', price: '₺150/kişi', description: 'Rehberli şehir gezisi' },
      { id: 'a2', name: 'Müze Ziyareti', price: '₺80/kişi', description: 'Tarihi müzeler' },
      { id: 'a3', name: 'Tekne Turu', price: '₺300/kişi', description: 'Boğaz turu' },
    ],
    transport: [
      { id: 't1', name: 'Özel Araç', price: '₺800/gün', description: 'Şoförlü araç' },
      { id: 't2', name: 'Taksi', price: '₺200/mesafe', description: 'Taksi hizmeti' },
      { id: 't3', name: 'Toplu Taşıma', price: '₺50/gün', description: 'Otobüs-metro' },
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
      [category]: prev[category]?.id === item.id ? null : item
    }));

    // Seçim değişikliğini chatbox'a bildir
    const categoryNames = {
      hotel: 'Otel',
      restaurant: 'Restoran', 
      activity: 'Aktivite',
      transport: 'Ulaşım'
    };

    const botMessage: Message = {
      id: Date.now(),
      text: `${categoryNames[category]} seçiminiz güncellendi: ${item.name} (${item.price})`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  const handleCompleteSelection = () => {
    const selectedCount = Object.values(selections).filter(Boolean).length;
    if (selectedCount === 0) {
      alert('Lütfen en az bir seçim yapın!');
      return;
    }

    // Rotalarım sayfasına yönlendir (şimdilik alert)
    alert(`Seçimleriniz tamamlandı! ${selectedCount} öğe seçildi. Rotalarım sayfasına yönlendiriliyorsunuz...`);
    navigate('/', { state: { selections } });
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

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const selectedCount = Object.values(selections).filter(Boolean).length;
    
    if (selectedCount > 0) {
      return `Harika! ${selectedCount} seçim yaptınız. Bu seçimler hakkında daha fazla bilgi verebilirim. Başka neleri merak ediyorsunuz?`;
    }
    
    if (message.includes('otel') || message.includes('konaklama')) {
      return 'Sol panelden otel seçeneklerini inceleyebilirsiniz. Bütçenize ve ihtiyaçlarınıza uygun seçenekler var!';
    } else if (message.includes('restoran') || message.includes('yemek')) {
      return 'Restoran seçenekleri sol panelde mevcut. Hangi tür mutfağı tercih edersiniz?';
    } else if (message.includes('aktivite') || message.includes('gezi')) {
      return 'Çeşitli aktivite seçenekleri var! Sol panelden hangisi ilginizi çekiyor bakabilirsiniz.';
    } else if (message.includes('ulaşım') || message.includes('transport')) {
      return 'Ulaşım seçeneklerini sol panelden görebilirsiniz. Konforunuza ve bütçenize göre seçim yapabilirsiniz.';
    } else {
      return 'Sol panelden tercihlerinizi seçin ve seyahat planınızı oluşturalım! Size nasıl yardımcı olabilirim?';
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
        <HeaderTitle>🧳 Seyahat Planlama Asistanı</HeaderTitle>
        <BackButton onClick={() => navigate('/')}>
          ← Ana Sayfa
        </BackButton>
      </RedHeader>

      {/* Main Content */}
      <MainContent>
        {/* Blue Selection Panel */}
        <BlueSelectionPanel>
          <SelectionTitle>Seçimlerinizi Yapın</SelectionTitle>
          
          {/* Hotels */}
          <SelectionCategory>
            <CategoryTitle>🏨 Oteller</CategoryTitle>
            {sampleData.hotels.map(hotel => (
              <SelectionItem
                key={hotel.id}
                selected={selections.hotel?.id === hotel.id}
                onClick={() => handleSelectionChange('hotel', hotel)}
              >
                <ItemName>{hotel.name}</ItemName>
                <ItemPrice>{hotel.price}</ItemPrice>
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
                onClick={() => handleSelectionChange('restaurant', restaurant)}
              >
                <ItemName>{restaurant.name}</ItemName>
                <ItemPrice>{restaurant.price}</ItemPrice>
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
                onClick={() => handleSelectionChange('activity', activity)}
              >
                <ItemName>{activity.name}</ItemName>
                <ItemPrice>{activity.price}</ItemPrice>
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
                onClick={() => handleSelectionChange('transport', transport)}
              >
                <ItemName>{transport.name}</ItemName>
                <ItemPrice>{transport.price}</ItemPrice>
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
      </MainContent>
    </ChatboxContainer>
  );
};

export default ChatboxPage;
