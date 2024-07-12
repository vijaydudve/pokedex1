import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailPageURLUpdate from './detailpage-client-wrapper';

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

describe('DetailPageURLUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls router.replace with the correct URL', async () => {
    render(<DetailPageURLUpdate pokemonId="25" pokemonName="pikachu" />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/pokemon/pikachu/25');
    });
  });

  it('calls router.replace only once', async () => {
    render(<DetailPageURLUpdate pokemonId="25" pokemonName="pikachu" />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledTimes(1);
    });
  });

  it('updates URL when pokemonId changes', async () => {
    const { rerender } = render(<DetailPageURLUpdate pokemonId="25" pokemonName="pikachu" />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/pokemon/pikachu/25');
    });
    rerender(<DetailPageURLUpdate pokemonId="26" pokemonName="raichu" />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/pokemon/raichu/26');
    });
  });

  it('renders null', () => {
    const { container } = render(<DetailPageURLUpdate pokemonId="25" pokemonName="pikachu" />);
    expect(container.firstChild).toBeNull();
  });
  
});