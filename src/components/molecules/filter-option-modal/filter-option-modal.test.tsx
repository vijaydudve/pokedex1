import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TypeList, genderList, StatsList } from '@/utils/data';
import FilterOptionsModal, { handleButtonToggle, handleRangeChange, handleSelect } from './filter-option-modal';
import { QUERY_TYPE } from '@/utils/constants';

const mockProps = {
  onCancel: jest.fn(),
  onReset: jest.fn(),
  onApply: jest.fn(),
  selectedTypes: [],
  setSelectedTypes: jest.fn(),
  selectedGenders: [],
  setSelectedGenders: jest.fn(),
  selectedStats: [],
  setSelectedStats: jest.fn(),
};

jest.mock('../../atoms/range-slider/range-slider', () => {
  return function DummySlider({ onAfterChange, min, max, value }: any) {
    return (
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={(e) => onAfterChange([Number(e.target.value), value[1]])}
        data-testid="mock-range-slider"
      />
    );
  };
});

describe('FilterOptionsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal', () => {
    render(<FilterOptionsModal {...mockProps} />);
    expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
  });

  test('renders filter buttons', () => {
    render(<FilterOptionsModal {...mockProps} />);
    expect(screen.getByTestId('type-button')).toBeInTheDocument();
    expect(screen.getByTestId('gender-button')).toBeInTheDocument();
    expect(screen.getByTestId('stats-button')).toBeInTheDocument();
  });

  test('toggles filter content visibility', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('type-button'));
    expect(screen.getByTestId('type-content')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('type-button'));
    expect(screen.queryByTestId('type-content')).not.toBeInTheDocument();
  });

  test('selects and deselects type items', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('type-button'));
    fireEvent.click(screen.getByTestId(`type-checkbox-${TypeList[0].id}`));
    expect(mockProps.setSelectedTypes).toHaveBeenCalled();
  });

  test('selects and deselects gender items', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('gender-button'));
    fireEvent.click(screen.getByTestId(`gender-checkbox-${genderList[0].id}`));
    expect(mockProps.setSelectedGenders).toHaveBeenCalled();
  });

  test('calls onCancel when close button is clicked', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  test('calls onReset when reset button is clicked', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('reset-button'));
    expect(mockProps.onReset).toHaveBeenCalled();
  });

  test('calls onApply with correct data when apply button is clicked', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('apply-button'));
    expect(mockProps.onApply).toHaveBeenCalledWith({
      type: [],
      gender: [],
      stats: []
    });
  });

  test('renders selected items correctly', () => {
    const selectedType = TypeList[0];
    const selectedGender = genderList[0];
    render(<FilterOptionsModal {...mockProps} selectedTypes={[selectedType]} selectedGenders={[selectedGender]} />);
    expect(screen.getByText(selectedType.name)).toBeInTheDocument();
    expect(screen.getByText(selectedGender.name)).toBeInTheDocument();
  });

  test('handleButtonToggle toggles active button', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('type-button'));
    expect(screen.getByTestId('type-content')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('type-button'));
    expect(screen.queryByTestId('type-content')).not.toBeInTheDocument();
  });

  test('handleSelect adds and removes items from type selection', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('type-button'));
    fireEvent.click(screen.getByTestId(`type-checkbox-${TypeList[0].id}`));
    expect(mockProps.setSelectedTypes).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId(`type-checkbox-${TypeList[0].id}`));
    expect(mockProps.setSelectedTypes).toHaveBeenCalledTimes(2);
  });

  test('handleSelect adds and removes items from gender selection', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('gender-button'));
    fireEvent.click(screen.getByTestId(`gender-checkbox-${genderList[0].id}`));
    expect(mockProps.setSelectedGenders).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId(`gender-checkbox-${genderList[0].id}`));
    expect(mockProps.setSelectedGenders).toHaveBeenCalledTimes(2);
  });

  test('renderFilterButton displays correct content', () => {
    const selectedType = TypeList[0];
    render(<FilterOptionsModal {...mockProps} selectedTypes={[selectedType]} />);
    expect(screen.getByText(selectedType.name)).toBeInTheDocument();
  });

  test('renderFilterContent displays all items', () => {
    render(<FilterOptionsModal {...mockProps} />);
    fireEvent.click(screen.getByTestId('type-button'));
    TypeList.forEach(type => {
      expect(screen.getByText(type.name)).toBeInTheDocument();
    });
  });

});

describe('Exported functions', () => {
  test('handleButtonToggle sets active button correctly', () => {
    const setActiveButton = jest.fn();
    handleButtonToggle('Type')(setActiveButton);
    expect(setActiveButton).toHaveBeenCalled();

    const mockSetState = setActiveButton.mock.calls[0][0];
    expect(mockSetState('')).toBe('Type');
    expect(mockSetState('Type')).toBe('');
  });

  test('handleSelect adds item to empty selection', () => {
    const setSelection = jest.fn();
    const item = TypeList[0];
    handleSelect(item, QUERY_TYPE)(setSelection, []);
    expect(setSelection).toHaveBeenCalled();

    const mockSetState = setSelection.mock.calls[0][0];
    expect(mockSetState([])).toEqual([item]);
  });

  test('handleSelect removes item from selection if already present', () => {
    const setSelection = jest.fn();
    const item = TypeList[0];
    handleSelect(item, QUERY_TYPE)(setSelection, [item]);
    expect(setSelection).toHaveBeenCalled();

    const mockSetState = setSelection.mock.calls[0][0];
    expect(mockSetState([item])).toEqual([]);
  });

  test('handleRangeChange adds new stat', () => {
    const setSelectedStats = jest.fn();
    handleRangeChange('TestStat', [10, 20])(setSelectedStats);
    expect(setSelectedStats).toHaveBeenCalled();

    const mockSetState = setSelectedStats.mock.calls[0][0];
    expect(mockSetState([])).toEqual([{ name: 'TestStat', min: 10, max: 20 }]);
  });

  test('handleRangeChange updates existing stat', () => {
    const setSelectedStats = jest.fn();
    const initialStats = [{ name: 'TestStat', min: 0, max: 100 }];
    handleRangeChange('TestStat', [10, 20])(setSelectedStats);
    expect(setSelectedStats).toHaveBeenCalled();

    const mockSetState = setSelectedStats.mock.calls[0][0];
    expect(mockSetState(initialStats)).toEqual([{ name: 'TestStat', min: 10, max: 20 }]);
  });
});