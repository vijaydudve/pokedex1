
import { getRequest } from "@/api/requests";
import { genderFromGenderRate } from "@/utils/helper";
import { EvolutionChain, PokemonDetails } from "@/utils/types";

export const API_BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(offset = 0, limit = 20): Promise<PokemonDetails[]> {
    try {
        const listResponse = await getRequest(`${API_BASE_URL}/pokemon`, { offset, limit })
        const pokemonIds = listResponse.results.map((pokemon: any) => Number(pokemon.url.split('/').slice(-2, -1)[0]));
        const pokemonPromises = pokemonIds.map(fetchPokemonDetails);
        const detailData = await Promise.all(pokemonPromises)
        return detailData;
    } catch (error) {
        throw error;
    }
}

export async function fetchPokemonDetails(id: number): Promise<PokemonDetails> {
    const data = await getRequest(`${API_BASE_URL}/pokemon/${id}`)
    const genderData = await fetchGender(id)
    return {
        name: data.name,
        id: data.id,
        image: data.sprites?.other?.dream_world?.front_default || '',
        types: data.types.map((type: any) => type.type.name),
        stats: data.stats.map((stat: any) => ({ name: stat.stat.name, value: stat.base_stat })),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((ability: { ability: { name: string } }) => ability.ability.name),
        gender: genderData || []
    };
}

export async function fetchGender(id: number) {
    try {
        const response = await getRequest(`${API_BASE_URL}/pokemon-species/${id}`)
        const data = response?.gender_rate
        return genderFromGenderRate(data)
    } catch (error) {
        throw error;
    }
}

export const fetchPokemonWeakAgainst = async (pokemonName: string) => {
    try {
        const pokemonData = await fetchPokemonDetails(Number(pokemonName))
        const types = pokemonData.types;
        const weaknesses = new Set();
        for (const type of types) {
            const typeData = await getRequest(`${API_BASE_URL}/type/${type}`)
            typeData.damage_relations.double_damage_from.forEach((t: any) => weaknesses.add(t.name));
        }
        return Array.from(weaknesses);
    } catch (error) {
        throw error;
    }
};

export const fetchPokemonEggGroups = async (id: string) => {
    try {
        const data = await getRequest(`${API_BASE_URL}/pokemon-species/${id}`)
        return data.egg_groups;
    } catch (error) {
        throw error;
    }
};

export const fetchPokemonDescription = async (id: string) => {
    try {
        const data = await getRequest(`${API_BASE_URL}/pokemon-species/${id}`)
        const description = data.flavor_text_entries.find(
            (entry: { language: { name: string } }) =>
                entry.language.name === 'en'
        )?.flavor_text;
        return description;
    } catch (error) {
        throw error;
    }
};

export const fetchPokemonEvolutionChain = async (id: string) => {
    try {
        const response = await getRequest(`${API_BASE_URL}/pokemon-species/${id}`)
        const evolutionchainData = await getRequest(response.evolution_chain.url);
        const { chain } = evolutionchainData;
        const extractEvolutionChain = async (chain: EvolutionChain): Promise<any[]> => {
            const currentSpecies = { name: chain.species.name, url: chain.species.url };
            const nextEvolutions = await Promise.all(chain.evolves_to.flatMap(async (nextChain) => {
                return await extractEvolutionChain(nextChain);
            }));
            const currentSpeciesUrlParts = currentSpecies.url.split('/');
            const currentSpeciesId = currentSpeciesUrlParts[currentSpeciesUrlParts.length - 2];
            const currentPokemon = await fetchPokemonDetails(Number(currentSpeciesId))
            return [currentPokemon, ...nextEvolutions.flat()];
        };
        return await extractEvolutionChain(chain);
    } catch (error) {
        throw error;
    }
  };
