import React from 'react';

interface ViewProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onPress?: () => void;
}

export const View: React.FC<ViewProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  onClick,
  onPress,
  ...props 
}) => {
  const handlePress = onClick || onPress;
  
  return (
    <div 
      className={className} 
      style={style} 
      onClick={handlePress}
      {...props}
    >
      {children}
    </div>
  );
};

export default View;