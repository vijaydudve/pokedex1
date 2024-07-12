import React from 'react';

interface TitleProps {
  title: string;
  customStyles?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title: React.FC<TitleProps> = ({ title, customStyles, headingLevel: Heading = 'h1', ...props }) => {
  const headingProps = { className: `text-2xl text-darkblue font-bold tracking-wider ${customStyles}` };

  return React.createElement(Heading, headingProps, title);
};

export default Title;
