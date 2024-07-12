import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './button';

describe('Button Component', () => {
  test('renders button with label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('renders button with custom className', () => {
    render(<Button label="Custom Button" customStyles="bg-blue-500 text-white" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500 text-white');
  });

  test('renders button with only children content', () => {
    render(<Button><span>Child Element</span></Button>);
    expect(screen.getByText('Child Element')).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  test('renders button with icon', () => {
    const iconMock = <svg data-testid="icon"></svg>;
    render(<Button icon={iconMock} aria-label="Icon Button" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Icon Button')).toBeInTheDocument();
  });

  test('renders button with children', () => {
    render(<Button>Child Content</Button>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('applies default type of "button"', () => {
    render(<Button label="Default Type" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  test('applies custom type when specified', () => {
    render(<Button label="Submit" type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  test('passes through additional props', () => {
    render(<Button label="Test" data-testid="custom-button" onClick={() => {}} />);
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
  });

  test('uses aria-label when no label is provided', () => {
    render(<Button aria-label="Accessible Button" />);
    expect(screen.getByLabelText('Accessible Button')).toBeInTheDocument();
  });

  test('renders both icon and label when provided', () => {
    const iconMock = <svg data-testid="icon"></svg>;
    render(<Button icon={iconMock} label="Icon with Label" />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Icon with Label')).toBeInTheDocument();
  });
});