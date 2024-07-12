import React, { useState, useCallback } from 'react';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { StatsList, TypeList, genderList} from '@/utils/data';
import { ListItem } from '@/utils/types';
import Button from '@/components/atoms/button/button';
import Title from '@/components/atoms/title/title';
import RangeSlider from '@/components/atoms/range-slider/range-slider';
import { APPLY_BUTTON_LABEL, DROPDOWN_LABELS, QUERY_GENDER, QUERY_TYPE, RESET_BUTTON_LABEL, SELECT_PLACEHOLDER } from '@/utils/constants';

interface ModalProps {
    onCancel: () => void;
    onReset: () => void;
    onApply: (data: { type: ListItem[], gender: ListItem[], stats: { name: string, min: number, max: number }[] }) => void;
    selectedTypes: ListItem[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<ListItem[]>>;
    selectedGenders: ListItem[];
    setSelectedGenders: React.Dispatch<React.SetStateAction<ListItem[]>>;
    selectedStats: { name: string, min: number, max: number }[];
    setSelectedStats: React.Dispatch<React.SetStateAction<{ name: string, min: number, max: number }[]>>;
}

export const handleButtonToggle = (buttonName: string) => (
    setActiveButton: React.Dispatch<React.SetStateAction<string>>
) => {
    setActiveButton(prevButton => prevButton === buttonName ? '' : buttonName);
};

export const handleSelect = (item: ListItem, type: string) => (
    setSelection: React.Dispatch<React.SetStateAction<ListItem[]>>,
    currentSelection: ListItem[]
) => {
    const updateSelection = (prevItems: ListItem[]) => {
        const itemIndex = prevItems.findIndex(i => i.id === item.id);
        return itemIndex !== -1
            ? prevItems.filter(i => i.id !== item.id)
            : [...prevItems, item];
    };
    setSelection(updateSelection);
};

export const handleRangeChange = (name: string, value: number[] | number) => (
    setSelectedStats: React.Dispatch<React.SetStateAction<{ name: string, min: number, max: number }[]>>
) => {
    const newValue = Array.isArray(value) ? { min: value[0], max: value[1] } : { min: value, max: value };
    setSelectedStats(prevStats => {
        const index = prevStats.findIndex(range => range.name === name);
        if (index !== -1) {
            const updatedStats = [...prevStats];
            updatedStats[index] = { name, ...newValue };
            return updatedStats;
        } else {
            return [...prevStats, { name, ...newValue }];
        }
    });
};

export const FilterOptionsModal: React.FC<ModalProps> = ({ 
    onCancel,
    onReset,
    onApply,
    selectedTypes,
    setSelectedTypes,
    selectedGenders,
    setSelectedGenders,
    selectedStats,
    setSelectedStats
 }) => {
    const [activeButton, setActiveButton] = useState<string>('');

    const handleButtonToggleCallback = useCallback((buttonName: string) => {
        handleButtonToggle(buttonName)(setActiveButton);
    }, []);

    const handleSelectCallback = useCallback((item: ListItem, type: string) => {
        if (type === QUERY_TYPE) {
            handleSelect(item, type)(setSelectedTypes, selectedTypes);
        } else if (type === QUERY_GENDER) {
            handleSelect(item, type)(setSelectedGenders, selectedGenders);
        }
    }, [setSelectedTypes, setSelectedGenders, selectedTypes, selectedGenders]);

    const handleRangeChangeCallback = useCallback((name: string, value: number[] | number) => {
        handleRangeChange(name, value)(setSelectedStats);
    }, [setSelectedStats]);

    const handleApply = () => {
        onApply({ type: selectedTypes, gender: selectedGenders, stats: selectedStats });
    };

    const renderFilterButton = (title: string, selectedItems: any[], placeholder: string = SELECT_PLACEHOLDER) => (
        <Button
            onClick={() => handleButtonToggleCallback(title)}
            customStyles={`w-full p-1 px-3 flex items-center justify-between rounded-lg border border-darkblue`}
            data-testid={`${title.toLowerCase()}-button`}
        >
            <div className='flex items-center w-full justify-between'>
                <Title title={title} customStyles='text-base w-2/5 flex items-center justify-start border-r border-gray-300 h-[90%]' />
                <div className='w-full flex items-center pl-2'>
                    <h3 className='text-sm font-light'>{selectedItems.length > 0 ? selectedItems[0].name : placeholder}</h3>
                    {selectedItems.length > 1 && (
                        <>
                            <span className='text-sm font-bold px-0.5'>{DROPDOWN_LABELS[0]}</span>
                            <p className='text-sm font-bold'>{selectedItems.length - 1} {DROPDOWN_LABELS[1]}</p>
                        </>
                    )}
                </div>
            </div>
            {activeButton === title ? <CiCircleMinus size={30} className='h-8' /> : <CiCirclePlus size={30} className='h-8' />}
        </Button>
    );

    const renderFilterContent = (title: string, items: ListItem[], selectedItems: ListItem[], handleItemSelect: (item: ListItem, type: string) => void) => (
        activeButton === title && (
            <div className={`bg-white z-10 p-3 w-full max-h-48 overflow-scroll hide-scrollbar rounded-lg border-2 shadow-xl transform origin-top transition-transform`} data-testid={`${title.toLowerCase()}-content`}>
                {items.map((item) => (
                    <div key={item.id} className="border-b-[1.25px] border-gray-300 pt-1 pb-0.5 w-full flex items-center">
                        <input
                            type="checkbox"
                            checked={!!selectedItems.find(i => i.name === item.name)}
                            onChange={() => handleItemSelect(item, title === 'Type' ? QUERY_TYPE : QUERY_GENDER)}
                            data-testid={`${title.toLowerCase()}-checkbox-${item.id}`}
                        />
                        <label className="inline-block w-[90%] text-[0.70rem] ml-2 font-medium tracking-wider hover:cursor-pointer">
                            {item.name}
                        </label>
                    </div>
                ))}
            </div>
        )
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-darkblue bg-opacity-70 z-50 p-10" data-testid="filter-modal">
            <div className="bg-white p-8 pb-0 rounded-lg max-w-lg mx-auto w-full max-h-screen h-full flex flex-col gap-5 overflow-y-scroll hide-scrollbar">
                <div className='flex items-center justify-between w-full p-3 border-b border-gray-200'>
                    <Title title='Filters' customStyles='text-2xl tracking-tight font-bold' />
                    <Button onClick={onCancel} icon={<IoIosCloseCircleOutline size={30} color='gray' />} data-testid="close-button" />
                </div>

                {renderFilterButton('Type', selectedTypes)}
                {renderFilterContent('Type', TypeList, selectedTypes, handleSelectCallback)}

                {renderFilterButton('Gender', selectedGenders)}
                {renderFilterContent('Gender', genderList, selectedGenders, handleSelectCallback)}

                {renderFilterButton('Stats', selectedStats)}
                {activeButton === 'Stats' && (
                    <div className={`bg-white z-10 p-3 w-full rounded-lg border-2 shadow-xl transform origin-top transition-transform`} data-testid="stats-content">
                        {StatsList.map((item) => (
                            <div key={item.id} className="p-1 my-2 flex items-center justify-between gap-2 flex-wrap">
                                <label className="text-sm font-medium text-darkblue w-full pl-1">{item.name}</label>
                                <div className="w-full border border-darkblue bg-slidercontainer rounded-lg">
                                    <RangeSlider<number[]>
                                        className="w-[80%] h-6"
                                        onAfterChange={(value) => handleRangeChangeCallback(item.name, value)}
                                        min={item.min}
                                        max={item.max}
                                        value={
                                            selectedStats.find(range => range.name === item.name)
                                                ? [selectedStats.find(range => range.name === item.name)!.min, selectedStats.find(range => range.name === item.name)!.max]
                                                : [item.min, item.max]
                                        }
                                        data-testid={`range-slider-${item.id}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center justify-between gap-5 border-t border-gray-500 h-16 mt-auto">
                    <Button onClick={onReset} customStyles="w-1/2 border border-darkblue font-semibold h-10 flex items-center justify-center" data-testid="reset-button">{RESET_BUTTON_LABEL}</Button>
                    <Button onClick={handleApply} customStyles="w-1/2 bg-darkblue text-white font-semibold h-10 flex items-center justify-center mb-1" data-testid="apply-button">{APPLY_BUTTON_LABEL}</Button>
                </div>
            </div>
        </div>
    );
};

export default FilterOptionsModal;

