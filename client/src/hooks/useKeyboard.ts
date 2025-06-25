import { useEffect, useState } from 'react';
import { Keyboard } from '@capacitor/keyboard';

export function useKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showHandler = Keyboard.addListener('keyboardWillShow', info => {
      setIsKeyboardOpen(true);
      setKeyboardHeight(info.keyboardHeight);
      document.body.style.paddingBottom = `${info.keyboardHeight}px`;
    });

    const hideHandler = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardOpen(false);
      setKeyboardHeight(0);
      document.body.style.paddingBottom = '0px';
    });

    return () => {
      showHandler.remove();
      hideHandler.remove();
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
}