// Logo.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LogoProps {
  style?: any; // To allow passing custom styles from parent
}

const Logo: React.FC<LogoProps> = ({ style }) => {
  const { theme } = useTheme();

  // You would typically have local images in React Native,
  // e.g., require('../../assets/images/logo_light.png')
  // For web images, you might need to specify dimensions.
  const logoSource = theme === 'dark' ?
    { uri: 'https://example.com/logo_light.png' } : // Replace with actual URLs
    { uri: 'https://example.com/logo_dark.png' }; // Replace with actual URLs

  return (
    <Image
      source={logoSource}
      alt="TaskHabit"
      style={[styles.logo, style]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    height: 32, // Equivalent to style={{ height: '32px' }}
    width: 120, // You might need to adjust this width or use 'auto' with a fixed aspect ratio
    resizeMode: 'contain', // Ensures the image fits within the bounds
  },
});

export default Logo;