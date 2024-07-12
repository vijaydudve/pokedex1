import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder?: string;
  value?: string;
  customStyles?: string;
}

const Input: React.FC<InputProps> = ({ name, value, placeholder, customStyles = '', ...props }) => {
  const ariaLabel = placeholder && !props['aria-label'] ? placeholder : props['aria-label'];

  return (
    <input
      {...props}
      type={props.type || 'text'}
      name={name}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={`w-full text-sm p-1 bg-transparent outline-none ${customStyles}`}
    />
  );
};

export default Input;
