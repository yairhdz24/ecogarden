import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen({ route, navigation }) {
  const { results } = route.params;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.title}>Resultado del Análisis</Text>
      </LinearGradient>

      <View style={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Text style={styles.itemName}>{results.name}</Text>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="eco" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>
              Nivel de Compostaje: <Text style={styles.highlight}>{results.compostLevel}</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={24} color="#4CAF50" />
            <Text style={styles.infoText}>
              Tiempo de Descomposición: <Text style={styles.highlight}>{results.decompositionTime}</Text>
            </Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción:</Text>
            <Text style={styles.description}>{results.description}</Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              // Aquí se guardaría en el historial
              navigation.navigate('History');
            }}
          >
            <MaterialIcons name="save-alt" size={24} color="#fff" />
            <Text style={styles.buttonText}>Guardar en Historial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
  highlight: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});