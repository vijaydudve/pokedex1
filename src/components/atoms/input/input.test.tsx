import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './input';

describe('Input Component', () => {
  test('renders input with default props', () => {
    render(<Input name="test-input" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'test-input');
    expect(input).toHaveAttribute('type', 'text');
  });

  test('sets placeholder', () => {
    render(<Input name="test-input" placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  test('uses placeholder as aria-label when not provided', () => {
    render(<Input name="test-input" placeholder="Enter text" />);
    const input = screen.getByLabelText('Enter text');
    expect(input).toBeInTheDocument();
  });

  test('uses provided aria-label over placeholder', () => {
    render(<Input name="test-input" placeholder="Enter text" aria-label="Custom Label" />);
    const input = screen.getByLabelText('Custom Label');
    expect(input).toBeInTheDocument();
  });


  test('passes through additional props', () => {
    render(<Input name="test-input" data-testid="custom-input" />);
    const input = screen.getByTestId('custom-input');
    expect(input).toBeInTheDocument();
  });
});