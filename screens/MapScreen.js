import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Dimensions, 
  TouchableOpacity, 
  Animated,
  Platform
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Datos de ejemplo mejorados
const WASTE_BINS = [
  {
    id: 1,
    title: 'Contenedor Orgánico',
    description: 'Área de Ciencias - CUCEI',
    type: 'organic',
    distance: '120m',
    coordinate: {
      latitude: 20.6548611,
      longitude: -103.3254497,
    },
  },
  {
    id: 2,
    title: 'Contenedor Plásticos',
    description: 'Cafetería Central - CUCEI',
    type: 'plastic',
    distance: '250m',
    coordinate: {
      latitude: 20.658667,
      longitude: -103.3265211,
    },
  },
  {
    id: 3,
    title: 'Contenedor Papel',
    description: 'Biblioteca - CUCEI',
    type: 'paper',
    distance: '180m',
    coordinate: {
      latitude: 20.6563272,
      longitude: -103.3266746,
    },
  },
  {
    id: 4,
    title: 'Contenedor Vidrio',
    description: 'Entrada Principal - CUCEI',
    type: 'glass',
    distance: '300m',
    coordinate: {
      latitude: 20.6568611,
      longitude: -103.3274497,
    },
  },
  // Nuevos contenedores cercanos a CUCEI
  {
    id: 5,
    title: 'Contenedor Orgánico',
    description: 'Pasillo Central - CUCEI',
    type: 'organic',
    distance: '150m',
    coordinate: {
      latitude: 20.6555000,
      longitude: -103.3259000,
    },
  },
  {
    id: 6,
    title: 'Contenedor Plásticos',
    description: 'Frente al Auditorio - CUCEI',
    type: 'plastic',
    distance: '200m',
    coordinate: {
      latitude: 20.6572000,
      longitude: -103.3245000,
    },
  },
  {
    id: 7,
    title: 'Contenedor Papel',
    description: 'Laboratorios de Ingeniería - CUCEI',
    type: 'paper',
    distance: '220m',
    coordinate: {
      latitude: 20.6542000,
      longitude: -103.3270000,
    },
  },
  {
    id: 8,
    title: 'Contenedor Vidrio',
    description: 'Entrada Secundaria - CUCEI',
    type: 'glass',
    distance: '280m',
    coordinate: {
      latitude: 20.6559000,
      longitude: -103.3263000,
    },
  },
];


export default function MapScreen({ navigation }) {
  const [selectedBin, setSelectedBin] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Función para obtener el color e icono según el tipo de contenedor
  const getBinTypeInfo = (type) => {
    switch (type) {
      case 'organic':
        return { 
          color: '#4CAF50', 
          icon: 'leaf',
          label: 'Orgánico'
        };
      case 'plastic':
        return { 
          color: '#2196F3', 
          icon: 'wine-bottle',
          label: 'Plástico'
        };
      case 'paper':
        return { 
          color: '#FFC107', 
          icon: 'newspaper',
          label: 'Papel'
        };
      case 'glass':
        return { 
          color: '#9C27B0', 
          icon: 'glass-martini-alt',
          label: 'Vidrio'
        };
      default:
        return { 
          color: '#4CAF50', 
          icon: 'trash',
          label: 'General'
        };
    }
  };

  // Función para centrar el mapa en un marcador
  const focusMarker = (marker) => {
    setSelectedBin(marker);
    mapRef.current?.animateToRegion({
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Puntos de Reciclaje</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 20.6548611,
          longitude: -103.3254497,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
      >
        {WASTE_BINS.map((bin) => {
          const { color, icon } = getBinTypeInfo(bin.type);
          return (
            <Marker
              key={bin.id}
              coordinate={bin.coordinate}
              onPress={() => setSelectedBin(bin)}
              tracksViewChanges={false} // Mejora el rendimiento
            >
              <View style={[styles.markerContainer, { backgroundColor: color }]}>
                <FontAwesome5 name={icon} size={16} color="#fff" />
              </View>
              <Callout
                tooltip
                onPress={() => {}} // Evita el error de bubbling event types
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{bin.title}</Text>
                  <Text style={styles.calloutDescription}>{bin.description}</Text>
                  <Text style={styles.calloutDistance}>
                    <MaterialIcons name="directions-walk" size={14} color="#666" /> {bin.distance}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Leyenda */}
      <View style={styles.legendContainer}>
        {['organic', 'plastic', 'paper', 'glass'].map((type) => {
          const { color, icon, label } = getBinTypeInfo(type);
          return (
            <View key={type} style={styles.legendItem}>
              <View style={[styles.legendIcon, { backgroundColor: color }]}>
                <FontAwesome5 name={icon} size={12} color="#fff" />
              </View>
              <Text style={styles.legendText}>{label}</Text>
            </View>
          );
        })}
      </View>

      {/* Panel de información del contenedor seleccionado */}
      {selectedBin && (
        <Animated.View 
          style={[
            styles.binInfoPanel,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.binInfoHeader}>
            <View style={styles.binInfoTitleContainer}>
              <Text style={styles.binInfoTitle}>{selectedBin.title}</Text>
              <Text style={styles.binInfoSubtitle}>{selectedBin.description}</Text>
            </View>
            <TouchableOpacity 
              style={styles.directionButton}
              onPress={() => {
                // Aquí podrías abrir Google Maps con direcciones
                alert('Abriendo direcciones...');
              }}
            >
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.directionButtonGradient}
              >
                <MaterialIcons name="directions" size={20} color="#fff" />
                <Text style={styles.directionButtonText}>Ir</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <View style={styles.binInfoDetails}>
            <View style={styles.binInfoDetail}>
              <MaterialIcons name="access-time" size={18} color="#666" />
              <Text style={styles.binInfoDetailText}>Disponible 24/7</Text>
            </View>
            <View style={styles.binInfoDetail}>
              <MaterialIcons name="directions-walk" size={18} color="#666" />
              <Text style={styles.binInfoDetailText}>{selectedBin.distance} a pie</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.reportButton}
            onPress={() => alert('Reportar problema con este contenedor')}
          >
            <MaterialIcons name="report-problem" size={16} color="#FF9800" />
            <Text style={styles.reportButtonText}>Reportar problema</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  headerRight: {
    width: 40,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 200,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendContainer: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  legendIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  binInfoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  binInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  binInfoTitleContainer: {
    flex: 1,
  },
  binInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  binInfoSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  directionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  directionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  directionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  binInfoDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  binInfoDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  binInfoDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  reportButtonText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 6,
  },
});