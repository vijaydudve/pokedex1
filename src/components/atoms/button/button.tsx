import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactElement;
  customStyles?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  icon, 
  children, 
  customStyles = '', 
  'aria-label': ariaLabelProp,
  ...props 
}) => {
  const buttonText = label || children;
  const ariaLabel = buttonText ? undefined : ariaLabelProp || 'Button';
  return (
    <button 
      {...props} 
      className={`rounded-md flex items-center font-medium focus:outline-none focus:ring-2 ${customStyles}`} 
      aria-label={ariaLabel} 
      type={props.type || 'button'}
    >
        {icon && <span className="sr-only text-gray-800">{ariaLabel}</span>}
       {icon}
       {label && <span>{label}</span>}
      {children}
    </button>
  );
};

export default Button;