import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import RangeSlider from './range-slider';

class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  
  global.ResizeObserver = ResizeObserverMock;

  jest.mock('react-slider', () => {
    return jest.fn(({ renderTrack, renderThumb, value, min, max }) => (
      <div data-testid="mock-react-slider">
        {renderTrack({ index: 0 }, { index: 0, value })}
        {renderTrack({ index: 1 }, { index: 1, value })}
        {Array.isArray(value) && renderTrack({ index: 2 }, { index: 2, value })}
        {renderThumb({ index: 0 }, { index: 0, value })}
        {Array.isArray(value) && renderThumb({ index: 1 }, { index: 1, value })}
      </div>
    ));
  });

describe('RangeSlider', () => {
    describe('RangeSlider', () => {
        it('renders with single value', () => {
          render(<RangeSlider value={30} />);
          expect(screen.getByText('30')).toBeInTheDocument();
        });
      
        it('renders vertical orientation', () => {
          render(<RangeSlider orientation="vertical" />);
          expect(screen.getByTestId('range-slider')).toHaveClass('flex-col');
        });
  
        it('renders correct track classes for single value', () => {
          render(<RangeSlider value={50} />);
          expect(screen.getByTestId('track-0')).toHaveClass('bg-darkblue');
          expect(screen.getByTestId('track-1')).toHaveClass('bg-slidertrack');
        });
      
        it('renders correct track classes for range values', () => {
          render(<RangeSlider value={[30, 70]} />);
          expect(screen.getByTestId('track-0')).toHaveClass('bg-slidertrack');
          expect(screen.getByTestId('track-1')).toHaveClass('bg-darkblue');
          expect(screen.getByTestId('track-2')).toHaveClass('bg-slidertrack');
        });
      });
});