import Dropdown from '@/components/molecules/dropdown/dropdown';
import FilterMenuButton from '@/components/molecules/filter-menu-button/filter-menu-button';
import SearchBar from '@/components/molecules/search-bar/search-bar';
import { GENDER, STATS, TYPE } from '@/utils/constants';
import React from 'react';


const FilterOptions: React.FC = () => {
  return (
    <section className="flex items-center mt-3 justify-between h-14 gap-5 lg:gap-8">
      <SearchBar/>
      <div className="lg:flex hidden w-auto flex items-center justify-between gap-8">
        <Dropdown type={TYPE} height='40px' width='163px' optionsWidth='163px' customStyles='bg-ice'  />
        <Dropdown type={GENDER} height='40px' width='163px' optionsWidth='163px' customStyles='bg-ice' />
        <Dropdown type={STATS} height='40px' width='163px' optionsWidth='553px' customStyles='bg-ice' />
    </div>
    <div className="lg:hidden w-20 mt-6 flex items-center justify-between">
      <FilterMenuButton />
    </div>
    </section>
  );
};

export default FilterOptions;