// React Native Web Components
export { default as View } from './View';
export { default as Text } from './Text';
export { default as TouchableOpacity } from './TouchableOpacity';
export { default as ScrollView } from './ScrollView';
export { default as TextInput } from './TextInput';

// Re-export common React Native components as web equivalents
export const SafeAreaView = View;
export const StatusBar = () => null; // Web doesn't need status bar
export const FlatList = ScrollView; // Simplified for web
export const Image = ({ source, style, ...props }: any) => (
  <img src={typeof source === 'string' ? source : source?.uri} style={style} {...props} />
);

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