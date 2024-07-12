import React from 'react';
import { render, screen } from '@testing-library/react';
import Title from './title';

describe('Title', () => {
  const defaultTitle = 'Test Title';

  it('renders with default props', () => {
    render(<Title title={defaultTitle} />);
    const heading = screen.getByText(defaultTitle);
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('text-2xl text-darkblue font-bold tracking-wider');
  });

  it('renders with custom styles', () => {
    const customStyles = 'custom-class';
    render(<Title title={defaultTitle} customStyles={customStyles} />);
    const heading = screen.getByText(defaultTitle);
    expect(heading).toHaveClass('text-2xl text-darkblue font-bold tracking-wider custom-class');
  });

  it('renders with empty custom styles', () => {
    render(<Title title={defaultTitle} customStyles="" />);
    const heading = screen.getByText(defaultTitle);
    expect(heading).toHaveClass('text-2xl text-darkblue font-bold tracking-wider');
    expect(heading).not.toHaveClass('undefined');
  });

  it('renders with long title', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines';
    render(<Title title={longTitle} />);
    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('renders with special characters in title', () => {
    const specialTitle = 'Title with special characters: !@#$%^&*()';
    render(<Title title={specialTitle} />);
    expect(screen.getByText(specialTitle)).toBeInTheDocument();
  });
});