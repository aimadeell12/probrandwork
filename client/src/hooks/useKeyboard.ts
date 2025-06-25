import { useEffect, useState } from 'react';

export function useKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Web fallback - detect virtual keyboard using viewport changes
    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const fullHeight = window.screen.height;
      const heightDiff = fullHeight - currentHeight;
      
      if (heightDiff > 150) { // Likely keyboard is open
        setIsKeyboardOpen(true);
        setKeyboardHeight(heightDiff);
      } else {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    };

    // Listen for viewport changes (mobile keyboard)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // Also listen for input focus/blur
    const handleFocus = () => {
      setTimeout(() => {
        const currentHeight = window.visualViewport?.height || window.innerHeight;
        const fullHeight = window.screen.height;
        const heightDiff = fullHeight - currentHeight;
        
        if (heightDiff > 150) {
          setIsKeyboardOpen(true);
          setKeyboardHeight(heightDiff);
        }
      }, 300); // Delay to allow keyboard animation
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }, 300);
    };

    // Add focus/blur listeners to all inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
}