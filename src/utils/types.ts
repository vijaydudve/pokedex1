export interface PokemonCard {
    id:string,
    image:string,
    name: string;
    height: number;
    weight: number;
    types: string[];
    abilities: string[];
    stats: { name: string; value: number }[];
    gender?: string[]
}

export interface ListItem {
    id: number;
    name: string;
}

export interface FilterOptions {
    types?: string[];
    genders?: string[];
    stats?: { name: string; min: number; max: number }[];
    search?: string;
  }


  export  interface EvolutionDetail {
    min_level: number;
    trigger: {
      name: string;
      url: string;
    };
  }
  
export  interface EvolutionChain {
    is_baby: boolean;
    species: {
      name: string;
      url: string;
    };
    evolves_to: EvolutionChain[];
    evolution_details: EvolutionDetail[];
  }
  
 export interface EvolutionChainResponse {
    id: number;
    baby_trigger_item: null | { name: string; url: string };
    chain: EvolutionChain;
  }

  export interface PokemonDetails {
    gender: any;
    name: string;
    id: number;
    image: string;
    types: string[];
    stats: { name: string; value: number }[];
    height: number;
    weight: number;
    abilities: string[];
  }
  
