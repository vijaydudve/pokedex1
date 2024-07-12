import React from 'react';
import { render, screen } from '@testing-library/react';
import TitleDescription from './title-description';

describe('TitleDescription', () => {
  const defaultDescription = 'This is a test description';

  it('renders with default props', () => {
    render(<TitleDescription description={defaultDescription} />);
    const paragraph = screen.getByText(defaultDescription);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('text-base text-lightblue font-semibold');
  });

  it('applies custom styles when provided', () => {
    const customStyles = 'custom-class';
    render(<TitleDescription description={defaultDescription} customStyles={customStyles} />);
    const paragraph = screen.getByText(defaultDescription);
    expect(paragraph).toHaveClass('text-base text-lightblue font-semibold custom-class');
  });

  it('renders with empty custom styles', () => {
    render(<TitleDescription description={defaultDescription} customStyles="" />);
    const paragraph = screen.getByText(defaultDescription);
    expect(paragraph).toHaveClass('text-base text-lightblue font-semibold');
    expect(paragraph).not.toHaveClass('undefined');
  });

  it('renders long descriptions', () => {
    const longDescription = 'This is a very long description that might span multiple lines and test how the component handles lengthy content in various situations.';
    render(<TitleDescription description={longDescription} />);
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('renders descriptions with special characters', () => {
    const specialDescription = 'Description with special characters: !@#$%^&*()_+{}[]|;:,.<>?';
    render(<TitleDescription description={specialDescription} />);
    expect(screen.getByText(specialDescription)).toBeInTheDocument();
  });

  it('applies multiple custom style classes', () => {
    const multipleStyles = 'class1 class2 class3';
    render(<TitleDescription description={defaultDescription} customStyles={multipleStyles} />);
    const paragraph = screen.getByText(defaultDescription);
    expect(paragraph).toHaveClass('text-base text-lightblue font-semibold class1 class2 class3');
  });
});