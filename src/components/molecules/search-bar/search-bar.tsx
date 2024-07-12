"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { IoIosSearch } from 'react-icons/io';
import Input from '@/components/atoms/input/input';
import Button from '@/components/atoms/button/button';
import { IoCloseOutline } from "react-icons/io5";
import { QUERY_SEARCH, SEARCH } from '@/utils/constants';

export const createUrl = (pathname: string, params: URLSearchParams) => `${pathname}?${params.toString()}`;

const SearchBar: React.FC = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        const searchTerm = searchParams.get(QUERY_SEARCH);
        setSearch(searchTerm || '');
    }, [searchParams]);

    const handleSearch = (term:string)=> {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(QUERY_SEARCH, term);
        } else {
            params.delete(QUERY_SEARCH);
        }
        replace(createUrl(pathname, params));
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTerm = event.target.value;
        setSearch(newTerm);
        handleSearch(newTerm);
    };

    const handleClear = ()=>{
        setSearch('');
        handleSearch('');
    }

    return (
        <section className='flex flex-col w-full'>
        <label className='text-[13px] ml-2 mb-1 text-tertiary font-normal'>{SEARCH}</label>
        <div className='w-full h-[50px] lg:h-[40px] flex items-center py-1 rounded-lg bg-ice'>
            <Input
                type="text"
                name="search"
                placeholder="Name or Number"
                value={search}
                onChange={handleSearchChange}
                data-testid="search-input"
            />
            {
                search.length > 0 ? (
                    <Button 
                    icon={<IoCloseOutline size={28}/>} 
                    customStyles='p-2 pr-6 text-gray-800'
                    onClick={handleClear}
                    aria-label="Clear"
                    data-testid="clear-button"
                />
                ) : (
                    <Button 
                    icon={<IoIosSearch size={28} />} 
                    aria-label="Search"
                    customStyles='p-2 pr-6 text-gray-500'
                    data-testid="search-button"
                />
                )
            }
        </div>
        </section>
    );
};

export default SearchBar;