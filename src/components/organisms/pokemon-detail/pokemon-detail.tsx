import React from "react";
import Button from "@/components/atoms/button/button";
import TitleDescription from "@/components/atoms/title-description/title-description";
import Title from "@/components/atoms/title/title";
import Card from "@/components/molecules/card/card";
import CloseButton from "@/components/molecules/close-button/close-button";
import DescriptionModal from "@/components/molecules/description-modal/description-modal";
import { fetchPokemonDescription, fetchPokemonDetails, fetchPokemonEggGroups, fetchPokemonEvolutionChain, fetchPokemonWeakAgainst } from "@/services/pokemon-service";
import { ABILITIES_TITLE, EGG_GROUPS_TITLE, EVOLUTION_CHAIN_TITLE, GENDER_TITLE, HEIGHT_TITLE, HOME_PAGE_ROUTE, NEXT_BUTTON_LABEL, PREVIOUS_BUTTON_LABEL, STATS_DETAIL_TITLE, TYPES_TITLE, WEAK_AGAINST_TITLE, WEIGHT_TITLE } from "@/utils/constants";
import { padId } from "@/utils/helper";
import Link from "next/link";
import { BsArrowLeftCircle, BsArrowRight, BsArrowRightCircle } from 'react-icons/bs';
import { HiMiniArrowLongRight, HiMiniArrowLongLeft } from "react-icons/hi2";

export default async function PokemonDetails({ pokemonId }: { pokemonId: string }) {
    try {
        const [pokemonDetails, pokemonDescription, pokemonEggGroups, pokemonWeakAgainst, pokemonEvolutionChain, nextPokemon, prevPokemon] = await Promise.all([
            fetchPokemonDetails(Number(pokemonId)),
            fetchPokemonDescription(pokemonId),
            fetchPokemonEggGroups(pokemonId),
            fetchPokemonWeakAgainst(pokemonId),
            fetchPokemonEvolutionChain(pokemonId),
            fetchPokemonDetails((Number(pokemonId) + 1)),
            Number(pokemonId) > 1 ? fetchPokemonDetails(Number(pokemonId) - 1) : fetchPokemonDetails(Number(pokemonId))
        ]);

        const getTypeColor = (type: string) => {
            const typeColors: { [key: string]: string } = {
                normal: 'bg-normal',
                ice: 'bg-ice',
                fighting: 'bg-fighting',
                flying: 'bg-flying',
                poison: 'bg-poison',
                ground: 'bg-ground',
                rock: 'bg-rock',
                bug: 'bg-bug',
                ghost: 'bg-ghost',
                steel: 'bg-steel',
                fire: 'bg-fire',
                water: 'bg-water',
                grass: 'bg-grass',
                electric: 'bg-electric',
                psychic: 'bg-psychic',
                dragon: 'bg-dragon',
                dark: 'bg-dark',
                fairy: 'bg-fairy',
            };
            return typeColors[type.toLowerCase()] || '';
        }

        return (
            <div className="bg-secondary w-full h-screen m-auto">
                <main className='h-screen overflow-y-scroll hide-scrollbar p-8 max-w-2xl w-full bg-primary p-4 relative m-auto'>
                    <div className="flex md:hidden flex-col justify-center relative h-64 gap-5">
                        <div className=' w-full flex flex-col justify-between '>
                            <div className='flex justify-between mt-10'>
                                <div data-testid="pokemon-name-id">
                                    <Title title={pokemonDetails ? pokemonDetails.name.toUpperCase() : ""} customStyles='text-2xl' />
                                    <Title title={pokemonDetails ? padId(Number(pokemonDetails.id)) : ''} customStyles='font-medium text-xl' />
                                </div>
                                <CloseButton size={25} />
                            </div>
                        </div>
                        <div data-testid="pokemon-image" className='w-full h-full flex h-56 items-center justify-between gap-5'>
                            <Card
                                onlyView={true}
                                cardHeight="h-56"
                                cardWidth="w-48"
                                imgHeight={200}
                                imgWidth={200}
                                pokemon={pokemonDetails as any}
                            />
                            <div data-testid="pokemon-description" className="flex flex-col w-3/5 h-full">
                                <p className='text-sm text-darkblue max-h-52 overflow-hidden'>{pokemonDescription}</p>
                                <DescriptionModal description={pokemonDescription} customStyles="top-[320px]" />
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center justify-between relative h-64 gap-3">
                        <div className='w-1/3 flex justify-between '>
                            <Card
                                onlyView={true}
                                cardHeight="h-64"
                                cardWidth="w-44"
                                imgHeight={200}
                                imgWidth={200}
                                pokemon={pokemonDetails as any}
                            />
                        </div>
                        <div className='w-2/3 flex flex-col h-full'>
                            <div className='flex items-center justify-between mt-1 mb-9'>
                                <div className=' w-2/3 flex items-center justify-between'>
                                    <Title title={pokemonDetails ? (pokemonDetails.name).toUpperCase() : ""} customStyles='text-2xl border-r border-darkblue pr-5' />
                                    <Title title={pokemonDetails ? padId(Number(pokemonDetails.id)) : ''} customStyles='font-medium text-xl border-r border-darkblue pr-5' />
                                </div>
                                <div className='flex h-full items-center justify-center gap-2'>
                                    <Link href={`${HOME_PAGE_ROUTE}/${prevPokemon.name}/${Number(pokemonId) - 1}`} passHref aria-label="Previous Pokemon">
                                        <span className="cursor-pointer"><BsArrowLeftCircle size={20} /></span>
                                    </Link>
                                    <CloseButton size={20} />
                                    <Link href={`${HOME_PAGE_ROUTE}/${nextPokemon.name}/${Number(pokemonId) + 1}`} passHref aria-label="Next Pokemon">
                                        <span className="cursor-pointer"><BsArrowRightCircle size={20} /></span>
                                    </Link>
                                </div>
                            </div>
                            <p className='text-sm text-darkblue max-h-40 w-full overflow-hidden'>{pokemonDescription}</p>
                            <DescriptionModal description={pokemonDescription} />
                        </div>
                    </div>


                    <div data-testid="pokemon-details" className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 md:my-5">
                        <div className="p-4 truncate">
                            <Title title={HEIGHT_TITLE} customStyles='text-sm tracking-normal mb-2' />
                            <TitleDescription
                                description={pokemonDetails ?
                                    (() => {
                                        let temp = pokemonDetails.height * 10 * 0.0328084;
                                        let ft = Math.ceil(temp * 10) / 10;
                                        return ft.toFixed(1).replace('.', '\'') + '"';
                                    })()
                                    : ''
                                }
                                customStyles='text-sm text-slate-950 font-[300]' />
                        </div>
                        <div className="p-4 truncate">
                            <Title title={WEIGHT_TITLE} customStyles='text-sm tracking-normal mb-2' />
                            <TitleDescription
                                description={pokemonDetails ? `${(pokemonDetails.weight / 10).toFixed(1)} kg` : ''}
                                customStyles='text-sm text-slate-950 font-[300]'
                            />
                        </div>
                        <div className="p-4 truncate">
                            <Title title={GENDER_TITLE} customStyles='text-sm tracking-normal mb-2' />
                            <TitleDescription description={pokemonDetails ? pokemonDetails?.gender?.join(', ') : ''} customStyles='text-sm text-slate-950 font-[300]' />
                        </div>
                        <div className="p-4 truncate">
                            <Title title={EGG_GROUPS_TITLE} customStyles='text-sm tracking-normal mb-2' />
                            <TitleDescription description={pokemonEggGroups ? pokemonEggGroups.map((obj: { name: string; url: string }) => obj.name).join(', ') : ''} customStyles='text-sm text-slate-950 font-[300]' />
                        </div>
                    </div>
                    <div data-testid="pokemon-abilities-types-weaknesses" className="flex flex-wrap my-5">
                        <div className="w-1/2 lg:w-1/4 p-4">
                            <Title title={ABILITIES_TITLE} customStyles='text-sm tracking-normal mb-1' />
                            <TitleDescription description={pokemonDetails ? pokemonDetails.abilities.join(', ') : ''} customStyles='text-sm text-slate-950 font-[300]' />
                        </div>
                        <div className="w-1/2 lg:w-1/4 p-4">
                            <Title title={TYPES_TITLE} customStyles='text-sm tracking-normal ' />
                            <div className='flex items-center flex-wrap'>
                                {
                                    pokemonDetails?.types.map((type: string) => (
                                        <TitleDescription key={type} description={type} customStyles={`text-sm text-slate-950 font-[300] flex items-center justify-center m-1 px-1 rounded border border-black ${getTypeColor(type)}`} />
                                    ))
                                }
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 p-4">
                            <Title title={WEAK_AGAINST_TITLE} customStyles='text-sm tracking-normal' />
                            <div className='flex items-center flex-wrap'>
                                {
                                    pokemonWeakAgainst.map((item: any) => (
                                        <TitleDescription key={item} description={item} customStyles={`text-sm text-slate-950 font-[300] flex items-center justify-center m-1 px-1 rounded border border-black ${getTypeColor(item)}`} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div data-testid="pokemon-stats" className='bg-pastelblue md:w-full flex flex-col justify-center p-5 rounded-lg my-5'>
                        <Title title={STATS_DETAIL_TITLE} customStyles='text-lg' />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2 mt-3">
                            {
                                pokemonDetails?.stats.map((item: any) => (
                                    <div key={item.name} className="w-full flex items-center justify-between ">
                                        <Title title={item.name} customStyles='text-xs w-1/3 font-medium truncate' />
                                        <div className="w-3/4 h-3 bg-bluegray ">
                                            <div style={{ width: `${item.value > 100 ? 100 : item.value}%` }} className="bg-darkblue h-3 text-white flex items-center text-[11px] pb-0.5 font-normal pl-1">{item.value}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div data-testid="pokemon-evolution" className="flex flex-col relative my-5">
                        <Title title={EVOLUTION_CHAIN_TITLE} customStyles='text-lg mb-3' />
                        <div className='w-full max-w-md mx-auto md:hidden gap-2 flex h-full items-center justify-between'>
                            {
                                pokemonEvolutionChain.map((item, index) => (
                                    <React.Fragment key={item.id || index}>
                                        <Card
                                            cardHeight="h-36"
                                            cardWidth="w-28"
                                            onlyView={true}
                                            imgHeight={100}
                                            imgWidth={100}
                                            pokemon={item}
                                        />
                                        {index < pokemonEvolutionChain.length - 1 && <BsArrowRight size={30} />}
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    </div>
                    <div className='w-full hidden md:flex items-center justify-between'>
                        {
                            pokemonEvolutionChain.map((item, index) => (
                                <React.Fragment key={item.id || index}>
                                    <Card
                                        cardHeight="h-48"
                                        cardWidth="w-36"
                                        imgHeight={100}
                                        imgWidth={100}
                                        pokemon={item}
                                    />
                                    {index < pokemonEvolutionChain.length - 1 && <BsArrowRight size={30} />}
                                </React.Fragment>
                            ))
                        }
                    </div>
                    <div data-testid="pokemon-navigation" className="w-full flex md:hidden items-center justify-between mt-10 gap-5">
                        <Link href={`${HOME_PAGE_ROUTE}/${prevPokemon.name}/${Number(pokemonId) - 1}`} passHref aria-label="Previous Pokemon">
                            <Button customStyles="w-36 px-5 bg-darkblue text-white font-semibold py-2 flex items-center justify-around gap-3">
                                <span className="pb-0.5 font-bold"><HiMiniArrowLongLeft size={20} /></span>
                                <span className="pb-0.5">{prevPokemon.name || PREVIOUS_BUTTON_LABEL}</span>
                            </Button>
                        </Link>
                        <Link href={`${HOME_PAGE_ROUTE}/${nextPokemon.name}/${Number(pokemonId) + 1}`} passHref aria-label="Next Pokemon">
                            <Button customStyles="w-36 px-5 bg-darkblue text-white font-semibold py-2 flex items-center justify-center gap-3">
                                <span className="pb-1">{nextPokemon.name || NEXT_BUTTON_LABEL}</span>
                                <span className="pb-0.5"><HiMiniArrowLongRight size={20} fontWeight={700} /></span>
                            </Button>
                        </Link>
                    </div>
                </main>
            </div>
        );

    } catch (error) {
        return <div>Pokemon not found</div>;
    }
}

