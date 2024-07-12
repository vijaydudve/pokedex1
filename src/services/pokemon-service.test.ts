import {
  fetchPokemon,
  fetchPokemonDetails,
  fetchGender,
  fetchPokemonWeakAgainst,
  fetchPokemonEggGroups,
  fetchPokemonDescription,
  fetchPokemonEvolutionChain,
  API_BASE_URL
} from "./pokemon-service";
import { getRequest } from "@/api/requests";
import { genderFromGenderRate } from "@/utils/helper";

jest.mock("../api/requests");
jest.mock("../utils/helper");

describe('Pokemon API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchPokemon', () => {
    it('should fetch a list of Pokemon', async () => {
      const mockListResponse = {
        results: [
          { url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ]
      };
      const mockPokemonDetails = {
        name: 'bulbasaur',
        id: 1,
        sprites: {
          other: {
            dream_world: {
              front_default: 'image_url'
            }
          }
        },
        types: [{ type: { name: 'grass' } }],
        stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
        height: 7,
        weight: 69,
        abilities: [{ ability: { name: 'overgrow' } }],
      };
  
      (getRequest as jest.Mock).mockResolvedValueOnce(mockListResponse);
      (getRequest as jest.Mock).mockResolvedValue(mockPokemonDetails);
      (genderFromGenderRate as jest.Mock).mockReturnValue(['male', 'female']);
  
      const result = await fetchPokemon();
  
      expect(getRequest).toHaveBeenCalledWith(`${API_BASE_URL}/pokemon`, { offset: 0, limit: 20 });
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(expect.objectContaining({
        name: 'bulbasaur',
        id: 1,
        image: 'image_url',
        types: ['grass'],
        stats: [{ name: 'hp', value: 45 }],
        height: 7,
        weight: 69,
        abilities: ['overgrow'],
        gender: ['male', 'female'],
      }));
    });

    it('should throw an error if the request fails', async () => {
      (getRequest as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(fetchPokemon()).rejects.toThrow('API error');
    });
  });

  describe('fetchPokemonDetails', () => {

    it('should handle missing image', async () => {
      const mockPokemonData = {
        name: 'missingno',
        id: 0,
        sprites: { other: { dream_world: {} } },
        types: [],
        stats: [],
        height: 0,
        weight: 0,
        abilities: [],
      };
  
      (getRequest as jest.Mock).mockResolvedValueOnce(mockPokemonData);
      (getRequest as jest.Mock).mockResolvedValueOnce({ gender_rate: -1 });
      (genderFromGenderRate as jest.Mock).mockReturnValue([]);
  
      const result = await fetchPokemonDetails(0);
  
      expect(result.image).toBe('');
    });

    it('should fetch details for a specific Pokemon', async () => {
      const mockPokemonData = {
        name: 'pikachu',
        id: 25,
        sprites: { other: { dream_world: { front_default: 'image_url' } } },
        types: [{ type: { name: 'electric' } }],
        stats: [{ stat: { name: 'hp' }, base_stat: 35 }],
        height: 4,
        weight: 60,
        abilities: [{ ability: { name: 'static' } }],
      };

      (getRequest as jest.Mock).mockResolvedValueOnce(mockPokemonData);
      (getRequest as jest.Mock).mockResolvedValueOnce({ gender_rate: 4 });
      (genderFromGenderRate as jest.Mock).mockReturnValue(['male', 'female']);

      const result = await fetchPokemonDetails(25);

      expect(getRequest).toHaveBeenCalledWith(`${API_BASE_URL}/pokemon/25`);
      expect(result).toEqual(expect.objectContaining({
        name: 'pikachu',
        id: 25,
        image: 'image_url',
        types: ['electric'],
        stats: [{ name: 'hp', value: 35 }],
        height: 4,
        weight: 60,
        abilities: ['static'],
        gender: ['male', 'female'],
      }));
    });

    it('should handle Pokemon with no gender', async () => {
      const mockPokemonData = {
        name: 'magnemite',
        id: 81,
        sprites: { other: { dream_world: { front_default: 'image_url' } } },
        types: [{ type: { name: 'electric' } }, { type: { name: 'steel' } }],
        stats: [{ stat: { name: 'hp' }, base_stat: 25 }],
        height: 3,
        weight: 60,
        abilities: [{ ability: { name: 'magnet pull' } }],
      };

      (getRequest as jest.Mock).mockResolvedValueOnce(mockPokemonData);
      (getRequest as jest.Mock).mockResolvedValueOnce({ gender_rate: -1 });
      (genderFromGenderRate as jest.Mock).mockReturnValue([]);

      const result = await fetchPokemonDetails(81);

      expect(result.gender).toEqual([]);
    });
  });

  describe('fetchGender', () => {
    it('should fetch gender data for a Pokemon', async () => {
      (getRequest as jest.Mock).mockResolvedValue({ gender_rate: 4 });
      (genderFromGenderRate as jest.Mock).mockReturnValue(['male', 'female']);

      const result = await fetchGender(25);

      expect(getRequest).toHaveBeenCalledWith(`${API_BASE_URL}/pokemon-species/25`);
      expect(result).toEqual(['male', 'female']);
    });

    it('should throw an error if the request fails', async () => {
      (getRequest as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(fetchGender(25)).rejects.toThrow('API error');
    });
  });

  describe('fetchPokemonWeakAgainst', () => {
    beforeEach(() => {
      (getRequest as jest.Mock).mockReset();
    });

    it('should handle API errors', async () => {
      (getRequest as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(fetchPokemonWeakAgainst('25')).rejects.toThrow('API error');
    });

    it('should handle errors when fetching type data', async () => {
      const mockPokemonData = {
        name: 'pikachu',
        id: 25,
        types: [{ type: { name: 'electric' } }],
      };
  
      (getRequest as jest.Mock)
        .mockResolvedValueOnce(mockPokemonData)
        .mockRejectedValueOnce(new Error('Failed to fetch type data'));
  
      await expect(fetchPokemonWeakAgainst('25')).rejects.toThrow('Failed to fetch type data');
    });

    
  });

  describe('fetchPokemonEggGroups', () => {
    it('should fetch egg groups for a Pokemon', async () => {
      const mockEggGroups = [{ name: 'monster' }, { name: 'dragon' }];
      (getRequest as jest.Mock).mockResolvedValue({ egg_groups: mockEggGroups });

      const result = await fetchPokemonEggGroups('1');

      expect(getRequest).toHaveBeenCalledWith(`${API_BASE_URL}/pokemon-species/1`);
      expect(result).toEqual(mockEggGroups);
    });

    it('should handle Pokemon with no egg groups', async () => {
      (getRequest as jest.Mock).mockResolvedValue({ egg_groups: [] });

      const result = await fetchPokemonEggGroups('132');

      expect(result).toEqual([]);
    });
  });

  describe('fetchPokemonDescription', () => {
    it('should fetch the English description for a Pokemon', async () => {
      const mockDescription = 'A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.';
      const mockData = {
        flavor_text_entries: [
          { language: { name: 'en' }, flavor_text: mockDescription },
          { language: { name: 'ja' }, flavor_text: 'Japanese description' },
        ],
      };
      (getRequest as jest.Mock).mockResolvedValue(mockData);

      const result = await fetchPokemonDescription('1');

      expect(getRequest).toHaveBeenCalledWith(`${API_BASE_URL}/pokemon-species/1`);
      expect(result).toBe(mockDescription);
    });

    it('should return undefined if no English description is found', async () => {
      const mockData = {
        flavor_text_entries: [
          { language: { name: 'ja' }, flavor_text: 'Japanese description' },
        ],
      };
      (getRequest as jest.Mock).mockResolvedValue(mockData);

      const result = await fetchPokemonDescription('1');

      expect(result).toBeUndefined();
    });
  });

  describe('fetchPokemonEvolutionChain', () => {
    beforeEach(() => {
      (getRequest as jest.Mock).mockReset();
    });
  
    it('should fetch the evolution chain for a Pokemon', async () => {
      const mockSpeciesData = {
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' },
      };
      const mockEvolutionChainData = {
        chain: {
          species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
          evolves_to: [
            {
              species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' },
              evolves_to: [
                {
                  species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' },
                  evolves_to: [],
                },
              ],
            },
          ],
        },
      };
      const mockPokemonDetails = {
        name: 'bulbasaur',
        id: 1,
        sprites: {
          other: {
            dream_world: {
              front_default: 'image_url'
            }
          }
        },
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
        height: 7,
        weight: 69,
        abilities: [{ ability: { name: 'overgrow' } }],
      };
  
      (getRequest as jest.Mock)
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionChainData)
        .mockResolvedValue(mockPokemonDetails);
  
      const result = await fetchPokemonEvolutionChain('1');
  
      expect(getRequest).toHaveBeenCalledWith(`${API_BASE_URL}/pokemon-species/1`);
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[1].name).toBe('bulbasaur');
      expect(result[2].name).toBe('bulbasaur');
    });
  
    it('should handle Pokemon with no evolutions', async () => {
      const mockSpeciesData = {
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/67/' },
      };
      const mockEvolutionChainData = {
        chain: {
          species: { name: 'tauros', url: 'https://pokeapi.co/api/v2/pokemon-species/128/' },
          evolves_to: [],
        },
      };
      const mockPokemonDetails = {
        name: 'tauros',
        id: 128,
        sprites: {
          other: {
            dream_world: {
              front_default: 'image_url'
            }
          }
        },
        types: [{ type: { name: 'normal' } }],
        stats: [{ stat: { name: 'hp' }, base_stat: 75 }],
        height: 14,
        weight: 884,
        abilities: [{ ability: { name: 'intimidate' } }],
      };
  
      (getRequest as jest.Mock)
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionChainData)
        .mockResolvedValue(mockPokemonDetails);
  
      const result = await fetchPokemonEvolutionChain('128');
  
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('tauros');
    });
  
    it('should handle API errors', async () => {
      (getRequest as jest.Mock).mockRejectedValue(new Error('API error'));
  
      await expect(fetchPokemonEvolutionChain('1')).rejects.toThrow('API error');
    });
  });
});