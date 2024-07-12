import { FilterOptions } from "./types";

export const padId =(id: number)=> {
    return String(id).padStart(3, '0');
  }

export const genderFromGenderRate = (genderRate:number)=>{
    switch (genderRate) {
        case 0:
          return ['male'];
        case 8:
          return ['female'];
        case -1:
          return ['genderless'];
        default:
          return ['male', 'female'];
      }
}

export const filterPokemon=(pokemon: any, filters: FilterOptions): boolean=> {
    const { types, genders, stats, search } = filters;
  
    const hasTypes = !types?.length || types.every(type => pokemon.types.includes(type.toLowerCase()));
    const hasGenders = !genders?.length || genders.every(gender => 
      pokemon.gender.map((g: string) => g.toLowerCase()).includes(gender.toLowerCase())
    );
    const hasStats = !stats?.length || stats.every(stat => {
      const pokemonStat = pokemon.stats.find((s: any) => s.name === stat.name);
      return pokemonStat && pokemonStat.value >= stat.min && pokemonStat.value <= stat.max;
    });
    const matchesSearch = !search || pokemon.name.toLowerCase().includes(search.toLowerCase());
  
    return hasTypes && hasGenders && hasStats && matchesSearch;
  }