import PokemonDetailsLoader from '@/components/atoms/loader/detailpage-loader';
import DetailPageURLUpdate from '@/components/organisms/detailpage-client-wrapper/detailpage-client-wrapper';
import PokemonDetails from '@/components/organisms/pokemon-detail/pokemon-detail';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface Props {
  params: { id: string, name: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Pokémon #${params.id} Details`,
    description: `Detailed information about Pokémon #${params.id}`,
  };
}


export default async function PokemonDetailPage({ params }: Props) {
  return (
    <>
      <DetailPageURLUpdate pokemonId={params.id} pokemonName={params.name} />
      <Suspense fallback={<PokemonDetailsLoader/>}>
        <PokemonDetails pokemonId={params.id} />
      </Suspense>
    </>
  );
}

// import PokemonDetailsLoader from '@/components/atoms/loader/detailpage-loader';
// import DetailPageURLUpdate from '@/components/organisms/detailpage-client-wrapper/detailpage-client-wrapper';
// import PokemonDetails from '@/components/organisms/pokemon-detail/pokemon-detail';
// import { Metadata } from 'next';
// import { Suspense } from 'react';

// interface Props {
//   params: { id: string; name: string };
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   return {
//     title: `Pokémon #${params?.id} Details`,
//     description: `Detailed information about Pokémon #${params?.id}`,
//   };
// }

// interface Pokemon {
//   name: string;
//   url: string;
// }

// async function fetchPokemonList(): Promise<Pokemon[]> {
//   const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
//   const data = await response.json();
//   return data.results;
// }

// export async function generateStaticParams() {
//   const pokemonList = await fetchPokemonList();

//   return pokemonList.map((pokemon: Pokemon, index: number) => ({
//     id: (index + 1).toString(),
//     name: pokemon.name,
//   }));
// }

// export default async function PokemonDetailPage({ params }: Props) {
//   return (
//     <>
//       <DetailPageURLUpdate pokemonId={params?.id} pokemonName={params?.name} />
//       <Suspense fallback={<PokemonDetailsLoader />}>
//         <PokemonDetails pokemonId={params?.id} />
//       </Suspense>
//     </>
//   );
// }