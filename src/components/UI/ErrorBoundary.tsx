import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 400px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 20px;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  color: #dc3545;
`;

const ErrorTitle = styled.h2`
  color: #dc3545;
  margin-bottom: 16px;
  font-size: 24px;
`;

const ErrorMessage = styled.p`
  color: #6c757d;
  margin-bottom: 24px;
  font-size: 16px;
  max-width: 500px;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin-bottom: 24px;
  text-align: left;
  max-width: 500px;
  width: 100%;
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  color: #495057;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ErrorStack = styled.pre`
  background: #e9ecef;
  padding: 16px;
  border-radius: 8px;
  font-size: 12px;
  color: #495057;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const RetryButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Bir Hata Oluştu</ErrorTitle>
          <ErrorMessage>
            Uygulamada beklenmeyen bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin veya daha sonra tekrar deneyin.
          </ErrorMessage>
          
          <ErrorDetails>
            <ErrorSummary>Hata Detayları</ErrorSummary>
            <ErrorStack>
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </ErrorStack>
          </ErrorDetails>

          <RetryButton onClick={this.handleRetry}>
            Tekrar Dene
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
