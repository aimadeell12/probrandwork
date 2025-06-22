// React Native Web Components
export { default as View } from './View';
export { default as Text } from './Text';
export { default as TouchableOpacity } from './TouchableOpacity';
export { default as ScrollView } from './ScrollView';
export { default as TextInput } from './TextInput';

// Additional React Native components for web
import React from 'react';
import ViewComponent from './View';
import ScrollViewComponent from './ScrollView';

export const SafeAreaView = ViewComponent;
export const StatusBar = () => null;
export const FlatList = ScrollViewComponent;

interface ImageProps {
  source: string | { uri: string };
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Image: React.FC<ImageProps> = ({ source, style, ...props }) => {
  const src = typeof source === 'string' ? source : source?.uri;
  return React.createElement('img', {
    src,
    style,
    ...props
  });
};

// Platform detection
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