
import { filterPokemon, genderFromGenderRate, padId } from './helper';
import { FilterOptions } from './types';

describe('Utility Functions', () => {
  describe('padId', () => {
    it('pads single digit numbers with two zeros', () => {
      expect(padId(1)).toBe('001');
    });

    it('pads double digit numbers with one zero', () => {
      expect(padId(25)).toBe('025');
    });

    it('does not pad three digit numbers', () => {
      expect(padId(100)).toBe('100');
    });
  });

  describe('genderFromGenderRate', () => {
    it('returns only male for rate 0', () => {
      expect(genderFromGenderRate(0)).toEqual(['male']);
    });

    it('returns only female for rate 8', () => {
      expect(genderFromGenderRate(8)).toEqual(['female']);
    });

    it('returns genderless for rate -1', () => {
      expect(genderFromGenderRate(-1)).toEqual(['genderless']);
    });

    it('returns both male and female for other rates', () => {
      expect(genderFromGenderRate(4)).toEqual(['male', 'female']);
    });
  });

  describe('filterPokemon', () => {
    const mockPokemon = {
      types: ['fire', 'flying'],
      gender: ['Male', 'Female'],
      stats: [
        { name: 'hp', value: 78 },
        { name: 'attack', value: 84 },
      ],
      name: 'Charizard',
    };

    it('returns true when no filters are applied', () => {
      const emptyFilters: FilterOptions = {};
      expect(filterPokemon(mockPokemon, emptyFilters)).toBe(true);
    });

    it('filters by gender correctly', () => {
      const genderFilters: FilterOptions = { genders: ['Male'] };
      expect(filterPokemon(mockPokemon, genderFilters)).toBe(true);

      const wrongGenderFilters: FilterOptions = { genders: ['Genderless'] };
      expect(filterPokemon(mockPokemon, wrongGenderFilters)).toBe(false);
    });

    it('filters by stats correctly', () => {
      const statFilters: FilterOptions = { stats: [{ name: 'hp', min: 70, max: 80 }] };
      expect(filterPokemon(mockPokemon, statFilters)).toBe(true);

      const wrongStatFilters: FilterOptions = { stats: [{ name: 'hp', min: 90, max: 100 }] };
      expect(filterPokemon(mockPokemon, wrongStatFilters)).toBe(false);
    });

    it('filters by search correctly', () => {
      const searchFilter: FilterOptions = { search: 'char' };
      expect(filterPokemon(mockPokemon, searchFilter)).toBe(true);

      const wrongSearchFilter: FilterOptions = { search: 'bulba' };
      expect(filterPokemon(mockPokemon, wrongSearchFilter)).toBe(false);
    });
  });
});