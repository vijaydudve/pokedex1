import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterOptions from './filter-options';

jest.mock('../../molecules/dropdown/dropdown', () => {
  return function DummyDropdown({ type, height, width, optionsWidth, customStyles }:any) {
    return <div data-testid={`mock-dropdown-${type}`}>{type}</div>;
  };
});

jest.mock('../../molecules/filter-menu-button/filter-menu-button', () => {
  return function DummyFilterMenuButton() {
    return <div data-testid="mock-filter-menu-button">Filter Menu Button</div>;
  };
});

jest.mock('../../molecules/search-bar/search-bar', () => {
  return function DummySearchBar() {
    return <div data-testid="mock-search-bar">Search Bar</div>;
  };
});

describe('FilterOptions Component', () => {
  const mockSearchParams = {};

  it('renders SearchBar component', () => {
    render(<FilterOptions searchParams={mockSearchParams} />);
    expect(screen.getByTestId('mock-search-bar')).toBeInTheDocument();
  });

  it('renders Dropdown components on large screens', () => {
    render(<FilterOptions searchParams={mockSearchParams} />);
    expect(screen.getByTestId('mock-dropdown-Type')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-Gender')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dropdown-Stats')).toBeInTheDocument();
  });

  it('renders FilterMenuButton on small screens', () => {
    render(<FilterOptions searchParams={mockSearchParams} />);
    expect(screen.getByTestId('mock-filter-menu-button')).toBeInTheDocument();
  });

  it('applies correct classes to the main section', () => {
    const { container } = render(<FilterOptions searchParams={mockSearchParams} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('flex items-center justify-between h-14 mt-3 gap-5 lg:gap-8');
  });

  it('applies correct classes to the large screen dropdown container', () => {
    const { container } = render(<FilterOptions searchParams={mockSearchParams} />);
    const largeScreenDiv = container.querySelector('.lg\\:flex');
    expect(largeScreenDiv).toHaveClass('lg:flex hidden w-auto flex items-center justify-between gap-8');
  });

  it('applies correct classes to the small screen filter button container', () => {
    const { container } = render(<FilterOptions searchParams={mockSearchParams} />);
    const smallScreenDiv = container.querySelector('.lg\\:hidden');
    expect(smallScreenDiv).toHaveClass('lg:hidden w-20 flex items-center justify-between');
  });
});