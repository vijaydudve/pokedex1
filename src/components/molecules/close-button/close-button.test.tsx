import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CloseButton from './close-button';
import { useRouter } from 'next/navigation';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('react-icons/sl', () => ({
    SlClose: () => <div data-testid="mock-close-icon" />,
}));

describe('CloseButton', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
            },
            writable: true,
        });
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
            back: mockBack,
        });
    });

    it('renders correctly with given size', () => {
        render(<CloseButton size={24} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('mock-close-icon')).toBeInTheDocument();
    });

    it('calls router.push with previous URL when available', () => {
        const previousUrl = '/previous-page';
        (window.localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(previousUrl));
        render(<CloseButton size={24} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockPush).toHaveBeenCalledWith(previousUrl);
        expect(mockBack).not.toHaveBeenCalled();
    });

    it('calls router.back when no previous URL is available', () => {
        (window.localStorage.getItem as jest.Mock).mockReturnValue(null);
        render(<CloseButton size={24} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockBack).toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });
});