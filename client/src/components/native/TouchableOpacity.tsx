import React from 'react';

interface TouchableOpacityProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPress?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
}

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  onPress,
  disabled = false,
  activeOpacity = 0.7,
  ...props 
}) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const touchableStyle = {
    ...style,
    opacity: disabled ? 0.5 : (isPressed ? activeOpacity : 1),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.2s ease',
  };

  return (
    <div 
      className={className} 
      style={touchableStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export default TouchableOpacity;