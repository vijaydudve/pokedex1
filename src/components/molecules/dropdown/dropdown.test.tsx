import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TypeList, genderList, StatsList } from '@/utils/data';
import { Dropdown, handleApplyStatFilters, handleRangeChange, handleSelect, updateQueryString } from './dropdown';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    toString: jest.fn(),
  }),
}));

jest.mock('next/dynamic', () => () => {
  const DynamicComponent = ({ onAfterChange, min, max, value }: any) => (
    <div data-testid="mock-range-slider">
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => onAfterChange([Number(e.target.value), value[1]])}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value[1]}
        onChange={(e) => onAfterChange([value[0], Number(e.target.value)])}
      />
    </div>
  );
  return DynamicComponent;
});

describe('Dropdown Component', () => {

  it('closes dropdown when clicking outside', () => {
    render(<Dropdown type="Type" />);
    fireEvent.click(screen.getByTestId('dropdown-button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders Type dropdown correctly', () => {
    render(<Dropdown type="Type" />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('opens and closes the dropdown', () => {
    render(<Dropdown type="Type" />);
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Select'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('renders Gender dropdown correctly', () => {
    render(<Dropdown type="Gender" />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('renders Stats dropdown correctly', () => {
    render(<Dropdown type="Stats" />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('opens Stats dropdown and shows all stats', () => {
    render(<Dropdown type="Stats" />);
    fireEvent.click(screen.getByText('Select'));
    StatsList.forEach((stat) => {
      expect(screen.getByText(stat.name)).toBeInTheDocument();
    });
  });

  it('adjusts range for a stat in Stats dropdown', async () => {
    const mockRouter = { push: jest.fn(), replace: jest.fn() };
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);

    render(<Dropdown type="Stats" />);

    fireEvent.click(screen.getByText('Select'));
    const sliders = screen.getAllByTestId('mock-range-slider');
    fireEvent.change(sliders[0].querySelectorAll('input')[0], { target: { value: '50' } });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('stats='), { scroll: false });
    });

    expect(screen.getByText(StatsList[0].name)).toBeInTheDocument();
  });

  it('renders Type dropdown and selects items', () => {
    render(<Dropdown type="Type" />);
    fireEvent.click(screen.getByText('Select'));
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);
    expect(screen.getByTestId('selected-item')).toHaveTextContent(TypeList[0].name);
  });

  it('renders Gender dropdown and selects multiple items', () => {
    render(<Dropdown type="Gender" />);
    fireEvent.click(screen.getByText('Select'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    expect(screen.getByTestId('selected-item')).toHaveTextContent(genderList[0].name);
  });

  it('renders Stats dropdown and applies filters', async () => {
    const mockRouter = { push: jest.fn(), replace: jest.fn() };
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);

    render(<Dropdown type="Stats" />);
    fireEvent.click(screen.getByText('Select'));
    const sliders = screen.getAllByTestId('mock-range-slider');
    fireEvent.change(sliders[0].querySelectorAll('input')[0], { target: { value: '50' } });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('stats='), { scroll: false });
    });

    expect(screen.getByText(StatsList[0].name)).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(<Dropdown type="Type" />);
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('resets stats filters', async () => {
    render(<Dropdown type="Stats" />);
    fireEvent.click(screen.getByText('Select'));
    const sliders = screen.getAllByTestId('mock-range-slider');
    fireEvent.change(sliders[0].querySelectorAll('input')[0], { target: { value: '50' } });
    fireEvent.click(screen.getByText('Apply'));
    fireEvent.click(screen.getByText(StatsList[0].name));
    fireEvent.click(screen.getByText('Reset'));
    fireEvent.click(screen.getByText('Apply'));
    await waitFor(() => {
      expect(screen.getByText('Select')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', () => {
    render(<Dropdown type="Type" />);
    fireEvent.click(screen.getByText('Select'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});


describe('Dropdown internal functions', () => {
  describe('handleRangeChange', () => {
    test('adds new stat when not present', () => {
      const setSelectedStats = jest.fn();
      handleRangeChange(setSelectedStats, 'TestStat', [10, 20]);
      expect(setSelectedStats).toHaveBeenCalledWith(expect.any(Function));
      const updateFunction = setSelectedStats.mock.calls[0][0];
      const result = updateFunction([]);
      expect(result).toEqual([{ name: 'TestStat', min: 10, max: 20 }]);
    });

    test('updates existing stat', () => {
      const setSelectedStats = jest.fn();
      handleRangeChange(setSelectedStats, 'TestStat', [30, 40]);
      const updateFunction = setSelectedStats.mock.calls[0][0];
      const result = updateFunction([{ name: 'TestStat', min: 10, max: 20 }]);
      expect(result).toEqual([{ name: 'TestStat', min: 30, max: 40 }]);
    });

    test('handles single value input', () => {
      const setSelectedStats = jest.fn();
      handleRangeChange(setSelectedStats, 'TestStat', 50);
      const updateFunction = setSelectedStats.mock.calls[0][0];
      const result = updateFunction([]);
      expect(result).toEqual([{ name: 'TestStat', min: 50, max: 50 }]);
    });
  });

  describe('updateQueryString', () => {
    const mockRouter = { push: jest.fn(), replace: jest.fn() };
    const mockSearchParams = { toString: jest.fn().mockReturnValue('') };

    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('adds new parameter to query string', () => {
      updateQueryString(mockRouter as any, mockSearchParams as any, [{ id: 1, name: 'Test' }], 'type');
      expect(mockRouter.push).toHaveBeenCalledWith('?type=Test', { scroll: false });
    });

    test('updates existing parameter in query string', () => {
      updateQueryString(mockRouter as any, mockSearchParams as any, [{ id: 1, name: 'NewTest' }], 'type');
      expect(mockRouter.push).toHaveBeenCalledWith('?type=NewTest', { scroll: false });
    });

    test('removes parameter when items array is empty', () => {
      updateQueryString(mockRouter as any, mockSearchParams as any, [], 'type');
      expect(mockRouter.push).toHaveBeenCalledWith('?', { scroll: false });
    });

    test('handles multiple items', () => {
      updateQueryString(mockRouter as any, mockSearchParams as any, [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }], 'type');
      expect(mockRouter.push).toHaveBeenCalledWith('?type=Test1%25Test2', { scroll: false });
    });
  });

  describe('handleSelect', () => {
    test('adds item when not selected', () => {
      const setSelectedItems = jest.fn();
      const updateQueryString = jest.fn();
      const item = { id: '1', name: 'Test' };
      handleSelect(setSelectedItems, updateQueryString, 'type', item as any);
      const updateFunction = setSelectedItems.mock.calls[0][0];
      const result = updateFunction([]);
      expect(result).toEqual([item]);
      expect(updateQueryString).toHaveBeenCalledWith([item], 'type');
    });

    test('removes item when already selected', () => {
      const setSelectedItems = jest.fn();
      const updateQueryString = jest.fn();
      const item = { id: '1', name: 'Test' };
      handleSelect(setSelectedItems, updateQueryString, 'type', item as any);
      const updateFunction = setSelectedItems.mock.calls[0][0];
      const result = updateFunction([item]);
      expect(result).toEqual([]);
      expect(updateQueryString).toHaveBeenCalledWith([], 'type');
    });
  });

  describe('handleApplyStatFilters', () => {
    const mockRouter = { push: jest.fn(), replace: jest.fn() };
    const mockSearchParams = { toString: jest.fn().mockReturnValue('') };
    const mockSetIsOpen = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('applies stat filters to query string', () => {
      const selectedStats = [
        { name: 'Stat1', min: 10, max: 20 },
        { name: 'Stat2', min: 30, max: 40 }
      ];
      handleApplyStatFilters(mockRouter as any, mockSearchParams as any, selectedStats, mockSetIsOpen);
      expect(mockRouter.push).toHaveBeenCalledWith('?stats=%5BStat1%3D10-20%25Stat2%3D30-40%5D', { scroll: false });
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);

    });

    test('removes stats parameter when no stats selected', () => {
      handleApplyStatFilters(mockRouter as any, mockSearchParams as any, [], mockSetIsOpen);
      expect(mockRouter.push).toHaveBeenCalledWith('?', { scroll: false });
      expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });

    test('handles special characters in stat names', () => {
      const selectedStats = [
        { name: 'Stat & Special', min: 10, max: 20 }
      ];
      handleApplyStatFilters(mockRouter as any, mockSearchParams as any, selectedStats, mockSetIsOpen);
      expect(mockRouter.push).toHaveBeenCalledWith('?stats=%5BStat%2520%2526%2520Special%3D10-20%5D', { scroll: false });
    });
  });
});