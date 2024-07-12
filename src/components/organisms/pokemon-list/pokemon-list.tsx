import CardWrapper from "@/components/molecules/card-wrapper/card-wrapper";
import Card from "@/components/molecules/card/card";
import { cache } from 'react';
import { LRUCache } from 'lru-cache';
import { fetchPokemon } from "@/services/pokemon-service";
import { filterPokemon } from "@/utils/helper";

const pokemonCache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 5,
});

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

const cachedFetchPokemon = cache(async (offset: number, itemsPerPage: number) => {
    const cacheKey = `pokemon_${offset}_${itemsPerPage}`;
    const cachedData = pokemonCache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }
    const data = await fetchPokemon(offset, itemsPerPage);
    pokemonCache.set(cacheKey, data);
    return data;
});

export default async function PokemonList({ searchParams }: Props) {
    try {


        const currentPage = Number(searchParams.page) || 1;
        const itemsPerPage = 20;
        const offset = (currentPage - 1) * itemsPerPage;

        const typeArray = (searchParams?.type as string)?.split('%') || [];
        const genderArray = (searchParams?.gender as string)?.split('%') || [];
        const statsArray = (searchParams?.stats as string)?.slice(1, -1)?.split('%') || [];
        const parsedStatsArray = statsArray.map((stat: string) => {
            const [name, range] = stat.split('=');
            const [minStr, maxStr] = range.split('-');
            const min = parseInt(minStr, 10);
            const max = parseInt(maxStr, 10);
            return { name, min, max };
        });
        const searchString = searchParams?.search as string
        const searchData = searchString ? decodeURIComponent(searchString) : '';

        const pokemonData: any = await cachedFetchPokemon(offset, itemsPerPage);
        const filteredPokemons = pokemonData.filter((pokemon: any) => filterPokemon(pokemon, {
            types: typeArray,
            genders: genderArray,
            stats: parsedStatsArray,
            search: searchData
        }));

        return (
            <>
                <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 py-10">
                    {filteredPokemons.map((pokemon: any) => (
                        <CardWrapper key={pokemon.id} pokemonId={pokemon.id} pokemonName={pokemon?.name}>
                            <Card key={pokemon.id} imgWidth={100} imgHeight={100} cardHeight="h-60" cardWidth="w-40" pokemon={pokemon} />
                        </CardWrapper>
                    ))}

                </div>
                {
                    filteredPokemons.length < 1 && (
                        <div className="w-full h-[300px] flex items-center justify-center">
                            No Pokemons Found
                        </div>
                    )
                }
            </>
        );
    } catch (error) {
        return <div className="w-full h-screen bg-primary flex items-center justify-center text-[20px]">Pokemon not found</div>;
    }
}