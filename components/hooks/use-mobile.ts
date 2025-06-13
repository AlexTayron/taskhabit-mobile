import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(Dimensions.get('window').width < 768);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < 768);
    });

    return () => subscription.remove();
  }, []);

  return isMobile;
}; 