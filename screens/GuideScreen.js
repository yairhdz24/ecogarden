"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"

export default function GuideScreen() {
  const [activeCategory, setActiveCategory] = useState("basics")

  const categories = [
    { id: "basics", name: "Conceptos Básicos", icon: "book" },
    { id: "materials", name: "Materiales", icon: "layers" },
    { id: "process", name: "Proceso", icon: "loop" },
    { id: "plants", name: "Plantas", icon: "eco" },
  ]

  const renderContent = () => {
    switch (activeCategory) {
      case "basics":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>¿Qué es el Compostaje?</Text>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1591108986071-3f2ef8c7b3d4?q=80&w=1000&auto=format&fit=crop",
              }}
              style={styles.contentImage}
              resizeMode="cover"
            />
            <Text style={styles.contentText}>
              El compostaje es un proceso natural de descomposición de materia orgánica que transforma los residuos en
              un abono rico en nutrientes. Este proceso es realizado por microorganismos, lombrices e insectos que
              descomponen la materia orgánica en condiciones controladas.
            </Text>

            <Text style={styles.contentSubtitle}>Beneficios del Compostaje</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="recycle" size={24} color="#4CAF50" style={styles.benefitIcon} />
                <Text style={styles.benefitText}>Reduce la cantidad de residuos que van a los vertederos</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="sprout" size={24} color="#4CAF50" style={styles.benefitIcon} />
                <Text style={styles.benefitText}>Mejora la estructura y fertilidad del suelo</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="water" size={24} color="#4CAF50" style={styles.benefitIcon} />
                <Text style={styles.benefitText}>Ayuda a retener la humedad en el suelo</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons name="bacteria" size={24} color="#4CAF50" style={styles.benefitIcon} />
                <Text style={styles.benefitText}>Promueve el crecimiento de microorganismos beneficiosos</Text>
              </View>
            </View>
          </View>
        )

      case "materials":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Materiales para Compostaje</Text>

            <View style={styles.materialSection}>
              <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.materialHeader}>
                <MaterialCommunityIcons name="leaf" size={24} color="#fff" />
                <Text style={styles.materialHeaderText}>Materiales Verdes (Nitrógeno)</Text>
              </LinearGradient>

              <View style={styles.materialList}>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.materialText}>Restos de frutas y verduras</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.materialText}>Césped recién cortado</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.materialText}>Posos de café y filtros</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.materialText}>Bolsas de té (sin grapas)</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.materialText}>Plantas y flores frescas</Text>
                </View>
              </View>
            </View>

            <View style={styles.materialSection}>
              <LinearGradient colors={["#795548", "#5D4037"]} style={styles.materialHeader}>
                <MaterialCommunityIcons name="tree" size={24} color="#fff" />
                <Text style={styles.materialHeaderText}>Materiales Marrones (Carbono)</Text>
              </LinearGradient>

              <View style={styles.materialList}>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#795548" />
                  <Text style={styles.materialText}>Hojas secas</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#795548" />
                  <Text style={styles.materialText}>Ramas y ramitas pequeñas</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#795548" />
                  <Text style={styles.materialText}>Cartón sin tinta (hueveras, rollos de papel)</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#795548" />
                  <Text style={styles.materialText}>Papel de periódico triturado</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="check-circle" size={20} color="#795548" />
                  <Text style={styles.materialText}>Cáscaras de nueces</Text>
                </View>
              </View>
            </View>

            <View style={styles.materialSection}>
              <LinearGradient colors={["#F44336", "#D32F2F"]} style={styles.materialHeader}>
                <MaterialIcons name="block" size={24} color="#fff" />
                <Text style={styles.materialHeaderText}>Materiales a Evitar</Text>
              </LinearGradient>

              <View style={styles.materialList}>
                <View style={styles.materialItem}>
                  <MaterialIcons name="cancel" size={20} color="#F44336" />
                  <Text style={styles.materialText}>Carne, pescado y productos lácteos</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="cancel" size={20} color="#F44336" />
                  <Text style={styles.materialText}>Aceites y grasas</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="cancel" size={20} color="#F44336" />
                  <Text style={styles.materialText}>Excrementos de mascotas</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="cancel" size={20} color="#F44336" />
                  <Text style={styles.materialText}>Plantas enfermas o tratadas con pesticidas</Text>
                </View>
                <View style={styles.materialItem}>
                  <MaterialIcons name="cancel" size={20} color="#F44336" />
                  <Text style={styles.materialText}>Materiales no biodegradables (plástico, metal)</Text>
                </View>
              </View>
            </View>
          </View>
        )

      case "process":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>El Proceso de Compostaje</Text>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1621506821957-1b50ab7787a4?q=80&w=1000&auto=format&fit=crop",
              }}
              style={styles.contentImage}
              resizeMode="cover"
            />

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Preparación</Text>
                <Text style={styles.stepText}>
                  Elige un lugar adecuado para tu compostador, preferiblemente con sombra parcial y protegido de vientos
                  fuertes. Asegúrate de que tenga buen drenaje.
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Capas Iniciales</Text>
                <Text style={styles.stepText}>
                  Comienza con una capa de materiales marrones (ramas pequeñas) para facilitar el drenaje y la
                  aireación. Alterna capas de materiales verdes y marrones.
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Mantenimiento</Text>
                <Text style={styles.stepText}>
                  Mantén la humedad adecuada (como una esponja exprimida). Voltea la pila regularmente para airearla y
                  acelerar la descomposición.
                </Text>
              </View>
            </View>

            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Maduración</Text>
                <Text style={styles.stepText}>
                  El proceso puede tardar entre 3 y 12 meses dependiendo de los materiales y condiciones. El compost
                  está listo cuando tiene un color oscuro, textura suelta y olor a tierra fresca.
                </Text>
              </View>
            </View>

            <View style={styles.tipBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FFC107" style={styles.tipIcon} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Consejo Práctico</Text>
                <Text style={styles.tipText}>
                  Mantén una proporción aproximada de 3 partes de materiales marrones por 1 parte de materiales verdes
                  para un compostaje óptimo.
                </Text>
              </View>
            </View>
          </View>
        )

      case "plants":
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>Plantas y Compostaje</Text>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000&auto=format&fit=crop",
              }}
              style={styles.contentImage}
              resizeMode="cover"
            />

            <Text style={styles.contentText}>
              El compost es un excelente fertilizante natural que puede beneficiar a una amplia variedad de plantas.
              Conoce cómo utilizarlo de manera óptima según el tipo de planta y sus necesidades.
            </Text>

            <Text style={styles.contentSubtitle}>Plantas que Aman el Compost Rico</Text>

            <View style={styles.plantCategory}>
              <View style={styles.plantCategoryHeader}>
                <MaterialCommunityIcons name="food-apple" size={24} color="#4CAF50" />
                <Text style={styles.plantCategoryTitle}>Hortalizas de Fruto</Text>
              </View>

              <View style={styles.plantList}>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#4CAF50" />
                  <Text style={styles.plantListText}>Tomates</Text>
                </View>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#4CAF50" />
                  <Text style={styles.plantListText}>Pimientos</Text>
                </View>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#4CAF50" />
                  <Text style={styles.plantListText}>Berenjenas</Text>
                </View>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#4CAF50" />
                  <Text style={styles.plantListText}>Calabazas</Text>
                </View>
              </View>
            </View>

            <View style={styles.plantCategory}>
              <View style={styles.plantCategoryHeader}>
                <MaterialCommunityIcons name="flower" size={24} color="#E91E63" />
                <Text style={styles.plantCategoryTitle}>Flores y Ornamentales</Text>
              </View>

              <View style={styles.plantList}>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E91E63" />
                  <Text style={styles.plantListText}>Rosas</Text>
                </View>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E91E63" />
                  <Text style={styles.plantListText}>Dalias</Text>
                </View>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E91E63" />
                  <Text style={styles.plantListText}>Girasoles</Text>
                </View>
                <View style={styles.plantListItem}>
                  <MaterialCommunityIcons name="circle-medium" size={24} color="#E91E63" />
                  <Text style={styles.plantListText}>Hortensias</Text>
                </View>
              </View>
            </View>

            <Text style={styles.contentSubtitle}>Cómo Aplicar el Compost</Text>

            <View style={styles.applicationMethod}>
              <View style={styles.applicationIcon}>
                <MaterialCommunityIcons name="shovel" size={28} color="#fff" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Acolchado (Mulching)</Text>
                <Text style={styles.applicationText}>
                  Extiende una capa de 2-5 cm de compost alrededor de las plantas, sin tocar los tallos. Ideal para
                  árboles, arbustos y plantas perennes.
                </Text>
              </View>
            </View>

            <View style={styles.applicationMethod}>
              <View style={styles.applicationIcon}>
                <MaterialCommunityIcons name="water" size={28} color="#fff" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Té de Compost</Text>
                <Text style={styles.applicationText}>
                  Mezcla compost con agua (1:10) y deja reposar 24-48 horas. Utiliza este líquido para regar tus plantas
                  y aportar nutrientes.
                </Text>
              </View>
            </View>

            <View style={styles.applicationMethod}>
              <View style={styles.applicationIcon}>
                <MaterialCommunityIcons name="pot-mix" size={28} color="#fff" />
              </View>
              <View style={styles.applicationContent}>
                <Text style={styles.applicationTitle}>Mezcla para Macetas</Text>
                <Text style={styles.applicationText}>
                  Mezcla 1/3 de compost con 2/3 de tierra para crear un sustrato rico para macetas y semilleros.
                </Text>
              </View>
            </View>

            <View style={styles.tipBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#FFC107" style={styles.tipIcon} />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Consejo para Plantas</Text>
                <Text style={styles.tipText}>
                  Las plantas de hoja verde como lechugas y espinacas se benefician de un compost más maduro y fino,
                  mientras que las plantas de fruto como tomates prefieren un compost más rico en nutrientes.
                </Text>
              </View>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.header}>
        <Text style={styles.title}>Guía de Compostaje</Text>
        <Text style={styles.subtitle}>Aprende a compostar correctamente</Text>
      </LinearGradient>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, activeCategory === category.id && styles.categoryButtonActive]}
              onPress={() => setActiveCategory(category.id)}
            >
              <MaterialIcons
                name={category.icon}
                size={24}
                color={activeCategory === category.id ? "#fff" : "#4CAF50"}
              />
              <Text style={[styles.categoryText, activeCategory === category.id && styles.categoryTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 4,
  },
  categoryContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#F0F8F0",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  categoryButtonActive: {
    backgroundColor: "#4CAF50",
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#4CAF50",
  },
  categoryTextActive: {
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 16,
  },
  contentImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  contentSubtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 8,
    marginBottom: 12,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F0F8F0",
    padding: 12,
    borderRadius: 8,
  },
  benefitIcon: {
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  materialSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  materialHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  materialHeaderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  materialList: {
    padding: 12,
  },
  materialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  materialText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  tipBox: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F57F17",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  plantCategory: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  plantCategoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F0F8F0",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  plantCategoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 8,
  },
  plantList: {
    padding: 12,
  },
  plantListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  plantListText: {
    fontSize: 16,
    color: "#333",
  },
  applicationMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  applicationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  applicationContent: {
    flex: 1,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  applicationText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
})
