import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

// Estos son marcadores de ejemplo, deberías reemplazarlos con las ubicaciones reales
const WASTE_BINS = [
  {
    id: 1,
    title: 'Contenedor A',
    description: 'Área de Ciencias',
    coordinate: {          latitude: 20.6548611,
          longitude: -103.3254497,
    },
  },
  {
    id: 2,
    title: 'Contenedor B',
    description: 'Cafetería Central',
    coordinate: {
      latitude: 19.3332,
      longitude: -99.1875,
    },
  },
  {
    id: 3,
    title: 'Contenedor C',
    description: 'Biblioteca',
    coordinate: {
      latitude: 19.3327,
      longitude: -99.1868,
    },
  },
];

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{          latitude: 20.6548611,
          longitude: -103.3254497,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {WASTE_BINS.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={bin.coordinate}
          >
            <MaterialIcons name="delete" size={30} color="#4CAF50" />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{bin.title}</Text>
                <Text style={styles.calloutDescription}>{bin.description}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View style={styles.legend}>
        <MaterialIcons name="delete" size={24} color="#4CAF50" />
        <Text style={styles.legendText}>Contenedores de Residuos Orgánicos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  callout: {
    padding: 10,
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2E7D32',
  },
  calloutDescription: {
    fontSize: 14,
    color: '#666',
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  legendText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2E7D32',
  },
});