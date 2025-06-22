import React from 'react';

// React Native Web Components - Simple implementations
export const View = ({ children, style, className, ...props }: any) => (
  React.createElement('div', { style, className, ...props }, children)
);

export const Text = ({ children, style, className, ...props }: any) => (
  React.createElement('span', { style, className, ...props }, children)
);

export const ScrollView = ({ children, style, contentContainerStyle, ...props }: any) => (
  React.createElement('div', { 
    style: { 
      overflow: 'auto', 
      ...style 
    }, 
    ...props 
  }, 
    React.createElement('div', { style: contentContainerStyle }, children)
  )
);

export const TouchableOpacity = ({ children, style, onPress, disabled = false, ...props }: any) => (
  React.createElement('div', {
    style: {
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    },
    onClick: disabled ? undefined : onPress,
    ...props
  }, children)
);

export const TextInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  style, 
  secureTextEntry = false,
  multiline = false,
  ...props 
}: any) => {
  const handleChange = (e: any) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const inputProps = {
    value,
    onChange: handleChange,
    placeholder,
    style: {
      outline: 'none',
      border: 'none',
      background: 'transparent',
      width: '100%',
      fontFamily: 'inherit',
      ...style
    },
    ...props
  };

  if (multiline) {
    return React.createElement('textarea', {
      ...inputProps,
      style: {
        ...inputProps.style,
        resize: 'none'
      }
    });
  }

  return React.createElement('input', {
    ...inputProps,
    type: secureTextEntry ? 'password' : 'text'
  });
};

// Platform API
export const Platform = {
  OS: 'web' as const,
  select: (options: { web?: any; native?: any; ios?: any; android?: any; default?: any }) => 
    options.web || options.default,
};

// Dimensions API
export const Dimensions = {
  get: (dimension: 'window' | 'screen') => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }),
};

// StyleSheet API
export const StyleSheet = {
  create: <T extends Record<string, any>>(styles: T): T => styles,
  flatten: (style: any) => style,
  absoluteFillObject: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
};

// SafeAreaView (same as View for web)
export const SafeAreaView = View;

// StatusBar (no-op for web)
export const StatusBar = () => null;

// Image component
export const Image = ({ source, style, ...props }: any) => {
  const src = typeof source === 'string' ? source : source?.uri;
  return React.createElement('img', {
    src,
    style,
    ...props
  });
};