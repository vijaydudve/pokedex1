import React from 'react';

interface TitleDescriptionProps {
  description: string;
  customStyles?: string;
}

const TitleDescription: React.FC<TitleDescriptionProps> = ({ description, customStyles }) => {
  const styles = `text-base text-lightblue font-semibold ${customStyles || ''}`;

  return (
    <p className={styles}>{description}</p>
  );
};

export default TitleDescription;
