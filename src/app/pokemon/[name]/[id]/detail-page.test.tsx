import React from 'react';
import { render, screen } from '@testing-library/react';
import * as DetailPageURLUpdate from '@/components/organisms/detailpage-client-wrapper/detailpage-client-wrapper';
import * as PokemonDetails from '@/components/organisms/pokemon-detail/pokemon-detail';
import PokemonDetailPage from './page';

jest.mock('../../../../components/organisms/detailpage-client-wrapper/detailpage-client-wrapper', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mocked-url-update" />),
}));

jest.mock('../../../../components/organisms/pokemon-detail/pokemon-detail', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mocked-pokemon-details" />),
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    Suspense: ({ fallback, children }: { fallback: React.ReactNode, children: React.ReactNode }) => (
      <>
        <div data-testid="suspense-fallback">{fallback}</div>
        <div data-testid="suspense-children">{children}</div>
      </>
    ),
  }));

describe('PokemonDetailPage', () => {
  const mockParams = { id: '25',name:'' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(await PokemonDetailPage({ params: mockParams, }));
    expect(screen.getByTestId('mocked-url-update')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-pokemon-details')).toBeInTheDocument();
  });

  it('passes the correct pokemonId to DetailPageURLUpdate', async () => {
    render(await PokemonDetailPage({ params: mockParams }));
    expect(DetailPageURLUpdate.default).toHaveBeenCalledWith({ pokemonId: '25',pokemonName:"" }, {});
  });

  it('passes the correct pokemonId to PokemonDetails', async () => {
    render(await PokemonDetailPage({ params: mockParams }));
    expect(PokemonDetails.default).toHaveBeenCalledWith({pokemonId:"25" }, {});
  });

  it('generates correct metadata', async () => {
    const { generateMetadata } = require('./page');
    const metadata = await generateMetadata({ params: mockParams });
    
    expect(metadata).toEqual({
      title: 'Pokémon #25 Details',
      description: 'Detailed information about Pokémon #25',
    });
  });

  it('handles different pokemonId values', async () => {
    const differentParams = { id: '151',name:'' };
    render(await PokemonDetailPage({ params: differentParams }));
    
    expect(DetailPageURLUpdate.default).toHaveBeenCalledWith({ pokemonId: '151',pokemonName:"" }, {});
    expect(PokemonDetails.default).toHaveBeenCalledWith({ pokemonId: '151' }, {});
  });
});