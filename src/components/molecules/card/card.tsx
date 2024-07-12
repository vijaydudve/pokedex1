import Image from 'next/image';
import { padId } from '@/utils/helper';
import { PokemonCard } from '@/utils/types';

interface CardProps {
  onlyView?: boolean;
  imgHeight?: number;
  imgWidth?: number;
  pokemon: PokemonCard;
  cardWidth?: string;
  cardHeight?: string;
}

const Card = ({
  onlyView = false,
  imgHeight,
  imgWidth,
  pokemon,
  cardWidth = 'w-48',
  cardHeight = 'h-64',
}: CardProps) => {
  let fromcolor = '', endcolor = '';
  switch (pokemon?.types[0]?.toLowerCase()) {
    case 'normal':
      fromcolor = 'from-normal';
      break;
    case 'ice':
      fromcolor = 'from-ice';
      break;
    case 'fighting':
      fromcolor = 'from-fighting';
      break;
    case 'flying':
      fromcolor = 'from-flying';
      break;
    case 'poison':
      fromcolor = 'from-poison';
      break;
    case 'ground':
      fromcolor = 'from-ground';
      break;
    case 'rock':
      fromcolor = 'from-rock';
      break;
    case 'bug':
      fromcolor = 'from-bug';
      break;
    case 'ghost':
      fromcolor = 'from-ghost';
      break;
    case 'steel':
      fromcolor = 'from-steel';
      break;
    case 'fire':
      fromcolor = 'from-fire';
      break;
    case 'water':
      fromcolor = 'from-water';
      break;
    case 'grass':
      fromcolor = 'from-grass';
      break;
    case 'electric':
      fromcolor = 'from-electric';
      break;
    case 'psychic':
      fromcolor = 'from-psychic';
      break;
    case 'dragon':
      fromcolor = 'from-dragon';
      break;
    case 'dark':
      fromcolor = 'from-dark';
      break;
    case 'fairy':
      fromcolor = 'from-fairy';
      break;
    default:
      fromcolor = '';
      break;
  }



  switch (pokemon?.types[1]?.toLowerCase() || pokemon?.types[0]?.toLowerCase()) {
    case 'normal':
      endcolor = 'to-normal';
      break;
    case 'ice':
      endcolor = 'to-ice';
      break;
    case 'fighting':
      endcolor = 'to-fighting';
      break;
    case 'flying':
      endcolor = 'to-flying';
      break;
    case 'poison':
      endcolor = 'to-poison';
      break;
    case 'ground':
      endcolor = 'to-ground';
      break;
    case 'rock':
      endcolor = 'to-rock';
      break;
    case 'bug':
      endcolor = 'to-bug';
      break;
    case 'ghost':
      endcolor = 'to-ghost';
      break;
    case 'steel':
      endcolor = 'to-steel';
      break;
    case 'fire':
      endcolor = 'to-fire';
      break;
    case 'water':
      endcolor = 'to-water';
      break;
    case 'grass':
      endcolor = 'to-grass';
      break;
    case 'electric':
      endcolor = 'to-electric';
      break;
    case 'psychic':
      endcolor = 'to-psychic';
      break;
    case 'dragon':
      endcolor = 'to-dragon';
      break;
    case 'dark':
      endcolor = 'to-dark';
      break;
    case 'fairy':
      endcolor = 'to-fairy';
      break;
    default:
      endcolor = '';
      break;
  }
  const cardClasses = `
    border-dashed border-[1.5px] border-bordercolor rounded-lg 
    overflow-hidden flex flex-col p-3 gap-3 items-center
    bg-gradient-to-b ${fromcolor} ${endcolor} 
    ${onlyView ? '' : 'cursor-pointer'} 
    ${cardHeight} ${cardWidth}
  `;

  const imageClasses = `
    object-contain 
    ${onlyView ? 'h-full' : 'px-5 pt-3 h-3/4'} 
    w-full
  `;

  return (
    <article
      className={cardClasses}
      key={pokemon.id}
    >
      <Image 
        src={pokemon?.image}
        alt={`${pokemon.id} is pokemon id of ${pokemon.name}`}
        height={imgHeight} 
        width={imgWidth} 
        className={imageClasses}
      />
      {!onlyView && (
        <div className='flex flex-col items-center justify-center'>
          <h2 className="font-bold text-base mb-0">{pokemon?.name}</h2>
          <p className="text-base">{padId(Number(pokemon?.id))}</p>
        </div>
      )}
    </article>
  );
};

export default Card;