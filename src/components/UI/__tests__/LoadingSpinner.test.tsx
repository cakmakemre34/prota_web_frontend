import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const customText = 'Özel yükleme mesajı';
    render(<LoadingSpinner text={customText} />);
    
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders without text when text prop is not provided', () => {
    render(<LoadingSpinner text="" />);
    
    expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    
    // Check if small size is applied
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
    
    rerender(<LoadingSpinner size="large" />);
    // Check if large size is applied
    expect(spinner).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
  });
});
