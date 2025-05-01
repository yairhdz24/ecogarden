"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  FlatList,
} from "react-native"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Haptics from "expo-haptics"

const { width } = Dimensions.get("window")
const CARD_WIDTH = width * 0.85

// Categorías de tips
const TIP_CATEGORIES = [
  {
    id: "compost",
    title: "Compostaje",
    icon: "compost",
    color: "#4CAF50",
    gradient: ["#4CAF50", "#2E7D32"],
    image: "https://images.unsplash.com/photo-1591108986071-3f2ef8c7b3d4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "recycle",
    title: "Reciclaje",
    icon: "recycle",
    color: "#2196F3",
    gradient: ["#2196F3", "#1565C0"],
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "garden",
    title: "Jardinería",
    icon: "flower",
    color: "#FF9800",
    gradient: ["#FF9800", "#F57C00"],
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "eco",
    title: "Eco-Vida",
    icon: "leaf",
    color: "#9C27B0",
    gradient: ["#9C27B0", "#7B1FA2"],
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
  },
]

// Tips por categoría
const TIPS_DATA = {
  compost: [
    {
      id: "c2",
      title: "Aireación Adecuada",
      description:
        "Voltea tu pila de compost cada 1-2 semanas para proporcionar oxígeno a los microorganismos y acelerar el proceso de descomposición.",
      icon: "wind",
      image: "https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "c3",
      title: "Humedad Correcta",
      description:
        "Tu compost debe tener la humedad de una esponja exprimida. Si está muy seco, añade agua; si está muy húmedo, añade materiales secos.",
      icon: "water",
      image: "https://images.unsplash.com/photo-1495908333425-29a1e0918c5f?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "c4",
      title: "Tamaño Importa",
      description:
        "Corta los materiales en trozos pequeños para acelerar su descomposición. Cuanto más pequeños sean los trozos, más rápido se descompondrán.",
      icon: "scissors-cutting",
      image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d9a?q=80&w=1000&auto=format&fit=crop",
    },
  ],
  recycle: [
    {
      id: "r1",
      title: "Limpia Antes de Reciclar",
      description:
        "Enjuaga los envases antes de reciclarlos para evitar la contaminación de otros materiales reciclables.",
      icon: "water-pump",
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "r2",
      title: "Conoce los Símbolos",
      description:
        "Aprende a identificar los símbolos de reciclaje en los productos para saber cómo desecharlos correctamente.",
      icon: "information",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "r3",
      title: "Aplasta los Envases",
      description:
        "Aplasta las botellas de plástico y las latas para ahorrar espacio en los contenedores de reciclaje.",
      icon: "arrow-collapse",
      image: "https://images.unsplash.com/photo-1550431241-a2b960657a6e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "r4",
      title: "Separa Correctamente",
      description:
        "Separa los diferentes tipos de materiales reciclables (papel, plástico, vidrio, metal) para facilitar el proceso de reciclaje.",
      icon: "sort",
      image: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=1000&auto=format&fit=crop",
    },
  ],
  garden: [
    {
      id: "g1",
      title: "Compañeros de Cultivo",
      description:
        "Planta tomates junto a albahaca para mejorar su sabor y repeler plagas. La asociación de cultivos puede aumentar la productividad.",
      icon: "sprout",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "g2",
      title: "Riego Eficiente",
      description:
        "Riega tus plantas temprano en la mañana para reducir la evaporación y permitir que las hojas se sequen durante el día, previniendo enfermedades.",
      icon: "watering-can",
      image: "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "g3",
      title: "Acolchado Natural",
      description:
        "Usa hojas secas o paja como acolchado para conservar la humedad del suelo, suprimir las malas hierbas y añadir nutrientes.",
      icon: "grass",
      image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "g4",
      title: "Rotación de Cultivos",
      description:
        "Cambia la ubicación de tus cultivos cada temporada para prevenir el agotamiento del suelo y reducir problemas de plagas y enfermedades.",
      icon: "rotate-3d",
      image: "https://images.unsplash.com/photo-1557844352-761f2565b576?q=80&w=1000&auto=format&fit=crop",
    },
  ],
  eco: [
    {
      id: "e1",
      title: "Bolsas Reutilizables",
      description:
        "Lleva siempre contigo bolsas reutilizables para tus compras y evita el uso de bolsas de plástico desechables.",
      icon: "shopping",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "e2",
      title: "Ahorra Energía",
      description:
        "Desconecta los aparatos electrónicos cuando no los estés usando para reducir el consumo de energía en espera.",
      icon: "power-plug-off",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "e3",
      title: "Reduce el Desperdicio",
      description: "Planifica tus comidas y compra solo lo que necesitas para reducir el desperdicio de alimentos.",
      icon: "food-apple",
      image: "https://images.unsplash.com/photo-1511994714008-b6d68a8b32a2?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "e4",
      title: "Transporte Sostenible",
      description:
        "Utiliza la bicicleta, camina o usa el transporte público siempre que sea posible para reducir tu huella de carbono.",
      icon: "bike",
      image: "https://images.unsplash.com/photo-1519583272095-6433daf26b6e?q=80&w=1000&auto=format&fit=crop",
    },
  ],
}

// Componente de tarjeta de tip
const TipCard = ({ tip, category }) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }, [])

  const getCategoryColor = () => {
    const cat = TIP_CATEGORIES.find((c) => c.id === category)
    return cat ? cat.color : "#4CAF50"
  }

  return (
    <Animated.View style={[styles.tipCard, { transform: [{ scale: scaleAnim }] }]}>
      <Image source={{ uri: tip.image }} style={styles.tipImage} resizeMode="cover" />
      <View style={styles.tipContent}>
        <View style={styles.tipHeader}>
          <MaterialCommunityIcons name={tip.icon} size={24} color={getCategoryColor()} style={styles.tipIcon} />
          <Text style={styles.tipTitle}>{tip.title}</Text>
        </View>
        <Text style={styles.tipDescription}>{tip.description}</Text>
      </View>
    </Animated.View>
  )
}

export default function TipsScreen({ navigation }) {
  const [activeCategory, setActiveCategory] = useState("compost")
  const scrollX = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const flatListRef = useRef(null)

  useEffect(() => {
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
  }, [])

  const handleCategoryPress = (categoryId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setActiveCategory(categoryId)
  }

  const renderTipItem = ({ item }) => (
    <View style={styles.tipCardContainer}>
      <TipCard tip={item} category={activeCategory} />
    </View>
  )

  const renderCategoryButton = (category) => {
    const isActive = activeCategory === category.id

    return (
      <TouchableOpacity
        key={category.id}
        style={[styles.categoryButton, isActive && { backgroundColor: category.color }]}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name={category.icon} size={24} color={isActive ? "#fff" : category.color} />
        <Text style={[styles.categoryButtonText, isActive && { color: "#fff" }]}>{category.title}</Text>
      </TouchableOpacity>
    )
  }

  const getActiveCategoryData = () => {
    const category = TIP_CATEGORIES.find((c) => c.id === activeCategory)
    return {
      tips: TIPS_DATA[activeCategory] || [],
      ...category,
    }
  }

  const activeCategoryData = getActiveCategoryData()

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <LinearGradient colors={activeCategoryData.gradient} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tips Eco-Friendly</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {TIP_CATEGORIES.map((category) => renderCategoryButton(category))}
        </ScrollView>
      </View>

      {/* Contenido principal */}
      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Banner de categoría */}
        <View style={styles.categoryBanner}>
          <LinearGradient
            colors={activeCategoryData.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.categoryBannerGradient}
          >
            <View style={styles.categoryBannerContent}>
              <MaterialCommunityIcons name={activeCategoryData.icon} size={36} color="#fff" />
              <View style={styles.categoryBannerTextContainer}>
                <Text style={styles.categoryBannerTitle}>Tips de {activeCategoryData.title}</Text>
                <Text style={styles.categoryBannerSubtitle}>{activeCategoryData.tips.length} consejos disponibles</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Lista de tips */}
        <FlatList
          ref={flatListRef}
          data={activeCategoryData.tips}
          renderItem={renderTipItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.tipsListContent}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        />

        {/* Indicadores de paginación */}
        <View style={styles.paginationContainer}>
          {activeCategoryData.tips.map((_, index) => {
            const inputRange = [
              (index - 1) * (CARD_WIDTH + 20),
              index * (CARD_WIDTH + 20),
              (index + 1) * (CARD_WIDTH + 20),
            ]

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            })

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: "clamp",
            })

            return (
              <Animated.View
                key={`dot-${index}`}
                style={[
                  styles.paginationDot,
                  {
                    opacity,
                    transform: [{ scale }],
                    backgroundColor: activeCategoryData.color,
                  },
                ]}
              />
            )
          })}
        </View>

        {/* Sección de información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>¿Sabías que...?</Text>

          <View style={styles.factCard}>
            <View style={[styles.factIconContainer, { backgroundColor: activeCategoryData.color }]}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#fff" />
            </View>
            <View style={styles.factContent}>
              {activeCategory === "compost" && (
                <Text style={styles.factText}>
                  El compostaje puede reducir hasta un 30% de los residuos domésticos que van a los vertederos.
                </Text>
              )}
              {activeCategory === "recycle" && (
                <Text style={styles.factText}>
                  Reciclar una lata de aluminio ahorra suficiente energía para mantener un televisor encendido durante 3
                  horas.
                </Text>
              )}
              {activeCategory === "garden" && (
                <Text style={styles.factText}>
                  Las plantas en tu jardín pueden mejorar la calidad del aire y reducir el estrés hasta en un 68%.
                </Text>
              )}
              {activeCategory === "eco" && (
                <Text style={styles.factText}>
                  Usar una botella de agua reutilizable puede evitar cientos de botellas de plástico desechables al año.
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Botón de acción */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: activeCategoryData.color }]}
          onPress={() => navigation.navigate("Guide")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="menu-book" size={24} color="#fff" />
          <Text style={styles.actionButtonText}>Ver Guía Completa</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    width: 40,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesScrollContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  categoryButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  categoryBanner: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryBannerGradient: {
    padding: 16,
  },
  categoryBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryBannerTextContainer: {
    marginLeft: 16,
  },
  categoryBannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  categoryBannerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  tipsListContent: {
    paddingHorizontal: 10,
  },
  tipCardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
  },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipImage: {
    width: "100%",
    height: 150,
  },
  tipContent: {
    padding: 16,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  tipDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  factCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  factIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  factContent: {
    flex: 1,
  },
  factText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
})
