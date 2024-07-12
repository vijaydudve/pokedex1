import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import SearchBar, { createUrl } from './search-bar';
import { QUERY_SEARCH } from '@/utils/constants';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe('SearchBar', () => {
  const mockReplace = jest.fn();
  const mockSearchParams = new URLSearchParams();
  const mockPathname = '/test';

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('updates search state and URL on input change', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'pikachu' } });
    expect(input).toHaveValue('pikachu');
    expect(mockReplace).toHaveBeenCalledWith('/test?search=pikachu');
  });

  it('shows clear button when search has value', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'pikachu' } });
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    expect(screen.queryByTestId('search-button')).not.toBeInTheDocument();
  });

  it('shows search button when search is empty', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument();
  });

  it('initializes search state from URL', () => {
    mockSearchParams.set(QUERY_SEARCH, 'charizard');
    render(<SearchBar />);
    expect(screen.getByTestId('search-input')).toHaveValue('charizard');
  });

  it('createUrl function works correctly', () => {
    const params = new URLSearchParams();
    params.set(QUERY_SEARCH, 'test');
    expect(createUrl('/path', params)).toBe('/path?search=test');
  });
});