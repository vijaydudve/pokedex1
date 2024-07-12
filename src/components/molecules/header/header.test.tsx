import React from 'react';
import { render, screen } from '@testing-library/react';
import { HEADER_DESCRIPTION, HEADER_TITLE } from '@/utils/constants';
import Header from './header';

// Mock the imported components
jest.mock('../../atoms/title/title', () => {
    return function MockedTitle({ title, customStyles }: { title: string; customStyles: string }) {
      return <div data-testid="mocked-title" className={customStyles}>{title}</div>;
    };
  });
  
  jest.mock('../../atoms/title-description/title-description', () => {
    return function MockedTitleDescription({ description, customStyles }: { description: string; customStyles: string }) {
      return <div data-testid="mocked-title-description" className={customStyles}>{description}</div>;
    };
  });

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByTestId('mocked-title')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-title-description')).toBeInTheDocument();
  });

  it('passes correct title to Title component', () => {
    render(<Header />);
    const titleElement = screen.getByTestId('mocked-title');
    expect(titleElement).toHaveTextContent(HEADER_TITLE);
  });

  it('passes correct description to TitleDescription component', () => {
    render(<Header />);
    const descriptionElement = screen.getByTestId('mocked-title-description');
    expect(descriptionElement).toHaveTextContent(HEADER_DESCRIPTION);
  });

  it('applies correct custom styles to Title component', () => {
    render(<Header />);
    const titleElement = screen.getByTestId('mocked-title');
    expect(titleElement).toHaveClass('h-[45%] border-b border-lightblue md:w-36 md:border-r md:border-b-0 md:flex items-center md:h-1/2');
  });

  it('applies correct custom styles to TitleDescription component', () => {
    render(<Header />);
    const descriptionElement = screen.getByTestId('mocked-title-description');
    expect(descriptionElement).toHaveClass('h-[55%] flex items-center pt-2 md:w-[80%] md:pt-0 md:pl-10 md:h-1/2');
  });

  it('renders with correct container class', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toHaveClass('h-24 flex flex-col md:flex-row md:items-center');
  });

  it('renders both Title and TitleDescription components', () => {
    render(<Header />);
    expect(screen.getByTestId('mocked-title')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-title-description')).toBeInTheDocument();
  });
});