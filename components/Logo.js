import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Logo = ({ size = 100, color = '#2E7D32' }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="leaf" size={size} color={color} />
      <MaterialCommunityIcons 
        name="recycle" 
        size={size * 0.8} 
        color={color} 
        style={styles.recycleIcon} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recycleIcon: {
    position: 'absolute',
    opacity: 0.7,
  },
});