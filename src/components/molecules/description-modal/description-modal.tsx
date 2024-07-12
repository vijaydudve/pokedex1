'use client';

import Button from '@/components/atoms/button/button';
import { READ_MORE_LABEL } from '@/utils/constants';
import { useState } from 'react';
import { IoClose } from "react-icons/io5";

interface Props {
    description: string
    customStyles?: string | ''
}

export default function DescriptionModal({ description, customStyles }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <section>
            <Button
                onClick={() => setIsOpen(true)}
                aria-label='Read more about the description'
                role="button"
                customStyles='text-base font-bold text-darkblue underline decoration-solid cursor-pointer'
                tabIndex={0}
            >
                {READ_MORE_LABEL}
            </Button>

            <article
                className={`
                    absolute w-full bg-darkblue left-0 top-[270px] rounded-md p-5 flex justify-between
                    transition-all duration-1000 ease-in-out
                    shadow-lg shadow-darkblue ${customStyles}
                    ${isOpen ? 'opacity-100' : 'opacity-0 overflow-hidden'}
                `}
            >
                <p className='text-white text-xs'>{description}</p>
                <Button
                    customStyles='cursor-pointer ml-4'
                    onClick={() => setIsOpen(false)}
                    aria-label='Close description'
                    role="button"
                    tabIndex={0}
                >
                    <IoClose color='white' size={22} />
                </Button>
            </article>
        </section>
    );
}