import PokemonListLoader from "@/components/atoms/loader/pokemonlist-loader";
import Header from "@/components/molecules/header/header";
import Pagination from "@/components/molecules/pagination/pagination";
import FilterOptions from "@/components/organisms/filter-options/filter-options";
import PokemonList from "@/components/organisms/pokemon-list/pokemon-list";
import { Metadata } from "next";
import { Suspense } from "react";

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const currentPage = Number(searchParams.page) || 1;

    return {
        title: `Pokémon List - Page ${currentPage}`,
        description: `Browse through a list of Pokémon on page ${currentPage} with filtering and pagination options.`,
    };
}

export default async function PokemonPage({ searchParams }: Props) {
    const currentPage = Number(searchParams?.page) || 1;
    const itemsPerPage = 20;
    const totalItems = 1000;
    return (
        <main className="max-w-screen-xl min-h-screen mx-auto h-full px-8 py-16 md:px-16 md:py-0 bg-primary">
            <Header />
            <Suspense fallback={<div data-testid="filter-loading">Loading filters...</div>}>
                <FilterOptions/>
            </Suspense>
            <Suspense fallback={<PokemonListLoader/>}>
                <PokemonList searchParams={searchParams} />
            </Suspense>
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
            />
        </main>
    );
}