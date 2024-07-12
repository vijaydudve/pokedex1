"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { ListItem } from '@/utils/types';
import { StatsList, TypeList, genderList } from '@/utils/data';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/atoms/button/button';
import dynamic from 'next/dynamic';
import { APPLY_BUTTON_LABEL, DROPDOWN_LABELS, GENDER, QUERY_STATS, RESET_BUTTON_LABEL, SELECT_PLACEHOLDER, STATS, STATS_TITLE, TYPE } from '@/utils/constants';

const RangeSlider = dynamic(() => import('@/components/atoms/range-slider/range-slider'), {
    loading: () => <p>Loading...</p>,
    ssr: false
});

interface DropdownProps {
    type: 'Type' | 'Stats' | 'Gender';
    height?: string;
    width?: string;
    optionsWidth?: string;
    customStyles?: string;
    data?: ListItem[]
}

export const handleRangeChange = (
    setSelectedStats: React.Dispatch<React.SetStateAction<{ name: string; min: number; max: number; }[]>>,
    name: string,
    value: number | number[]
) => {
    const newValue = Array.isArray(value)
        ? { min: value[0], max: value[1] }
        : { min: value, max: value };
    setSelectedStats(prev => {
        const index = prev.findIndex(range => range.name === name);
        if (index !== -1) {
            const updatedRanges = [...prev];
            updatedRanges[index] = { name, ...newValue };
            return updatedRanges;
        } else {
            return [...prev, { name, ...newValue }];
        }
    });
};

export const updateQueryString = (
    router: ReturnType<typeof useRouter>,
    searchParams: ReturnType<typeof useSearchParams>,
    items: ListItem[],
    paramName: string
) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    const newItems = items.map(i => i.name).join('%');
    if (newItems) {
        params.set(paramName, newItems);
    } else {
        params.delete(paramName);
    }
    // router.replace(`?${params.toString()}`, { scroll: false });
    router.push(`?${params.toString()}`, { scroll: false });
    // window.history.pushState(null, '', `?${params.toString()}`)

};

export const handleSelect = (
    setSelectedItems: React.Dispatch<React.SetStateAction<ListItem[]>>,
    updateQueryString: (items: ListItem[], paramName: string) => void,
    type: string,
    item: ListItem
) => {
    setSelectedItems(prev => {
        const isSelected = prev.find(i => i.id === item.id);
        const updatedItems = isSelected
            ? prev.filter(i => i.id !== item.id)
            : [...prev, item];
        updateQueryString(updatedItems, type.toLowerCase());
        return updatedItems;
    });
};

export const handleApplyStatFilters = (
    router: ReturnType<typeof useRouter>,
    searchParams: ReturnType<typeof useSearchParams>,
    selectedStats: { name: string; min: number; max: number; }[],
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    const statQueryStrings = selectedStats.map(stat => `${encodeURIComponent(stat.name)}=${stat.min}-${stat.max}`);
    if (statQueryStrings.length > 0) {
        params.set(QUERY_STATS, `[${statQueryStrings.join('%')}]`);
    } else {
        params.delete(QUERY_STATS);
    }
    // router.replace(`?${params.toString()}`, { scroll: false });
    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
};

export const Dropdown: React.FC<DropdownProps> = ({
    type,
    customStyles,
    height,
    width,
    optionsWidth,
    data,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
    const [selectedStats, setSelectedStats] = useState<{ name: string, min: number, max: number }[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const getDropdownLabel = () => {
        if (type === STATS) {
            const count = selectedStats.length;
            if (count === 0) return SELECT_PLACEHOLDER;
            if (count === 1) return `${selectedStats[0].name}`;
            return (
                <div className='flex items-center'>
                    <p className='text-xs'>{selectedStats[0].name}</p>
                    <span className='text-xs font-bold px-0.5'>{DROPDOWN_LABELS[0]}</span>
                    <p className='text-xs font-bold'>{count - 1} {DROPDOWN_LABELS[1]}</p>
                </div>
            );
        }
        return selectedItems.length > 0 ? selectedItems[0].name : SELECT_PLACEHOLDER;
    };

    const handleRangeChangeCallback = useCallback((name: string, value: number | number[]) => {
        handleRangeChange(setSelectedStats, name, value);
    }, []);

    const updateQueryStringCallback = useCallback((items: ListItem[], paramName: string) => {
        updateQueryString(router, searchParams, items, paramName);
    }, [router, searchParams]);

    const handleSelectCallback = useCallback((item: ListItem) => {
        handleSelect(setSelectedItems, updateQueryStringCallback, type, item);
    }, [type, updateQueryStringCallback]);

    const handleApplyStatFiltersCallback = useCallback(() => {
        handleApplyStatFilters(router, searchParams, selectedStats, setIsOpen);
    }, [selectedStats, router, searchParams]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        const paramValue = params.get(type.toLowerCase());
        if (paramValue) {
            const itemList = type === TYPE ? TypeList : type === GENDER ? genderList : [];
            const items = paramValue.split('%').map(name => itemList.find(t => t.name === name)).filter(Boolean) as ListItem[];
            setSelectedItems(items);
        }

        if (type === STATS) {
            const statsParam = params.get(QUERY_STATS);
            if (statsParam) {
                const statsString = statsParam.slice(1, -1);
                const statsPairs = statsString.split('%');
                const parsedStats = statsPairs.map(pair => {
                    const [name, range] = pair.split('=');
                    const [min, max] = range.split('-').map(Number);
                    return { name, min, max };
                });
                setSelectedStats(parsedStats);
            }
        }
    }, [searchParams, type]);

    const itemList = type === TYPE ? TypeList : type === GENDER ? genderList : [];

    return (
        <section className='flex flex-col'>
            <label className='text-[13px] ml-2 mb-1 text-tertiary font-normal'>{type}</label>
            <div className={`relative flex items-center justify-end rounded-lg ${customStyles}`} style={{ height, width }} ref={dropdownRef}>
                <Button
                    onClick={() => setIsOpen((prev) => !prev)}
                    customStyles={`w-full p-1 px-3 flex items-center justify-between rounded-lg border-transparent ${isOpen ? 'bg-white duration-300' : 'duration-300'}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    data-testid="dropdown-button"
                >
                    <div className='flex items-center'>
                        <h3 className='text-xs font-light' data-testid="selected-item">
                            {getDropdownLabel()}
                        </h3>
                        {type !== STATS && selectedItems.length > 1 && (
                            <>
                                <span className='text-xs font-bold px-0.5'>{DROPDOWN_LABELS[0]}</span>
                                <p className='text-xs font-bold'>{selectedItems.length - 1} {DROPDOWN_LABELS[1]}</p>
                            </>
                        )}
                    </div>
                    {!isOpen ? (
                        <MdOutlineKeyboardArrowDown className='h-8' aria-hidden="true" />
                    ) : (
                        <MdOutlineKeyboardArrowUp className='h-8' aria-hidden="true" />
                    )}
                </Button>
                {isOpen && (
                    <div
                        style={{ width: optionsWidth }}
                        className={`bg-white z-10 p-3 ${type===TYPE && 'h-52 overflow-scroll hide-scrollbar'} rounded-lg absolute top-10 mt-1 border-2 shadow-xl transform origin-top transition-transform scale-y-100 opacity-100 transition ease-out duration-300`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        {(type === TYPE || type === GENDER) && (
                            itemList?.map((item, index) => (
                                <div key={index} className="border-b-[1.25px] border-gray-300 pt-1 pb-0.5 w-full flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${item.id}`}
                                        checked={!!selectedItems.find(i => i.id === item.id)}
                                        onChange={() => handleSelectCallback(item)}
                                        aria-label={item.name}
                                        data-testid='type-checkbox'
                                    />
                                    <label
                                        className="inline-block w-[90%] text-[0.70rem] ml-2 font-medium traking-wider hover:cursor-pointer"
                                        htmlFor={`checkbox-${item.id}`}
                                        data-testid='type-label'
                                    >
                                        {item.name}
                                    </label>
                                </div>
                            ))
                        )}
                        

                        {type === STATS && (
                            <>
                                <div className='flex items-center justify-between p-1 mb-5'>
                                    <h2 className='text-2xl font-bold text-darkblue'>{STATS_TITLE}</h2>
                                    <Button
                                        icon={<IoIosCloseCircleOutline size={22} color='gray' aria-hidden="true" />}
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close stats selection"
                                    />
                                </div>
                                {StatsList.map((item) => (
                                    <div key={item.id} className="p-1 my-2 flex items-center justify-between flex-wrap">
                                        <label className="text-sm font-medium text-darkblue" htmlFor={`range-${item.id}`}>{item.name}</label>
                                        <div className="w-[70%] border border-darkblue bg-slidercontainer rounded-lg">
                                            <RangeSlider
                                                className="w-[80%] h-6"
                                                onAfterChange={(value) => handleRangeChangeCallback(item.name, value as number)}
                                                min={item.min}
                                                max={item.max}
                                                value={
                                                    selectedStats.find(range => range.name === item.name)
                                                        ? [selectedStats.find(range => range.name === item.name)!.min, selectedStats.find(range => range.name === item.name)!.max]
                                                        : [item.min, item.max]
                                                }
                                                aria-label={`Set range for ${item.name}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className='p-1 flex items-center justify-end gap-2 mt-5'>
                                    <Button
                                        label={RESET_BUTTON_LABEL}
                                        customStyles='bg-white border w-[4.5rem] h-[2rem] font-semibold text-xs border-darkblue flex items-center justify-center'
                                        onClick={() => setSelectedStats([])}
                                        aria-label="Reset stats filters"
                                    />
                                    <Button
                                        label={APPLY_BUTTON_LABEL}
                                        customStyles='bg-darkblue w-[4.5rem] h-[2rem] font-semibold text-white text-xs flex items-center justify-center px-3 py-1'
                                        onClick={handleApplyStatFiltersCallback}
                                        aria-label="Apply stats filters"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default React.memo(Dropdown);