/* eslint-disable react/display-name */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { padId } from '@/utils/helper';
import CardWrapper from './card-wrapper';

jest.mock('next/link', () => {
  return ({ children, onClick,passHref, ...rest }: any) => {
    return (
      <a onClick={onClick} {...rest}>
        {children}
      </a>
    );
  };
});

jest.mock('../../../utils/helper', () => ({
  padId: jest.fn((id) => `#${id}`),
}));

describe('CardWrapper', () => {
  const mockChild = <div>Mock Child</div>;
  const mockPokemonId = '25';
  const mockPokemonName = 'pikachu';

  let originalLocation: Location;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        setItem: jest.fn(),
      },
      writable: true,
    });
    originalLocation = window.location;

    // Mock window.location
    delete (window as any).location;
    window.location = {
      ...originalLocation,
      pathname: '/test-path',
      search: '?test-query',
      href: 'http://localhost/test-path?test-query'
    };
  });

  afterEach(() => {
    // Restore the original window.location after each test
    window.location = originalLocation;
  });

  it('renders children correctly', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    expect(screen.getByText('Mock Child')).toBeInTheDocument();
  });

  it('renders Link with correct href', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/pokemon/${mockPokemonName}/${mockPokemonId}`);
  });

  it('renders Link with correct aria-label', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', `pikachu, ID: #25`);
  });

  it('calls padId with correct argument', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    expect(padId).toHaveBeenCalledWith(25);
  });

  it('handles click correctly', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    const link = screen.getByRole('link');
    fireEvent.click(link);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'previous-url',
      JSON.stringify('/test-path?test-query')
    );
  });

  it('handles pokemonId as number', () => {
    render(<CardWrapper pokemonId={25} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/pokemon/${mockPokemonName}/25`);
  });

  it('handles empty pokemonName', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName="">{mockChild}</CardWrapper>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/pokemon//25`);
  });

  it('applies correct CSS classes', () => {
    render(<CardWrapper pokemonId={mockPokemonId} pokemonName={mockPokemonName}>{mockChild}</CardWrapper>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('w-[97%]');
    expect(link).toHaveClass('rounded-md');
  });
});