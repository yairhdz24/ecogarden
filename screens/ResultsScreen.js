"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Easing, ScrollView, Dimensions } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Haptics from "expo-haptics"

const { width } = Dimensions.get("window")

// Componente de botón animado para volver al inicio
const HomeButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const glowAnim = useRef(new Animated.Value(0)).current

  // Animación al presionar el botón
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start()
  }

  // Animación al soltar el botón
  const handlePressOut = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // Animación continua de rotación sutil para la imagen del plátano
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    )

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: false,
        }),
      ]),
    )

    rotateAnimation.start()
    glowAnimation.start()

    return () => {
      rotateAnimation.stop()
      glowAnimation.stop()
    }
  }, [])

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-5deg", "5deg"],
  })

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.8, 0.2],
  })

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        shadowColor: "#4CAF50",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          onPress()
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.homeButtonContainer}
      >
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.homeButtonGradient}
        >
          <View style={styles.homeButtonContent}>
            <View style={styles.homeButtonTextContainer}>
              <Text style={styles.homeButtonText}>Volver al Inicio</Text>
              <Text style={styles.homeButtonSubtext}>Continuar reciclando</Text>
            </View>

            <View style={styles.imageContainer}>
              <Animated.Image
                source={"https://supqtyexvbtahaja.public.blob.vercel-storage.com/platano-q1hYafCyHpULrrHmQeQkXiVOC2Eric.png"}
                style={[styles.bananaImage, { transform: [{ rotate }] }]}
                resizeMode="cover"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function ResultsScreen({ route, navigation }) {
  const { results } = route.params || {}
  const fadeAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Animación de pulso para destacar elementos importantes
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
      ]),
    ).start()
  }, [])

  // Determinar si es un plátano para usar la imagen personalizada
  const isBanana =
    results &&
    (results.name.toLowerCase().includes("plátano") ||
      results.name.toLowerCase().includes("platano") ||
      results.name.toLowerCase().includes("banana"))

  if (!results) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={80} color="#FF5252" />
        <Text style={styles.errorText}>No se encontraron resultados</Text>
        <HomeButton onPress={() => navigation.navigate("Main")} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resultado del Escaneo</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Tarjeta de resultado principal */}
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View style={styles.resultImageContainer}>
                {isBanana ? (
                  <Image
                    source={"https://supqtyexvbtahaja.public.blob.vercel-storage.com/platano-q1hYafCyHpULrrHmQeQkXiVOC2Eric.png"}
                    style={styles.resultImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Image source={{ uri: results.imageUrl }} style={styles.resultImage} resizeMode="cover" />
                )}
                {results.compostable && (
                  <View style={styles.compostableBadge}>
                    <MaterialIcons name="eco" size={16} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.resultHeaderInfo}>
                <Text style={styles.resultTitle}>{results.name}</Text>
                <View
                  style={[
                    styles.resultLevelBadge,
                    {
                      backgroundColor: results.compostable ? "#E8F5E9" : "#FFEBEE",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.resultLevel,
                      {
                        color: results.compostable ? "#2E7D32" : "#C62828",
                      },
                    ]}
                  >
                    {results.compostLevel}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.resultDetails}>
              <Text style={styles.resultDescription}>{results.description}</Text>

              <View style={styles.resultInfoItem}>
                <MaterialIcons name="access-time" size={20} color="#666" />
                <Text style={styles.resultInfoText}>Tiempo de descomposición: {results.decompositionTime}</Text>
              </View>

              <TouchableOpacity style={styles.tipBox} onPress={() => navigation.navigate("Tips")} activeOpacity={0.8}>
                <View style={styles.tipHeader}>
                  <MaterialIcons name="lightbulb" size={20} color="#FFC107" />
                  <Text style={styles.tipTitle}>Consejo</Text>
                </View>
                <Text style={styles.tipText}>{results.tips}</Text>
                <View style={styles.tipFooter}>
                  <Text style={styles.tipFooterText}>Ver más consejos</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#4CAF50" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón para volver al inicio */}
          <HomeButton onPress={() => navigation.navigate("Main")} />

          {/* Espacio adicional al final */}
          <View style={{ height: 40 }} />
        </Animated.View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2E7D32",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  compostableBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  resultHeaderInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  resultLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  resultLevel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  resultDetails: {
    gap: 16,
  },
  resultDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  resultInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  resultInfoText: {
    fontSize: 15,
    color: "#666",
  },
  tipBox: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57F17",
  },
  tipText: {
    fontSize: 15,
    color: "#5D4037",
    lineHeight: 22,
  },
  tipFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  tipFooterText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginRight: 4,
  },
  homeButtonContainer: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    marginTop: 8,
  },
  homeButtonGradient: {
    borderRadius: 16,
  },
  homeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  homeButtonTextContainer: {
    flex: 1,
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButtonSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  bananaImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
})
