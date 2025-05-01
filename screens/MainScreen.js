"use client"

import { useEffect, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Logo } from "../components/Logo"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Haptics from "expo-haptics"

const { width } = Dimensions.get("window")

const MOCK_STATS = {
  totalScans: 45,
  thisWeek: 12,
  impactScore: 85,
  lastScan: "Cáscara de Plátano",
}

// Usando imágenes generadas por IA para los elementos escaneados
const TIPS = [
  "Las cáscaras de frutas son excelentes para el compostaje por su alto contenido en nutrientes.",
  "Reciclar una botella de plástico ahorra suficiente energía para alimentar una bombilla durante 3 horas.",
  "El compostaje puede reducir hasta un 30% de los residuos domésticos.",
  "Los restos de café son excelentes para el jardín y repelen plagas naturalmente.",
]

// Componente de animación de plátano
const AnimatedBanana = ({ style, size = 80 }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0.7)).current

  useEffect(() => {
    // Animación de rotación
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Animación de escala
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Animación de opacidad
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-10deg", "10deg"],
  })

  return (
    <Animated.View
      style={[
        {
          transform: [{ rotate }, { scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <Image
        source={"https://supqtyexvbtahaja.public.blob.vercel-storage.com/platano-q1hYafCyHpULrrHmQeQkXiVOC2Eric.png"}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Animated.View>
  )
}

export default function MainScreen({ navigation }) {
  const [recentItems, setRecentItems] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const tipIndex = useRef(Math.floor(Math.random() * TIPS.length)).current

  // Animaciones adicionales para elementos individuales
  const cardAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  const loadRecentHistory = async () => {
    try {
      setHistoryLoading(true)
      const historyJSON = await AsyncStorage.getItem("compostHistory")

      if (historyJSON) {
        const parsedHistory = JSON.parse(historyJSON)
        // Ordenar por fecha más reciente y tomar los 3 primeros elementos
        const sortedHistory = parsedHistory
          .sort((a, b) => {
            // Asumiendo que los elementos más recientes están al principio
            return b.id - a.id
          })
          .slice(0, 3)

        setRecentItems(sortedHistory)
      } else {
        setRecentItems([])
      }
    } catch (error) {
      console.error("Error loading history:", error)
      setRecentItems([])
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    // Animación principal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    // Animaciones secuenciales para las tarjetas
    Animated.stagger(150, [
      Animated.timing(cardAnims[0], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnims[1], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnims[2], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnims[3], {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()

    // Cargar historial reciente
    loadRecentHistory()

    // Actualizar cuando la pantalla obtiene foco (volviendo de otra pantalla)
    const unsubscribe = navigation.addListener("focus", () => {
      loadRecentHistory()
    })

    return unsubscribe
  }, [navigation])

  const renderDashboardCard = () => (
    <Animated.View
      style={[
        styles.dashboardCard,
        {
          opacity: cardAnims[0],
          transform: [
            {
              translateY: cardAnims[0].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <MaterialIcons name="dashboard" size={24} color="#2E7D32" />
        <Text style={styles.cardTitle}>Panel de Control</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="assessment" size={24} color="#fff" />
          </View>
          <Text style={styles.statNumber}>{MOCK_STATS.totalScans}</Text>
          <Text style={styles.statLabel}>Total Escaneos</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="trending-up" size={24} color="#fff" />
          </View>
          <Text style={styles.statNumber}>{MOCK_STATS.thisWeek}</Text>
          <Text style={styles.statLabel}>Esta Semana</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <MaterialIcons name="eco" size={24} color="#fff" />
          </View>
          <Text style={styles.statNumber}>{MOCK_STATS.impactScore}</Text>
          <Text style={styles.statLabel}>Impacto</Text>
        </View>
      </View>
    </Animated.View>
  )

  const renderRecentActivity = () => (
    <Animated.View
      style={[
        styles.recentCard,
        {
          opacity: cardAnims[2],
          transform: [
            {
              translateY: cardAnims[2].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <MaterialIcons name="history" size={24} color="#2E7D32" />
        <Text style={styles.cardTitle}>Actividad Reciente</Text>
      </View>

      {historyLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando actividad reciente...</Text>
        </View>
      ) : recentItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LinearGradient colors={["rgba(76, 175, 80, 0.1)", "rgba(46, 125, 50, 0.2)"]} style={styles.emptyGradient}>
            <AnimatedBanana size={100} style={styles.emptyBanana} />
            <View style={styles.emptyTextContainer}>
              <Text style={styles.emptyTitle}>¡Aún no hay escaneos!</Text>
              <Text style={styles.emptyText}>
                Escanea tu primer residuo para comenzar a construir tu historial de compostaje
              </Text>
              <TouchableOpacity
                style={styles.scanNowButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                  navigation.navigate("Scanner")
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4CAF50", "#2E7D32"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scanNowGradient}
                >
                  <MaterialIcons name="camera-alt" size={20} color="#fff" />
                  <Text style={styles.scanNowText}>Escanear ahora</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      ) : (
        <>
          {recentItems.map((item, index) => {
            // Determinar si es un plátano para usar la imagen personalizada
            const isBanana =
              item.name.toLowerCase().includes("plátano") ||
              item.name.toLowerCase().includes("platano") ||
              item.name.toLowerCase().includes("banana")

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.recentItem, { marginBottom: index < recentItems.length - 1 ? 16 : 0 }]}
                onPress={() => navigation.navigate("Results", { results: item })}
                activeOpacity={0.7}
              >
                <View style={styles.recentImageContainer}>
                  {isBanana ? (
                    <Image
                      source={"https://supqtyexvbtahaja.public.blob.vercel-storage.com/platano-q1hYafCyHpULrrHmQeQkXiVOC2Eric.png"}
                      style={styles.recentItemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image source={{ uri: item.imageUrl }} style={styles.recentItemImage} resizeMode="cover" />
                  )}
                  {item.compostable && (
                    <View style={styles.compostableBadge}>
                      <MaterialIcons name="eco" size={12} color="#fff" />
                    </View>
                  )}
                </View>

                <View style={styles.recentInfo}>
                  <Text style={styles.recentName}>{item.name}</Text>
                  <Text style={styles.recentDate}>{item.date}</Text>

                  <View
                    style={[
                      styles.levelBadge,
                      {
                        backgroundColor:
                          item.compostLevel === "Alto"
                            ? "#E8F5E9"
                            : item.compostLevel === "Medio"
                              ? "#FFF8E1"
                              : "#E3F2FD",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.recentLevel,
                        {
                          color:
                            item.compostLevel === "Alto"
                              ? "#2E7D32"
                              : item.compostLevel === "Medio"
                                ? "#FF8F00"
                                : "#1976D2",
                        },
                      ]}
                    >
                      {item.compostLevel}
                    </Text>
                  </View>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            )
          })}

          <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("History")}>
            <Text style={styles.viewAllText}>Ver todo el historial</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#2E7D32" />
          </TouchableOpacity>
        </>
      )}
    </Animated.View>
  )

  const renderTipCard = () => (
    <Animated.View
      style={[
        styles.tipCard,
        {
          opacity: cardAnims[3],
          transform: [
            {
              translateY: cardAnims[3].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate("Tips")}>
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tipGradient}
        >
          <View style={styles.tipIconContainer}>
            <MaterialIcons name="lightbulb" size={24} color="#fff" />
          </View>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Tip del día</Text>
            <Text style={styles.tipText}>{TIPS[tipIndex]}</Text>
            <View style={styles.tipFooter}>
              <Text style={styles.tipFooterText}>Ver más tips</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )

  const renderActionButtons = () => (
    <Animated.View
      style={[
        styles.actionButtons,
        {
          opacity: cardAnims[1],
          transform: [
            {
              translateY: cardAnims[1].interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.mainActionButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          navigation.navigate("Scanner")
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.scanIconContainer}>
            <MaterialIcons name="camera-alt" size={28} color="#fff" />
          </View>
          <Text style={styles.mainActionText}>Nuevo Escaneo</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.secondaryActions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("History")}
          activeOpacity={0.7}
        >
          <View style={styles.secondaryIconContainer}>
            <MaterialIcons name="history" size={22} color="#2E7D32" />
          </View>
          <Text style={styles.secondaryButtonText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Map")} activeOpacity={0.7}>
          <View style={styles.secondaryIconContainer}>
            <MaterialIcons name="place" size={22} color="#2E7D32" />
          </View>
          <Text style={styles.secondaryButtonText}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Tips")}
          activeOpacity={0.7}
        >
          <View style={styles.secondaryIconContainer}>
            <MaterialIcons name="lightbulb" size={22} color="#2E7D32" />
          </View>
          <Text style={styles.secondaryButtonText}>Tips</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
          }}
          style={styles.header}
          resizeMode="cover"
        >
          <LinearGradient colors={["rgba(46, 125, 50, 0.85)", "rgba(46, 125, 50, 0.95)"]} style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <Logo size={80} color="#fff" />
              <Text style={styles.title}>EcoGarden</Text>
              <Text style={styles.subtitle}>CUCEI - Universidad de Guadalajara</Text>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {renderDashboardCard()}
            {renderActionButtons()}
            {renderRecentActivity()}
            {renderTipCard()}

            <View style={styles.footer}>
              <Text style={styles.footerText}>EcoClassifier v1.0 • Desarrollado con 💚</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 300,
    width: "100%",
  },
  headerGradient: {
    height: "100%",
    width: "100%",
  },
  headerContent: {
    padding: 20,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginTop: 5,
    textAlign: "center",
  },
  content: {
    padding: 20,
    marginTop: -40,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 10,
  },
  dashboardCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  actionButtons: {
    marginBottom: 24,
  },
  mainActionButton: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scanIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  mainActionText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  secondaryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: "#2E7D32",
    fontWeight: "600",
    fontSize: 14,
  },
  recentCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  recentItemImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  compostableBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  recentInfo: {
    flex: 1,
    marginRight: 8,
  },
  recentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  recentDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  recentLevel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 12,
    backgroundColor: "#F0F9F0",
    borderRadius: 12,
  },
  viewAllText: {
    color: "#2E7D32",
    fontWeight: "600",
    marginRight: 8,
    fontSize: 14,
  },
  tipCard: {
    borderRadius: 24,
    marginBottom: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  tipGradient: {
    flexDirection: "row",
    padding: 24,
    alignItems: "center",
  },
  tipIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
  },
  tipFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  tipFooterText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginRight: 4,
    opacity: 0.9,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  emptyContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 10,
  },
  emptyGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  emptyBanana: {
    marginRight: 16,
  },
  emptyTextContainer: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  scanNowButton: {
    alignSelf: "flex-start",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  scanNowGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  scanNowText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
})
