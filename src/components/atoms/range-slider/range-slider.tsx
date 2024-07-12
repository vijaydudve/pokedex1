import React from "react";
import ReactSlider, { ReactSliderProps } from "react-slider";
import cn from "classnames";

type ExtendedSliderProps<T extends number | readonly number[]> = ReactSliderProps<T> & {
  onAfterChange?: (value: T) => void;
};



const RangeSlider = <T extends number | readonly number[] = number[]>({
  min = 0,
  max = 100,
  value,
  orientation = "horizontal",
  onAfterChange,
  ...props
}: ExtendedSliderProps<T>) => {
  const isVertical = orientation === "vertical";

  const calculateDefaultRange = <T extends number | readonly number[]>(
    value: T | undefined,
    min: number,
    max: number
  ): T => {
    return (Array.isArray(value) ? value : ([min, max] as unknown as T));
  };

  const defaultRange = calculateDefaultRange(value, min, max);

  const displayValue = value || defaultRange;

  
  
  return (
    <div
      className={`flex ${isVertical ? 'flex-col' : 'w-full'} items-center gap-2 text-darkblue`}
      data-testid="range-slider"
    >
      <span className="text-xs font-light w-6 flex items-center justify-end">
        {Array.isArray(displayValue) ? displayValue[0] : min}
      </span>
      <ReactSlider
        {...props}
        min={min}
        max={max}
        value={displayValue}
        orientation={orientation}
        onAfterChange={onAfterChange}
        renderTrack={(props, state) => {
          const points = Array.isArray(state.value) ? state.value.length : null;
          const isMulti = points && points > 0;
          const isLast = isMulti ? state.index === points : state.index === 1;
          const isFirst = state.index === 0;
          return (
            <div
              {...props}
              data-testid={`track-${state.index}`}
              className={cn({
                "h-1 top-1/2 -translate-y-1/2": !isVertical,
                "w-full left-1/2 -translate-x-1/2": isVertical,
                "rounded-full": true,
                "bg-slidertrack": isMulti ? isFirst || isLast : isLast,
                "bg-darkblue": isMulti ? !isFirst && !isLast : isFirst,
              })}
            />
          );
        }}
        renderThumb={(props, state) => {
          const value = Array.isArray(state.value)
            ? state.value[state.index]
            : state.value;

          return (
            <div
              {...props}
              data-testid={`thumb-${state.index}`}
              className={cn(
                "w-6 h-3.5 mt-[5px] rounded-xl cursor-pointer flex justify-center items-center bg-darkblue"
              )}
            >
              <span className="text-white text-[8px] pt-[1px] font-semibold">
                {value}
              </span>
            </div>
          );
        }}
      />
      <span className="text-xs font-light w-6 flex items-center justify-start">
        {Array.isArray(displayValue) ? displayValue[displayValue.length - 1] : max}
      </span>
    </div>
  );
};

export default RangeSlider;