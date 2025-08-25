import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { colors, breakpoints, GradientBackground } from '../styles/GlobalStyles';
import Header from '../components/Layout/Header';

const ChatboxContainer = styled(GradientBackground)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ChatboxContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 80px 12px 16px;

  @media (min-width: ${breakpoints.tablet}) {
    padding: 100px 20px 20px;
    max-width: 900px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 120px 24px 20px;
    max-width: 1000px;
  }
`;

const ChatboxHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
  color: white;
  padding: 0 8px;

  @media (min-width: ${breakpoints.tablet}) {
    margin-bottom: 32px;
    padding: 0;
  }
`;

const ChatboxTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 28px;
    margin-bottom: 8px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 32px;
  }
`;

const ChatboxSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.95;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  @media (min-width: ${breakpoints.tablet}) {
    font-size: 16px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    font-size: 18px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  min-height: 300px;
  max-height: 60vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (min-width: ${breakpoints.tablet}) {
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 16px;
    min-height: 400px;
    max-height: 500px;
  }

  @media (min-width: ${breakpoints.desktop}) {
    padding: 24px;
    max-height: 550px;
  }

  /* Scrollbar Styling */
  &::-webkit-scrollbar {
    width: 4px;
    
    @media (min-width: ${breakpoints.tablet}) {
      width: 6px;
    }
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
  
  @media (min-width: ${breakpoints.tablet}) {
    padding: 14px 18px;
    border-radius: 20px;
    font-size: 16px;
    line-height: 1.5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Subtle message tail */
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
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-align: ${props => props.isUser ? 'right' : 'left'};
  margin-top: 6px;
  margin-${props => props.isUser ? 'right' : 'left'}: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 6px 6px 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (min-width: ${breakpoints.tablet}) {
    gap: 12px;
    border-radius: 50px;
    padding: 8px 8px 8px 24px;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  padding: 12px 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  @media (min-width: ${breakpoints.tablet}) {
    padding: 16px 0;
  }
`;

const SendButton = styled.button<{ disabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.disabled 
    ? 'rgba(255, 255, 255, 0.3)' 
    : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
  };
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  font-size: 18px;

  @media (min-width: ${breakpoints.tablet}) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.disabled 
      ? 'none' 
      : `0 4px 15px rgba(99, 102, 241, 0.4)`
    };
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

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatboxPage: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Merhaba! Size nasıl yardımcı olabilirim? Seyahat planlarınız hakkında konuşalım! 🌍',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled] = useState(false); // Chatbox'ta header renk değiştirmesin
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Query'yi input'a koy ve otomatik gönder
      setTimeout(() => {
        handleSendMessage(queryParam);
      }, 1000); // Sayfa yüklendikten 1 saniye sonra gönder
    }
  }, [location.search]);

  // Chatbox sayfasında scroll detection yok - header renk değiştirmesin

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

    // Simüle edilmiş bot yanıtı
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
    
    if (message.includes('istanbul') || message.includes('İstanbul')) {
      return 'İstanbul harika bir seçim! Tarihi yarımada, Boğaz turu, ve lezzetli yemekler için önerilerim var. Hangi bölgeleri görmeyi planlıyorsunuz?';
    } else if (message.includes('ankara') || message.includes('Ankara')) {
      return 'Ankara\'da Anıtkabir, Kocatepe Camii ve Hamamönü\'nü mutlaka görmelisiniz. Kaç gün kalmayı planlıyorsunuz?';
    } else if (message.includes('izmir') || message.includes('İzmir')) {
      return 'İzmir\'de Alsancak, Konak Meydanı ve Kemeraltı Çarşısı\'nı öneriyorum. Ayrıca Çeşme ve Alaçatı da yakında!';
    } else if (message.includes('otel') || message.includes('konaklama')) {
      return 'Hangi şehir için konaklama arıyorsunuz? Bütçeniz ve tercihleriniz neler?';
    } else if (message.includes('uçak') || message.includes('bilet')) {
      return 'Hangi tarihler arasında ve nereye seyahat etmeyi planlıyorsunuz? Size en uygun uçak biletlerini bulabilirim.';
    } else {
      return 'Anladım! Bu konuda size daha detaylı bilgi verebilirim. Seyahat planınız hakkında daha fazla detay paylaşır mısınız?';
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
      <Header 
        onLoginClick={() => {}} 
        onSignupClick={() => {}} 
        isScrolled={isScrolled}
      />
      
      <ChatboxContent>
        <ChatboxHeader>
          <ChatboxTitle>🤖 Seyahat Asistanı</ChatboxTitle>
          <ChatboxSubtitle>Size özel rotalar oluşturalım</ChatboxSubtitle>
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
          placeholder="Bir mesaj yazın..."
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
      </ChatboxContent>
    </ChatboxContainer>
  );
};

export default ChatboxPage;
