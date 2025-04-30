import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../components/Logo';

const MOCK_STATS = {
  totalScans: 45,
  thisWeek: 12,
  impactScore: 85,
  lastScan: 'Cáscara de Plátano',
};

const MOCK_RECENT = [
  { id: 1, name: 'Cáscara de Plátano', level: 'Alto', date: 'Hoy' },
  { id: 2, name: 'Restos de Manzana', level: 'Medio', date: 'Ayer' },
];

export default function MainScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderDashboardCard = () => (
    <View style={styles.dashboardCard}>
      <Text style={styles.dashboardTitle}>Panel de Control</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <MaterialIcons name="assessment" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{MOCK_STATS.totalScans}</Text>
          <Text style={styles.statLabel}>Total Escaneos</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{MOCK_STATS.thisWeek}</Text>
          <Text style={styles.statLabel}>Esta Semana</Text>
        </View>
        
        <View style={styles.statItem}>
          <MaterialIcons name="eco" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>{MOCK_STATS.impactScore}</Text>
          <Text style={styles.statLabel}>Impacto</Text>
        </View>
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.recentCard}>
      <Text style={styles.recentTitle}>Actividad Reciente</Text>
      {MOCK_RECENT.map((item) => (
        <View key={item.id} style={styles.recentItem}>
          <MaterialIcons name="eco" size={24} color="#4CAF50" />
          <View style={styles.recentInfo}>
            <Text style={styles.recentName}>{item.name}</Text>
            <Text style={styles.recentDate}>{item.date}</Text>
          </View>
          <Text style={[styles.recentLevel, { 
            color: item.level === 'Alto' ? '#4CAF50' : '#FFA000'
          }]}>{item.level}</Text>
        </View>
      ))}
    </View>
  );

  const renderTipCard = () => (
    <View style={styles.tipCard}>
      <MaterialIcons name="lightbulb" size={24} color="#4CAF50" />
      <Text style={styles.tipTitle}>Tip del día</Text>
      <Text style={styles.tipText}>
        Las cáscaras de frutas son excelentes para el compostaje por su alto contenido en nutrientes.
      </Text>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={styles.mainActionButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <LinearGradient
          colors={['#4CAF50', '#2E7D32']}
          style={styles.gradient}
        >
          <MaterialIcons name="camera-alt" size={32} color="#fff" />
          <Text style={styles.mainActionText}>Nuevo Escaneo</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.secondaryActions}>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('History')}
        >
          <MaterialIcons name="history" size={24} color="#2E7D32" />
          <Text style={styles.secondaryButtonText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Map')}
        >
          <MaterialIcons name="place" size={24} color="#2E7D32" />
          <Text style={styles.secondaryButtonText}>Mapa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://api.a0.dev/assets/image?text=beautiful%20abstract%20nature%20pattern%20green%20leaves&aspect=16:9' }}
        style={styles.header}
      >
        <LinearGradient
          colors={['rgba(46, 125, 50, 0.9)', 'rgba(46, 125, 50, 0.7)']}
          style={styles.headerGradient}
        >
          <Logo size={60} color="#fff" />
          <Text style={styles.title}>EcoClassifier</Text>
          <Text style={styles.subtitle}>CUCEI - Universidad de Guadalajara</Text>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
          {renderDashboardCard()}
          {renderActionButtons()}
          {renderRecentActivity()}
          {renderTipCard()}
        </Animated.View>
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
    height: 200,
    width: '100%',
  },
  headerGradient: {
    height: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    padding: 16,
  },
  dashboardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    marginBottom: 16,
  },
  mainActionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mainActionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  secondaryButtonText: {
    color: '#2E7D32',
    marginTop: 8,
    fontSize: 14,
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  recentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  recentName: {
    fontSize: 16,
    color: '#333',
  },
  recentDate: {
    fontSize: 12,
    color: '#666',
  },
  recentLevel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 20,
  },
});