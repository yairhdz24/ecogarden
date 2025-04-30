import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MOCK_HISTORY = [
  {
    id: 1,
    name: 'Cáscara de Plátano',
    date: '2025-04-30',
    compostLevel: 'Alto',
    description: 'Excelente para compostaje, rico en potasio',
  },
  {
    id: 2,
    name: 'Restos de Manzana',
    date: '2025-04-29',
    compostLevel: 'Medio',
    description: 'Bueno para compost, equilibra el pH',
  },
  {
    id: 3,
    name: 'Hojas de Lechuga',
    date: '2025-04-28',
    compostLevel: 'Bajo',
    description: 'Alta humedad, usar con moderación',
  },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.title}>Historial de Escaneos</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {MOCK_HISTORY.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons 
                name="eco" 
                size={24} 
                color={
                  item.compostLevel === 'Alto' ? '#4CAF50' :
                  item.compostLevel === 'Medio' ? '#FFA000' : '#FF5722'
                } 
              />
              <Text style={styles.date}>{item.date}</Text>
            </View>
            
            <Text style={styles.itemName}>{item.name}</Text>
            
            <View style={styles.levelContainer}>
              <Text style={styles.levelLabel}>Nivel de Compostaje:</Text>
              <View style={[
                styles.levelBadge,
                {
                  backgroundColor:
                    item.compostLevel === 'Alto' ? '#E8F5E9' :
                    item.compostLevel === 'Medio' ? '#FFF3E0' : '#FBE9E7'
                }
              ]}>
                <Text style={[
                  styles.levelText,
                  {
                    color:
                      item.compostLevel === 'Alto' ? '#2E7D32' :
                      item.compostLevel === 'Medio' ? '#F57C00' : '#D84315'
                  }
                ]}>{item.compostLevel}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
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
  scrollView: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});