import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { fetchPokemon } from "@/services/pokemon-service";
import { filterPokemon } from "@/utils/helper";
import PokemonList from './pokemon-list';

jest.mock('../../../services/pokemon-service');

jest.mock('../../../utils/helper');

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: jest.fn((fn) => fn),
}));

jest.mock('../../molecules/card-wrapper/card-wrapper', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="card-wrapper">{children}</div>,
}));

jest.mock('../../molecules/card/card', () => ({
  __esModule: true,
  default: ({ pokemon }: { pokemon: any }) => <div data-testid={`pokemon-card-${pokemon.id}`}>{pokemon.name}</div>,
}));

const mockPokemonData = [
  { id: 1, name: 'Bulbasaur', types: ['grass'], gender: ['male', 'female'], stats: [{ name: 'hp', value: 45 }] },
  { id: 2, name: 'Ivysaur', types: ['grass', 'poison'], gender: ['male', 'female'], stats: [{ name: 'hp', value: 60 }] },
  { id: 3, name: 'Venusaur', types: ['grass', 'poison'], gender: ['male', 'female'], stats: [{ name: 'hp', value: 80 }] },
];

describe('PokemonList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchPokemon as jest.Mock).mockResolvedValue(mockPokemonData);
    (filterPokemon as jest.Mock).mockImplementation((pokemon) => true);
  });

  it('renders pokemon cards', async () => {
    render(await PokemonList({ searchParams: {} }))
    for (const pokemon of mockPokemonData) {
      await screen.findByTestId(`pokemon-card-${pokemon.id}`);
    }
    expect(screen.getAllByTestId('card-wrapper')).toHaveLength(3);
  });

  it('handles pagination correctly', async () => {
    render(await PokemonList({ searchParams: {page: '2'} }))
    expect(fetchPokemon).toHaveBeenCalledWith(20, 20);
  });

  it('applies type filter', async () => {
    render(await PokemonList({ searchParams: {type: 'grass%poison'} }))
    expect(filterPokemon).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ types: ['grass', 'poison'] })
    );
  });

  it('applies gender filter', async () => {
    render(await PokemonList({ searchParams: {gender: 'male%female'} }))
    expect(filterPokemon).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ genders: ['male', 'female'] })
    );
  });

  it('applies stats filter', async () => {
    render(await PokemonList({ searchParams: {stats: '[hp=40-60]'} }))
    expect(filterPokemon).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ 
        stats: [{ name: 'hp', min: 40, max: 60 }]
      })
    );
  });

  it('applies search filter', async () => {
    render(await PokemonList({ searchParams: {search: 'Bulbasaur'} }))
    expect(filterPokemon).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ search: 'Bulbasaur' })
    );
  });

  it('handles empty search params', async () => {
    render(await PokemonList({ searchParams: {} }))
    expect(filterPokemon).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ 
        types: [],
        genders: [],
        stats: [],
        search: ''
      })
    );
  });
});