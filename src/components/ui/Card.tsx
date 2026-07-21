import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false }) => {
  const baseStyle = "rounded-xl overflow-hidden";
  const bgStyle = glass 
    ? "glass" 
    : "bg-white border border-gray-200 shadow-sm dark:bg-dark-card dark:border-dark-border";

  return (
    <div className={`${baseStyle} ${bgStyle} ${className}`}>
      {children}
    </div>
  );
};
