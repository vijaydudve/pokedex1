import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './card';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('../../../utils/helper', () => ({
  padId: jest.fn((id) => `#${id}`),
}));

describe('Card', () => {
  const mockPokemon:any = {
    id: '25',
    name: 'Pikachu',
    image: '/pikachu.png',
    types: ['electric'],
  };

  it('renders the card with correct pokemon information', () => {
    render(<Card pokemon={mockPokemon} />);
    
    expect(screen.getByAltText('25 is pokemon id of Pikachu')).toBeInTheDocument();
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByText('#25')).toBeInTheDocument();
  });

  it('applies correct classes based on pokemon type', () => {
    const { container } = render(<Card pokemon={mockPokemon} />);
    
    expect(container.firstChild).toHaveClass('from-electric');
    expect(container.firstChild).toHaveClass('to-electric');
  });

  it('applies correct classes for dual-type pokemon', () => {
    const dualTypePokemon = { ...mockPokemon, types: ['fire', 'flying'] };
    const { container } = render(<Card pokemon={dualTypePokemon} />);
    
    expect(container.firstChild).toHaveClass('from-fire');
    expect(container.firstChild).toHaveClass('to-flying');
  });

  it('applies default classes for unknown pokemon type', () => {
    const unknownTypePokemon = { ...mockPokemon, types: ['unknown'] };
    const { container } = render(<Card pokemon={unknownTypePokemon} />);
    
    expect(container.firstChild).not.toHaveClass('from-unknown');
    expect(container.firstChild).not.toHaveClass('to-unknown');
  });

  it('renders in onlyView mode correctly', () => {
    render(<Card pokemon={mockPokemon} onlyView={true} />);
    
    expect(screen.queryByText('Pikachu')).not.toBeInTheDocument();
    expect(screen.queryByText('#25')).not.toBeInTheDocument();
  });

  it('applies custom card dimensions', () => {
    const { container } = render(<Card pokemon={mockPokemon} cardWidth="w-60" cardHeight="h-80" />);
    
    expect(container.firstChild).toHaveClass('w-60');
    expect(container.firstChild).toHaveClass('h-80');
  });

  it('passes image dimensions to Image component', () => {
    render(<Card pokemon={mockPokemon} imgWidth={200} imgHeight={200} />);
    
    const image = screen.getByAltText('25 is pokemon id of Pikachu');
    expect(image).toHaveAttribute('width', '200');
    expect(image).toHaveAttribute('height', '200');
  });

  it('applies correct image classes in normal mode', () => {
    render(<Card pokemon={mockPokemon} />);
    
    const image = screen.getByAltText('25 is pokemon id of Pikachu');
    expect(image).toHaveClass('px-5');
    expect(image).toHaveClass('pt-3');
    expect(image).toHaveClass('h-3/4');
  });

  it('applies correct image classes in onlyView mode', () => {
    render(<Card pokemon={mockPokemon} onlyView={true} />);
    
    const image = screen.getByAltText('25 is pokemon id of Pikachu');
    expect(image).toHaveClass('h-full');
    expect(image).not.toHaveClass('px-5');
    expect(image).not.toHaveClass('pt-3');
  });
  const types = ['normal', 'ice', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'dark', 'fairy'];
  
  types.forEach(type => {
    it(`applies correct classes for ${type} type pokemon`, () => {
      const typePokemon = { ...mockPokemon, types: [type] };
      const { container } = render(<Card pokemon={typePokemon} />);
      
      expect(container.firstChild).toHaveClass(`from-${type}`);
      expect(container.firstChild).toHaveClass(`to-${type}`);
    });
  });
});