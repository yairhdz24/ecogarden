import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  Image,
  Easing,
  StatusBar
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.8;

// Datos de ejemplo para los resultados
const MOCK_RESULTS = {
  'banana': {
    name: 'Cáscara de Plátano',
    compostLevel: 'Alto',
    description: 'Excelente para compostaje, rico en potasio',
    decompositionTime: '2-5 semanas',
    imageUrl: 'https://supqtyexvbtahaja.public.blob.vercel-storage.com/platano-q1hYafCyHpULrrHmQeQkXiVOC2Eric.png',
    tips: 'Las cáscaras de plátano son ideales para añadir potasio a tu compost.',
    compostable: true
  },
  'apple': {
    name: 'Restos de Manzana',
    compostLevel: 'Medio',
    description: 'Bueno para compost, equilibra el pH',
    decompositionTime: '1-3 semanas',
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    tips: 'Corta los restos de manzana en trozos pequeños para acelerar su descomposición.',
    compostable: true
  },
  'plastic': {
    name: 'Botella de Plástico',
    compostLevel: 'No Compostable',
    description: 'Debe reciclarse, no es biodegradable',
    decompositionTime: '450+ años',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    tips: 'Asegúrate de limpiar y aplastar la botella antes de reciclarla.',
    compostable: false
  }
};

// Componente de animación de verificación personalizado
const CheckAnimation = ({ size = 100, color = "#4CAF50" }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(2)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.back(1.5)),
    }).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
        position: 'absolute',
        bottom: -30,
        right: -30,
      }}
    >
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
      >
        <MaterialIcons name="check-circle" size={size * 0.6} color={color} />
      </Animated.View>
    </Animated.View>
  );
};

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  // Referencias para animaciones
  const cameraRef = useRef(null);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scanProgressAnim = useRef(new Animated.Value(0)).current;
  const resultScaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scannerOpacityAnim = useRef(new Animated.Value(0)).current;
  const scannerScaleAnim = useRef(new Animated.Value(0.9)).current;

  // Solicitar permisos de cámara
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Animación de entrada del escáner
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scannerOpacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scannerScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Gestionar animaciones de escaneo
  useEffect(() => {
    if (scanning) {
      // Vibración al iniciar el escaneo
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Animación de línea de escaneo
      Animated.loop(
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
      
      // Animación de pulso del marco
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Animación de rotación de los iconos de escaneo
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
      
      // Animación de la barra de progreso
      Animated.timing(scanProgressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.cubic),
      }).start();

      // Simular detección después de 3 segundos
      setTimeout(() => {
        // Elegir un resultado aleatorio
        const resultKeys = Object.keys(MOCK_RESULTS);
        const randomKey = resultKeys[Math.floor(Math.random() * resultKeys.length)];
        const result = MOCK_RESULTS[randomKey];
        
        // Guardar el resultado
        setScanResult(result);
        
        // Vibración al completar el escaneo
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        
        // Mostrar animación de completado
        setScanComplete(true);
        setScanning(false);
        
        // Animar la aparición del resultado
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(resultScaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.elastic(1),
          }),
        ]).start();
        
        // Navegar a la pantalla de resultados después de mostrar la animación
        setTimeout(() => {
          navigation.navigate('Results', { results: result });
        }, 2000);
      }, 3000);
    } else {
      // Detener todas las animaciones cuando no está escaneando
      scanLineAnim.stopAnimation();
      pulseAnim.stopAnimation();
      rotateAnim.stopAnimation();
      scanProgressAnim.stopAnimation();
    }
  }, [scanning]);

  // Manejar permisos de cámara
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera" size={80} color="#4CAF50" />
        <Text style={styles.permissionText}>Solicitando permisos de cámara...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="no-photography" size={80} color="#FF5252" />
        <Text style={styles.permissionText}>No hay acceso a la cámara</Text>
        <Text style={styles.permissionSubtext}>
          Para usar el escáner, necesitamos acceso a tu cámara.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.permissionButtonText}>Solicitar Acceso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Interpolaciones para animaciones
  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_AREA_SIZE],
  });
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const progressWidth = scanProgressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear Residuo</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Cámara */}
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          type="back" // Usando "back" como cadena directamente
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.overlay}
          >
            {/* Área de escaneo */}
            <Animated.View 
              style={[
                styles.scanAreaContainer,
                { 
                  opacity: scannerOpacityAnim,
                  transform: [
                    { scale: scannerScaleAnim },
                    { scale: scanning ? pulseAnim : 1 }
                  ] 
                }
              ]}
            >
              <View style={styles.scanAreaCorner1} />
              <View style={styles.scanAreaCorner2} />
              <View style={styles.scanAreaCorner3} />
              <View style={styles.scanAreaCorner4} />
              
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
              
              {scanning && (
                <View style={styles.scanningOverlay}>
                  <Animated.View style={[styles.scanningIcon, { transform: [{ rotate }] }]}>
                    <MaterialIcons name="settings" size={24} color="#4CAF50" />
                  </Animated.View>
                </View>
              )}
            </Animated.View>

            {/* Animación de resultado */}
            {scanComplete && (
              <Animated.View 
                style={[
                  styles.resultContainer,
                  { transform: [{ scale: resultScaleAnim }] }
                ]}
              >
                <View style={styles.resultContent}>
                  <View style={styles.resultImageContainer}>
                    <Image 
                      source={{ uri: scanResult.imageUrl }} 
                      style={styles.resultImage} 
                      resizeMode="cover"
                    />
                    {scanResult.compostable && (
                      <View style={styles.compostableBadge}>
                        <MaterialIcons name="eco" size={16} color="#fff" />
                      </View>
                    )}
                  </View>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultTitle}>{scanResult.name}</Text>
                    <View style={[
                      styles.resultLevelBadge, 
                      { 
                        backgroundColor: scanResult.compostable 
                          ? '#E8F5E9' 
                          : '#FFEBEE' 
                      }
                    ]}>
                      <Text style={[
                        styles.resultLevel,
                        { 
                          color: scanResult.compostable 
                            ? '#2E7D32' 
                            : '#C62828' 
                        }
                      ]}>
                        {scanResult.compostLevel}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Animación de verificación personalizada */}
                {scanComplete && <CheckAnimation />}
              </Animated.View>
            )}

            {/* Información y controles */}
            <Animated.View 
              style={[
                styles.infoContainer,
                { opacity: fadeAnim }
              ]}
            >
              {scanning ? (
                <>
                  <Text style={styles.scanningText}>Analizando residuo...</Text>
                  <View style={styles.progressBarContainer}>
                    <Animated.View 
                      style={[
                        styles.progressBar,
                        { width: progressWidth }
                      ]} 
                    />
                  </View>
                  <Text style={styles.scanningSubtext}>
                    Mantenga el objeto centrado
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.infoText}>
                    Coloque el residuo en el centro
                  </Text>
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={() => setScanning(true)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#2E7D32']}
                      style={styles.scanButtonGradient}
                    >
                      <MaterialIcons name="camera" size={28} color="#fff" />
                      <Text style={styles.scanButtonText}>Escanear</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <View style={styles.tipContainer}>
                    <Ionicons name="bulb-outline" size={16} color="#FFC107" />
                    <Text style={styles.tipText}>
                      Para mejores resultados, use buena iluminación
                    </Text>
                  </View>
                </>
              )}
            </Animated.View>
          </LinearGradient>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  cameraContainer: {
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
  scanAreaContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.7)',
    backgroundColor: 'transparent',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  scanAreaCorner1: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#4CAF50',
    borderTopLeftRadius: 20,
  },
  scanAreaCorner2: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#4CAF50',
    borderTopRightRadius: 20,
  },
  scanAreaCorner3: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#4CAF50',
    borderBottomLeftRadius: 20,
  },
  scanAreaCorner4: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#4CAF50',
    borderBottomRightRadius: 20,
  },
  scanLine: {
    height: 3,
    width: '100%',
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    position: 'absolute',
    top: 0,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  scanButton: {
    width: 200,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tipText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.9,
  },
  scanningText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scanningSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginTop: 8,
  },
  progressBarContainer: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  resultContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: width * 0.85,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  resultImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  compostableBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  resultLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  resultLevel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});