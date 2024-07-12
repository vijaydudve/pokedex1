/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as pokemonService from '@/services/pokemon-service';
import { act } from 'react';
import PokemonDetails from './pokemon-detail';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

// Mock react-icons
jest.mock('react-icons/bs', () => ({
  BsArrowLeftCircle: () => <div data-testid="arrow-left-circle" />,
  BsArrowRight: () => <div data-testid="arrow-right" />,
  BsArrowRightCircle: () => <div data-testid="arrow-right-circle" />,
}));

jest.mock('react-icons/hi2', () => ({
  HiMiniArrowLongRight: () => <div data-testid="arrow-long-right" />,
  HiMiniArrowLongLeft: () => <div data-testid="arrow-long-left" />,
}));

// Mock the imported components
jest.mock('../../atoms/button/button', () => {
  return ({ children }: { children: React.ReactNode }) => <div data-testid="button">{children}</div>;
});

jest.mock('../../atoms/title-description/title-description', () => {
  return ({ description }: { description: string }) => <div data-testid="title-description">{description}</div>;
});

jest.mock('../../atoms/title/title', () => {
  return ({ title }: { title: string }) => <div data-testid="title">{title}</div>;
});

jest.mock('../../molecules/card/card', () => {
  return () => <div data-testid="card" />;
});

jest.mock('../../molecules/close-button/close-button', () => {
  return () => <div data-testid="close-button" />;
});

jest.mock('../../molecules/description-modal/description-modal', () => {
  return () => <div data-testid="description-modal" />;
});

jest.mock('../../../services/pokemon-service', () => ({
  fetchPokemonDetails: jest.fn(),
  fetchPokemonDescription: jest.fn(),
  fetchPokemonEggGroups: jest.fn(),
  fetchPokemonWeakAgainst: jest.fn(),
  fetchPokemonEvolutionChain: jest.fn(),
}));

describe('PokemonDetails', () => {
    const mockPokemonDetails = {
        id: 1,
        name: 'Bulbasaur',
        height: 7,
        weight: 69,
        gender: ['Male', 'Female'],
        abilities: ['Overgrow', 'Chlorophyll'],
        types: ['Grass', 'Poison'],
        stats: [
            { name: 'HP', value: 45 },
            { name: 'Attack', value: 49 },
        ],
    };

    beforeEach(() => {
        (pokemonService.fetchPokemonDetails as jest.Mock).mockResolvedValue(mockPokemonDetails);
        (pokemonService.fetchPokemonDescription as jest.Mock).mockResolvedValue('A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.');
        (pokemonService.fetchPokemonEggGroups as jest.Mock).mockResolvedValue([{ name: 'Monster', url: '' }, { name: 'Grass', url: '' }]);
        (pokemonService.fetchPokemonWeakAgainst as jest.Mock).mockResolvedValue(['Flying', 'Fire', 'Psychic', 'Ice']);
        (pokemonService.fetchPokemonEvolutionChain as jest.Mock).mockResolvedValue([mockPokemonDetails, { ...mockPokemonDetails, id: 2, name: 'Ivysaur' }]);
    });

    it('renders pokemon name and ID correctly', async () => {
        const component = await PokemonDetails({ pokemonId: "1" });
        render(component);

        const nameIdElement = screen.getByTestId('pokemon-name-id');
        expect(nameIdElement).toHaveTextContent('BULBASAUR');
        expect(nameIdElement).toHaveTextContent('001');
    });

    it('renders pokemon description', async () => {
        const component = await PokemonDetails({ pokemonId: "1" });
        render(component);

        const descriptionElement = screen.getByTestId('pokemon-description');
        expect(descriptionElement).toHaveTextContent('A strange seed was planted on its back at birth.');
    });

    it('renders pokemon abilities, types, and weaknesses', async () => {
        const component = await PokemonDetails({ pokemonId: "1" });
        render(component);

        const abilitiesTypesWeaknessesElement = screen.getByTestId('pokemon-abilities-types-weaknesses');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Abilities');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Overgrow, Chlorophyll');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Types');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Grass');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Poison');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Weak Against');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Flying');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Fire');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Psychic');
        expect(abilitiesTypesWeaknessesElement).toHaveTextContent('Ice');
    });

    it('renders pokemon stats', async () => {
        const component = await PokemonDetails({ pokemonId: "1" });
        render(component);

        const statsElement = screen.getByTestId('pokemon-stats');
        expect(statsElement).toHaveTextContent('Stats');
        expect(statsElement).toHaveTextContent('HP');
        expect(statsElement).toHaveTextContent('45');
        expect(statsElement).toHaveTextContent('Attack');
        expect(statsElement).toHaveTextContent('49');
    });

    it('renders pokemon evolution chain', async () => {
        const component = await PokemonDetails({ pokemonId: "1" });
        render(component);

        const evolutionElement = screen.getByTestId('pokemon-evolution');
        expect(evolutionElement).toHaveTextContent('Evolution Chain');
        const cards = evolutionElement.querySelectorAll('[data-testid="card"]');
        expect(cards).toHaveLength(2);
    });

    it('renders navigation buttons', async () => {
        const component = await PokemonDetails({ pokemonId: "1" });
        render(component);

        const navigationElement = screen.getByTestId('pokemon-navigation');
        expect(navigationElement).toHaveTextContent('BulbasaurBulbasaur');
        expect(navigationElement).toHaveTextContent('BulbasaurBulbasaur');
    });

  });