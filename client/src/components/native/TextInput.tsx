import React from 'react';

interface TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  maxLength?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  value,
  onChangeText,
  placeholder,
  className = '',
  style = {},
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength,
  onFocus,
  onBlur,
  onSubmitEditing,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline && onSubmitEditing) {
      onSubmitEditing();
    }
  };

  const getInputType = () => {
    if (secureTextEntry) return 'password';
    if (keyboardType === 'email-address') return 'email';
    if (keyboardType === 'numeric' || keyboardType === 'phone-pad') return 'tel';
    return 'text';
  };

  const inputStyle = {
    outline: 'none',
    border: 'none',
    background: 'transparent',
    width: '100%',
    ...style,
  };

  const commonProps = {
    value,
    onChange: handleChange,
    placeholder,
    className,
    style: inputStyle,
    disabled: !editable,
    maxLength,
    onFocus,
    onBlur,
    onKeyPress: handleKeyPress,
    autoComplete,
    ...props,
  };

  if (multiline) {
    return (
      <textarea
        {...commonProps}
        rows={numberOfLines}
        style={{
          ...inputStyle,
          resize: 'none',
          fontFamily: 'inherit',
        }}
      />
    );
  }

  return (
    <input
      {...commonProps}
      type={getInputType()}
      autoCapitalize={autoCapitalize}
    />
  );
};

export default TextInput;