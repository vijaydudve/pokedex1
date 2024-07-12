'use client'
import Button from "@/components/atoms/button/button";
import React, { useState, useCallback, useEffect } from "react";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import FilterOptionsModal from "../filter-option-modal/filter-option-modal";
import { ListItem } from "@/utils/types";
import { useRouter, useSearchParams } from 'next/navigation';
import { HOME_PAGE_ROUTE, QUERY_GENDER, QUERY_STATS, QUERY_TYPE } from "@/utils/constants";
import { TypeList, genderList } from "@/utils/data";


const FilterMenuButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState<ListItem[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<ListItem[]>([]);
    const [selectedStats, setSelectedStats] = useState<{ name: string, min: number, max: number }[]>([]);

    const router = useRouter();
    const searchParams = useSearchParams();

    const updateQueryString = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());

        const typeItems = selectedTypes.map(i => i.name).join('%');
        if (typeItems) {
            params.set(QUERY_TYPE, typeItems);
        } else {
            params.delete(QUERY_TYPE);
        }

        const genderItems = selectedGenders.map(i => i.name).join('%');
        if (genderItems) {
            params.set(QUERY_GENDER, genderItems);
        } else {
            params.delete(QUERY_GENDER);
        }

        const statQueryStrings = selectedStats.map(stat => `${encodeURIComponent(stat.name)}=${stat.min}-${stat.max}`);
        if (statQueryStrings.length > 0) {
            params.set(QUERY_STATS, `[${statQueryStrings.join('%')}]`);
        } else {
            params.delete(QUERY_STATS);
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams, selectedTypes, selectedGenders, selectedStats]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        const typesParam = params.get(QUERY_TYPE);
        if (typesParam) {
            const types = typesParam.split('%')
                .filter(name => TypeList.some(type => type.name.toLowerCase() === name.toLowerCase()))
                .map(name => {
                    const matchedType = TypeList.find(type => type.name.toLowerCase() === name.toLowerCase());
                    return { id: matchedType?.id, name: matchedType?.name || name };
                });
            setSelectedTypes(types as any);
        }
    
        const gendersParam = params.get(QUERY_GENDER);
        if (gendersParam) {
            const genders = gendersParam.split('%')
                .filter(name => genderList.some(gender => gender.name.toLowerCase() === name.toLowerCase()))
                .map(name => {
                    const matchedGender = genderList.find(gender => gender.name.toLowerCase() === name.toLowerCase());
                    return { id: matchedGender?.id || name, name: matchedGender?.name || name };
                });
            setSelectedGenders(genders as any);
        }

        const statsParam = params.get(QUERY_STATS);
        if (statsParam) {
            const statsString = statsParam.slice(1, -1);
            const statsPairs = statsString.split('%');
            const parsedStats = statsPairs.map(pair => {
                const [name, range] = pair.split('=');
                const [min, max] = range.split('-').map(Number);
                return { name: decodeURIComponent(name), min, max };
            });
            setSelectedStats(parsedStats);
        }
    }, [searchParams]);

    const handleApply = useCallback(() => {
        updateQueryString();
        setIsModalOpen(false);
    }, [updateQueryString]);

    const handleReset = useCallback(() => {
        setSelectedTypes([]);
        setSelectedGenders([]);
        setSelectedStats([]);
        router.replace(HOME_PAGE_ROUTE, { scroll: false });
    }, [router]);

    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleModalOpen = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    return (
        <>
            <Button 
                onClick={handleModalOpen} 
                icon={<TbAdjustmentsHorizontal size={40} className="text-white" />} 
                customStyles="bg-darkblue flex items-center py-1 justify-center w-full rounded-lg" 
            />
            {isModalOpen && (
                <FilterOptionsModal
                    onCancel={handleCancel}
                    onApply={handleApply}
                    onReset={handleReset}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    selectedGenders={selectedGenders}
                    setSelectedGenders={setSelectedGenders}
                    selectedStats={selectedStats}
                    setSelectedStats={setSelectedStats}
                />
            )}
        </>
    );
};

export default FilterMenuButton;