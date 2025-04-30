import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toast } from 'sonner-native';

const MOCK_RESULTS = {
  'banana': {
    name: 'Cáscara de Plátano',
    compostLevel: 'Alto',
    description: 'Excelente para compostaje, rico en potasio',
    decompositionTime: '2-5 semanas'
  },
  'apple': {
    name: 'Restos de Manzana',
    compostLevel: 'Medio',
    description: 'Bueno para compost, equilibra el pH',
    decompositionTime: '1-3 semanas'
  },
  'lettuce': {
    name: 'Hojas de Lechuga',
    compostLevel: 'Bajo',
    description: 'Alta humedad, usar con moderación',
    decompositionTime: '1-2 semanas'
  }
};

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const scanLineAnim = new Animated.Value(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (scanning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simular detección después de 3 segundos
      setTimeout(() => {
        const results = Object.values(MOCK_RESULTS)[Math.floor(Math.random() * 3)];
        setScanning(false);
        toast.success('¡Residuo detectado!');
        navigation.navigate('Results', { results });
      }, 3000);
    }
  }, [scanning]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No hay acceso a la cámara</Text>;
  }

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get('window').height - 200],
  });

  return (
    <View style={styles.container}>
      <Camera style={styles.camera}>
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent', 'rgba(0,0,0,0.7)']}
          style={styles.overlay}
        >
          <View style={styles.scanArea}>
            {scanning && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY }],
                  },
                ]}
              />
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {scanning ? 'Escaneando residuo...' : 'Listo para escanear'}
            </Text>
            {!scanning && (
              <MaterialIcons
                name="touch-app"
                size={40}
                color="#fff"
                onPress={() => setScanning(true)}
              />
            )}
          </View>
        </LinearGradient>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#4CAF50',
    position: 'absolute',
    top: 0,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
});