import React from 'react';

interface TextProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPress?: () => void;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  onPress,
  numberOfLines,
  ...props 
}) => {
  const textStyle = {
    ...style,
    ...(numberOfLines && {
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: numberOfLines,
      WebkitBoxOrient: 'vertical' as const,
    })
  };

  if (onPress) {
    return (
      <span 
        className={`cursor-pointer ${className}`} 
        style={textStyle} 
        onClick={onPress}
        {...props}
      >
        {children}
      </span>
    );
  }
  
  return (
    <span 
      className={className} 
      style={textStyle} 
      {...props}
    >
      {children}
    </span>
  );
};

export default Text;