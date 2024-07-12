import { HOME_PAGE_ROUTE, NEXT_BUTTON_LABEL, PREVIOUS_BUTTON_LABEL, QUERY_PAGE } from '@/utils/constants';
import Link from 'next/link';
import { FC } from 'react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 5;
    const startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const createPageUrl = (page: number) => {
        return `${HOME_PAGE_ROUTE}?${QUERY_PAGE}=${page}`;
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Link 
                key={i} href={createPageUrl(i)} 
                className={`px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    currentPage === i ? 'bg-darkblue text-white' : 'bg-ice'
                }`}
                aria-label={`Go to page ${i}`}
                aria-current={currentPage === i ? 'page' : undefined}
                >
                    {i}
                </Link>
            );
        }

        return pageNumbers;
    };

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center mt-8 pb-4">
            {currentPage > 1 && (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className={`px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === 1 ? 'bg-darkblue text-white pointer-events-none' : 'bg-darkblue text-white'
                        }`}
                    aria-label="Previous page"
                    aria-disabled={currentPage === 1}
                >
                    {PREVIOUS_BUTTON_LABEL}
                </Link>
            )}
            <div className="mx-4 flex items-center space-x-2">{renderPageNumbers()}</div>
            {currentPage < totalPages && (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className={`px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === totalPages ? 'bg-darkblue text-white pointer-events-none' : 'bg-darkblue text-white'
                        }`}
                    aria-label="Next page"
                    aria-disabled={currentPage === totalPages}
                >
                    {NEXT_BUTTON_LABEL}
                </Link>
            )}
        </nav>
    );
};

export default Pagination;