import React from 'react';

interface ScrollViewProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  contentContainerStyle?: React.CSSProperties;
}

export const ScrollView: React.FC<ScrollViewProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  horizontal = false,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = true,
  contentContainerStyle = {},
  ...props 
}) => {
  const scrollStyle: React.CSSProperties = {
    ...style,
    overflow: 'auto',
    ...(horizontal && {
      overflowX: 'auto' as const,
      overflowY: 'hidden' as const,
      whiteSpace: 'nowrap' as const,
    }),
    ...((!showsVerticalScrollIndicator || (!showsHorizontalScrollIndicator && horizontal)) && {
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const,
    })
  };

  const contentStyle = {
    ...contentContainerStyle,
    ...(horizontal && {
      display: 'inline-flex',
      flexDirection: 'row' as const,
    })
  };

  return (
    <div 
      className={className} 
      style={scrollStyle}
      {...props}
    >
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default ScrollView;