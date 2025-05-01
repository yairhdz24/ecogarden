"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native"
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Haptics from "expo-haptics"
import { PieChart } from "react-native-chart-kit"

export default function HistoryScreen({ navigation }) {
  const [history, setHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [showSummary, setShowSummary] = useState(false)
  const [summaryData, setSummaryData] = useState({
    totalItems: 0,
    highLevel: 0,
    mediumLevel: 0,
    lowLevel: 0,
    mostCommon: "",
  })
  const [selectedItem, setSelectedItem] = useState(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)

  // Cargar historial
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      const historyJSON = await AsyncStorage.getItem("compostHistory")

      if (historyJSON) {
        const parsedHistory = JSON.parse(historyJSON)
        setHistory(parsedHistory)
        setFilteredHistory(parsedHistory)

        // Calcular datos de resumen
        calculateSummary(parsedHistory)
      } else {
        setHistory([])
        setFilteredHistory([])
      }
    } catch (error) {
      console.error("Error loading history:", error)
      Alert.alert("Error", "No se pudo cargar el historial")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Calcular datos de resumen
  const calculateSummary = (data) => {
    if (!data || data.length === 0) {
      setSummaryData({
        totalItems: 0,
        highLevel: 0,
        mediumLevel: 0,
        lowLevel: 0,
        mostCommon: "N/A",
      })
      return
    }

    const totalItems = data.length
    let highLevel = 0
    let mediumLevel = 0
    let lowLevel = 0
    const itemCounts = {}

    data.forEach((item) => {
      // Contar por nivel
      if (item.compostLevel === "Alto") highLevel++
      else if (item.compostLevel === "Medio") mediumLevel++
      else if (item.compostLevel === "Bajo") lowLevel++

      // Contar por nombre
      if (itemCounts[item.name]) {
        itemCounts[item.name]++
      } else {
        itemCounts[item.name] = 1
      }
    })

    // Encontrar el más común
    let mostCommon = ""
    let maxCount = 0

    Object.keys(itemCounts).forEach((name) => {
      if (itemCounts[name] > maxCount) {
        maxCount = itemCounts[name]
        mostCommon = name
      }
    })

    setSummaryData({
      totalItems,
      highLevel,
      mediumLevel,
      lowLevel,
      mostCommon,
    })
  }

  // Cargar al inicio
  useEffect(() => {
    loadHistory()

    // Actualizar cuando la pantalla obtiene foco (volviendo de otra pantalla)
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory()
    })

    return unsubscribe
  }, [navigation, loadHistory])

  // Filtrar historial
  useEffect(() => {
    let result = [...history]

    // Aplicar filtro de búsqueda
    if (searchQuery) {
      result = result.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Aplicar filtro de nivel
    if (filter !== "all") {
      result = result.filter((item) => item.compostLevel === filter)
    }

    setFilteredHistory(result)
  }, [searchQuery, filter, history])

  // Eliminar un elemento
  const deleteItem = async (id) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar este elemento?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const updatedHistory = history.filter((item) => item.id !== id)
            await AsyncStorage.setItem("compostHistory", JSON.stringify(updatedHistory))
            setHistory(updatedHistory)
            calculateSummary(updatedHistory)

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          },
        },
      ])
    } catch (error) {
      console.error("Error deleting item:", error)
      Alert.alert("Error", "No se pudo eliminar el elemento")
    }
  }

  // Mostrar detalles de un elemento
  const showItemDetails = (item) => {
    setSelectedItem(item)
    setDetailModalVisible(true)
  }

  // Obtener color según nivel de compostaje
  const getLevelColor = (level) => {
    switch (level) {
      case "Alto":
        return { bg: "#E8F5E9", text: "#2E7D32", icon: "#4CAF50" }
      case "Medio":
        return { bg: "#FFF3E0", text: "#F57C00", icon: "#FFA000" }
      case "Bajo":
        return { bg: "#FBE9E7", text: "#D84315", icon: "#FF5722" }
      default:
        return { bg: "#E8F5E9", text: "#2E7D32", icon: "#4CAF50" }
    }
  }

  // Datos para el gráfico circular
  const chartData = [
    {
      name: "Alto",
      population: summaryData.highLevel,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Medio",
      population: summaryData.mediumLevel,
      color: "#FFA000",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Bajo",
      population: summaryData.lowLevel,
      color: "#FF5722",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ]

  // Función para refrescar
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadHistory()
  }, [loadHistory])

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Historial de Análisis</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.summaryButton} onPress={() => setShowSummary(!showSummary)}>
              <MaterialIcons name={showSummary ? "expand-less" : "expand-more"} size={24} color="#fff" />
              <Text style={styles.summaryButtonText}>Resumen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Sección de resumen */}
      {showSummary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumen de Compostaje</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summaryData.totalItems}</Text>
              <Text style={styles.statLabel}>Total Análisis</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{summaryData.mostCommon}</Text>
              <Text style={styles.statLabel}>Más Común</Text>
            </View>
          </View>

          {summaryData.totalItems > 0 && (
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                width={Dimensions.get("window").width - 32}
                height={180}
                chartConfig={{
                  backgroundColor: "#fff",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          )}

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>
              <MaterialCommunityIcons name="lightbulb-on" size={18} color="#FFC107" />
              Consejos de Compostaje
            </Text>
            <Text style={styles.tipText}>
              • Mezcla materiales verdes (ricos en nitrógeno) y marrones (ricos en carbono)
            </Text>
            <Text style={styles.tipText}>• Mantén la humedad adecuada, similar a una esponja exprimida</Text>
            <Text style={styles.tipText}>• Voltea regularmente para airear y acelerar la descomposición</Text>
          </View>
        </View>
      )}

      {/* Barra de búsqueda y filtros */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "Alto" && styles.filterButtonActive]}
            onPress={() => setFilter("Alto")}
          >
            <Text style={[styles.filterText, filter === "Alto" && styles.filterTextActive]}>Alto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "Medio" && styles.filterButtonActive]}
            onPress={() => setFilter("Medio")}
          >
            <Text style={[styles.filterText, filter === "Medio" && styles.filterTextActive]}>Medio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "Bajo" && styles.filterButtonActive]}
            onPress={() => setFilter("Bajo")}
          >
            <Text style={[styles.filterText, filter === "Bajo" && styles.filterTextActive]}>Bajo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de historial */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="history" size={60} color="#BDBDBD" />
          <Text style={styles.emptyText}>No hay elementos en el historial</Text>
          <Text style={styles.emptySubtext}>Los análisis que guardes aparecerán aquí</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4CAF50"]} />}
        >
          {filteredHistory.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => showItemDetails(item)}
              onLongPress={() => deleteItem(item.id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <MaterialIcons name="eco" size={24} color={getLevelColor(item.compostLevel).icon} />
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
                <Text style={styles.date}>{item.date}</Text>
              </View>

              <View style={styles.levelContainer}>
                <Text style={styles.levelLabel}>Nivel de Compostaje:</Text>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.compostLevel).bg }]}>
                  <Text style={[styles.levelText, { color: getLevelColor(item.compostLevel).text }]}>
                    {item.compostLevel}
                  </Text>
                </View>
              </View>

              <View style={styles.decompositionContainer}>
                <MaterialIcons name="access-time" size={18} color="#4CAF50" />
                <Text style={styles.decompositionText}>{item.decompositionTime}</Text>
              </View>

              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => showItemDetails(item)}>
                  <MaterialIcons name="visibility" size={18} color="#4CAF50" />
                  <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => deleteItem(item.id)}>
                  <MaterialIcons name="delete-outline" size={18} color="#F44336" />
                  <Text style={[styles.actionText, { color: "#F44336" }]}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modal de detalles */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setDetailModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Información General</Text>

                <View style={styles.modalInfoRow}>
                  <MaterialIcons name="calendar-today" size={20} color="#4CAF50" />
                  <Text style={styles.modalInfoText}>
                    Fecha: <Text style={styles.modalHighlight}>{selectedItem?.date}</Text>
                  </Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <MaterialIcons name="eco" size={20} color="#4CAF50" />
                  <Text style={styles.modalInfoText}>
                    Nivel de Compostaje:
                    <Text
                      style={[
                        styles.modalHighlight,
                        { color: selectedItem ? getLevelColor(selectedItem.compostLevel).text : "#2E7D32" },
                      ]}
                    >
                      {" "}
                      {selectedItem?.compostLevel}
                    </Text>
                  </Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <MaterialIcons name="access-time" size={20} color="#4CAF50" />
                  <Text style={styles.modalInfoText}>
                    Tiempo de Descomposición:{" "}
                    <Text style={styles.modalHighlight}>{selectedItem?.decompositionTime}</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Descripción</Text>
                <Text style={styles.modalDescription}>{selectedItem?.description}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Recomendaciones</Text>

                {selectedItem?.compostLevel === "Alto" && (
                  <View style={styles.recommendationCard}>
                    <MaterialCommunityIcons name="sprout" size={24} color="#4CAF50" style={styles.recommendationIcon} />
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Ideal para cultivos exigentes</Text>
                      <Text style={styles.recommendationText}>
                        Este material es excelente para plantas que requieren muchos nutrientes como tomates, calabazas
                        y maíz.
                      </Text>
                    </View>
                  </View>
                )}

                {selectedItem?.compostLevel === "Medio" && (
                  <View style={styles.recommendationCard}>
                    <MaterialCommunityIcons name="sprout" size={24} color="#FFA000" style={styles.recommendationIcon} />
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Bueno para cultivos moderados</Text>
                      <Text style={styles.recommendationText}>
                        Este material es adecuado para plantas de requerimiento medio como lechugas, hierbas aromáticas
                        y zanahorias.
                      </Text>
                    </View>
                  </View>
                )}

                {selectedItem?.compostLevel === "Bajo" && (
                  <View style={styles.recommendationCard}>
                    <MaterialCommunityIcons name="sprout" size={24} color="#FF5722" style={styles.recommendationIcon} />
                    <View style={styles.recommendationContent}>
                      <Text style={styles.recommendationTitle}>Mejor como complemento</Text>
                      <Text style={styles.recommendationText}>
                        Este material es mejor utilizado como complemento a otros fertilizantes o para plantas con bajos
                        requerimientos nutricionales.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
  },
  summaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  summaryButtonText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  chartContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  tipsContainer: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57F17",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  scrollView: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 8,
  },
  date: {
    color: "#666",
    fontSize: 14,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  decompositionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  decompositionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalInfoText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#666",
  },
  modalHighlight: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  recommendationCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
  },
  recommendationIcon: {
    marginRight: 12,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
})
