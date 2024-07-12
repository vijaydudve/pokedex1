import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PokemonPage, { generateMetadata } from './page';

// Mock the components
jest.mock('../../components/molecules/header/header', () => {
  return function MockHeader() {
    return <div data-testid="header">Mock Header</div>;
  };
});

jest.mock('../../components/molecules/pagination/pagination', () => {
  return function MockPagination() {
    return <div data-testid="pagination">Mock Pagination</div>;
  };
});

jest.mock('../../components/organisms/filter-options/filter-options', () => {
  return function MockFilterOptions() {
    return <div data-testid="filter-options">Mock Filter Options</div>;
  };
});

jest.mock('../../components/organisms/pokemon-list/pokemon-list', () => {
  return function MockPokemonList() {
    return <div data-testid="pokemon-list">Mock Pokemon List</div>;
  };
});

describe('PokemonPage', () => {
  it('renders all components correctly', async () => {
    render(await PokemonPage({ searchParams: {} }))

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('filter-options')).toBeInTheDocument();
    expect(screen.getByTestId('pokemon-list')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});

describe('generateMetadata', () => {
  it('generates correct metadata for default page', async () => {
    const metadata = await generateMetadata({ searchParams: {} });

    expect(metadata.title).toBe('Pokémon List - Page 1');
    expect(metadata.description).toBe('Browse through a list of Pokémon on page 1 with filtering and pagination options.');
  });

  it('generates correct metadata for specific page', async () => {
    const metadata = await generateMetadata({ searchParams: { page: '5' } });

    expect(metadata.title).toBe('Pokémon List - Page 5');
    expect(metadata.description).toBe('Browse through a list of Pokémon on page 5 with filtering and pagination options.');
  });
});