import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colors, breakpoints } from '../../styles/GlobalStyles';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const ChatboxModal: React.FC<ChatboxModalProps> = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      // İlk mesajı otomatik olarak gönder
      const userMessage: Message = {
        id: Date.now(),
        text: initialQuery,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages([userMessage]);
      setInputText('');
      
      // İlk mesaj için API çağrısı yap
      handleSendToAPI(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendToAPI = async (messageText: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API yanıtı alınamadı');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: Date.now(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Hatası:', error);
      
      const errorMessage: Message = {
        id: Date.now(),
        text: 'Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        text: inputText,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const currentInput = inputText;
      setInputText('');

      // API'ye mesajı gönder
      handleSendToAPI(currentInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>💬 Seyahat Asistanı</ModalTitle>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>

        <ChatContainer>
          <MessagesContainer>
            {messages.map((message) => (
              <MessageBubble key={message.id} isUser={message.isUser}>
                <MessageText>{message.text}</MessageText>
                <MessageTime>
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </MessageTime>
              </MessageBubble>
            ))}
            
            {isLoading && (
              <MessageBubble isUser={false}>
                <TypingIndicator>
                  <TypingDot />
                  <TypingDot />
                  <TypingDot />
                </TypingIndicator>
              </MessageBubble>
            )}
            
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <ChatInput
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Asistan yanıt veriyor..." : "Mesajınızı yazın..."}
              rows={1}
              disabled={isLoading}
            />
            <SendButton 
              onClick={handleSendMessage} 
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? 'Gönderiliyor...' : 'Gönder'}
            </SendButton>
          </InputContainer>
        </ChatContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
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
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
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

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageText = styled.div<{ isUser?: boolean }>`
  background: ${props => props.isUser ? colors.primary : '#f3f4f6'};
  color: ${props => props.isUser ? 'white' : colors.text};
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${props => props.isUser && `
    border-bottom-right-radius: 4px;
  `}
  
  ${props => !props.isUser && `
    border-bottom-left-radius: 4px;
  `}
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  align-self: flex-end;
  font-weight: 500;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #f3f4f6;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  align-self: flex-start;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;

  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }

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

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const ChatInput = styled.textarea<{ disabled?: boolean }>`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  padding: 12px 16px;
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
  line-height: 1.4;
  transition: border-color 0.2s ease;
  background: ${props => props.disabled ? '#f3f4f6' : 'white'};
  color: ${props => props.disabled ? '#9ca3af' : colors.text};

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

export default ChatboxModal;
