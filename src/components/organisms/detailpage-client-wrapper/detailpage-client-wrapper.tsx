'use client'

import { HOME_PAGE_ROUTE } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DetailPageURLUpdate({ pokemonId,pokemonName,children }: { pokemonId: string,pokemonName:string,children?:React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`${HOME_PAGE_ROUTE}/${pokemonName}/${pokemonId}`);
  }, [pokemonId,pokemonName, router]);

  return <>{children}</>;
}