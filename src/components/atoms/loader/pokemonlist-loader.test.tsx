import React from 'react';
import { render } from '@testing-library/react';
import PokemonListLoader from './pokemonlist-loader';

describe('PokemonListLoader Component', () => {
  it('should display 20 loader items', () => {
    const { getAllByRole } = render(<PokemonListLoader />);
    const loaderItems = getAllByRole('article');
    expect(loaderItems.length).toBe(20);
  });
});
