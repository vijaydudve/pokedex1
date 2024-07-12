'use client';

import { useRouter } from 'next/navigation';
import { SlClose } from 'react-icons/sl';

interface Props{
    size:number
}

export default function CloseButton({size}:Props) {
    const router = useRouter();

    const handleClose = () => {
        const previousUrl = localStorage.getItem('previous-url');
        if(previousUrl){
            router.push(JSON.parse(previousUrl));
        }
        else {
            router.back()
        }
    };

    return (
        <button aria-label='Close button' onClick={handleClose} className="flex justify-start">
            <SlClose size={size} />
        </button>
    );
}

