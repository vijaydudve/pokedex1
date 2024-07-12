import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterMenuButton from './filter-menu-button';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('../filter-option-modal/filter-option-modal', () => {
  return function DummyFilterOptionsModal({ onCancel, onApply, onReset }:any) {
    return (
      <div data-testid="filter-modal">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onApply}>Apply</button>
        <button onClick={onReset}>Reset</button>
      </div>
    );
  };
});

describe('FilterMenuButton', () => {
  const mockReplace = jest.fn();
  const mockRouter = { replace: mockReplace };
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<FilterMenuButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens modal when button is clicked', () => {
    render(<FilterMenuButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
  });

  it('closes modal when Cancel is clicked', () => {
    render(<FilterMenuButton />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
  });

  it('updates URL and closes modal when Apply is clicked', () => {
    render(<FilterMenuButton />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Apply'));
    expect(mockReplace).toHaveBeenCalled();
    expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
  });

  it('resets filters and updates URL when Reset is clicked', () => {
    render(<FilterMenuButton />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Reset'));
    expect(mockReplace).toHaveBeenCalledWith('/pokemon', { scroll: false });
  });

  it('updates URL correctly when filters change', () => {
    const { rerender } = render(<FilterMenuButton />);
    act(() => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('type=Fire&gender=Male&stats=[HP=10-90]'));
    });
    rerender(<FilterMenuButton />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Apply'));
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('?type=fire&gender=Male&stats=%5BHP%3D10-90%5D'), expect.anything());
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('gender=Male'), expect.anything());
    expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining('stats=%5BHP%3D10-90%5D'), expect.anything());
  });
});