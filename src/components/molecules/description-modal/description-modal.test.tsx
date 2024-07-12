import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DescriptionModal from './description-modal';

jest.mock('react-icons/io5', () => ({
  IoClose: () => <div data-testid="mock-close-icon" />,
}));

jest.mock('../../atoms/button/button', () => {
    return function MockButton({ children, onClick,customStyles, ...props }: any) {
      return (
        <button onClick={onClick} {...props}>
          {children}
        </button>
      );
    };
  });

describe('DescriptionModal', () => {
  const mockDescription = 'This is a test description';

  it('renders the read more button', () => {
    render(<DescriptionModal description={mockDescription} customStyles='' />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    expect(readMoreButton).toBeInTheDocument();
    expect(readMoreButton).toHaveTextContent('read more');
  });

  it('opens the modal when read more is clicked', () => {
    render(<DescriptionModal description={mockDescription} customStyles='' />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    fireEvent.click(readMoreButton);
    
    const modal = screen.getByText(mockDescription);
    expect(modal).toBeInTheDocument();
    expect(modal.parentElement).toHaveClass('opacity-100');
  });

  it('closes the modal when close button is clicked', () => {
    render(<DescriptionModal description={mockDescription} customStyles='' />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    fireEvent.click(readMoreButton);
    
    const closeButton = screen.getByRole('button', { name: /close description/i });
    fireEvent.click(closeButton);
    
    const modal = screen.getByText(mockDescription);
    expect(modal.parentElement).toHaveClass('opacity-0');
  });

  it('applies custom styles to the modal', () => {
    const customStyles = 'custom-class';
    render(<DescriptionModal description={mockDescription} customStyles={customStyles} />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    fireEvent.click(readMoreButton);
    
    const modal = screen.getByText(mockDescription).parentElement;
    expect(modal).toHaveClass(customStyles);
  });

  it('renders the close icon', () => {
    render(<DescriptionModal description={mockDescription} customStyles='' />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    fireEvent.click(readMoreButton);
    
    const closeIcon = screen.getByTestId('mock-close-icon');
    expect(closeIcon).toBeInTheDocument();
  });

  it('sets correct aria labels and roles', () => {
    render(<DescriptionModal description={mockDescription} customStyles='' />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    expect(readMoreButton).toHaveAttribute('aria-label', 'Read more about the description');
    
    fireEvent.click(readMoreButton);
    
    const closeButton = screen.getByRole('button', { name: /close description/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close description');
  });

  it('sets correct tabIndex for buttons', () => {
    render(<DescriptionModal description={mockDescription} customStyles='' />);
    const readMoreButton = screen.getByRole('button', { name: /read more about the description/i });
    expect(readMoreButton).toHaveAttribute('tabIndex', '0');
    
    fireEvent.click(readMoreButton);
    
    const closeButton = screen.getByRole('button', { name: /close description/i });
    expect(closeButton).toHaveAttribute('tabIndex', '0');
  });
});