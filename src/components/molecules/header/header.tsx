import TitleDescription from '@/components/atoms/title-description/title-description';
import Title from '@/components/atoms/title/title';
import { HEADER_DESCRIPTION, HEADER_TITLE } from '@/utils/constants';
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className='h-24 flex flex-col md:flex-row md:items-center'>
        <Title title={HEADER_TITLE} customStyles='h-[45%] border-b border-lightblue md:w-36 md:border-r md:border-b-0 md:flex items-center md:h-1/2'/>
        <TitleDescription description={HEADER_DESCRIPTION} customStyles='h-[55%] flex items-center pt-2 md:w-[80%] md:pt-0 md:pl-10 md:h-1/2'/>
    </div>
  );
};

export default Header;