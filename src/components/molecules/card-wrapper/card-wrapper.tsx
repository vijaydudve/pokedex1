'use client'
import { HOME_PAGE_ROUTE } from '@/utils/constants';
import { padId } from '@/utils/helper';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  pokemonId: string | number;
  pokemonName: string | ''
}

const CardWrapper = ({ children, pokemonId, pokemonName }: Props) => {

  const handleClick = () => {
    const previousUrl = window.location.pathname + window.location.search
    localStorage.setItem("previous-url", JSON.stringify(previousUrl))
  };

  return (
    <Link
      key={pokemonId}
      aria-label={`${pokemonName}, ID: ${padId(Number(pokemonId))}`}
      href={`${HOME_PAGE_ROUTE}/${pokemonName}/${pokemonId}`}
      passHref
      className='w-[97%] rounded-md flex justify-center'
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default CardWrapper;
