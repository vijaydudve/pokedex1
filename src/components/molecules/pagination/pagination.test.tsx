/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Pagination from './pagination';

// Mock Next.js Link component
// eslint-disable-next-line react/display-name
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 3,
    totalItems: 100,
    itemsPerPage: 10,
  };

  it('renders correctly', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
  });

  it('displays correct page numbers', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders Previous button when not on first page', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('renders Next button when not on last page', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render Previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
  });

  it('does not render Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('adjusts page numbers for start of range', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('creates correct page URLs', () => {
    render(<Pagination {...defaultProps} />);
    const pageLinks = screen.getAllByRole('link');
    expect(pageLinks[1]).toHaveAttribute('href', '/pokemon?page=1');
    expect(pageLinks[2]).toHaveAttribute('href', '/pokemon?page=2');
    expect(pageLinks[3]).toHaveAttribute('href', '/pokemon?page=3');
  });

});