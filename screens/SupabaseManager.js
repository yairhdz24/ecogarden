"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { LinearGradient } from "expo-linear-gradient"
import { supabase } from "./supabase"

const { width, height } = Dimensions.get("window")

const UserManager = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [uploadingImage, setUploadingImage] = useState(false)

  // Campos de usuario actualizados según tu estructura
  const userFields = [
    { key: "id_chat", label: "ID Chat", icon: "chatbubble-ellipses", required: true },
    { key: "nombre", label: "Nombre Completo", icon: "person", required: true },
    { key: "codigo", label: "Código", icon: "barcode", required: true },
    { key: "nip", label: "NIP/Contraseña", icon: "lock-closed", required: true, secure: true },
    {
      key: "tipo",
      label: "Tipo",
      icon: "school",
      required: true,
      type: "select",
      options: ["Alumno", "Practicas profesionales", "Servicio social", "Empleado", "Docente"],
    },
    {
      key: "rol",
      label: "Rol",
      icon: "briefcase",
      required: true,
      type: "select",
      options: ["Backend", "Frontend", "Fullstack", "Mobile", "DevOps", "UI/UX", "QA", "Project Manager"],
    },
    { key: "foto", label: "Foto de Perfil", icon: "camera", type: "image" },
    {
      key: "permisos",
      label: "Nivel de Permisos",
      icon: "shield-checkmark",
      type: "select",
      options: [
        { label: "Básico (1)", value: 1 },
        { label: "Avanzado (3)", value: 3 },
      ],
    },
    { key: "notificaciones", label: "Notificaciones", icon: "notifications", type: "json" },
    { key: "archivado", label: "Estado", icon: "archive", type: "boolean" },
  ]

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("usuarios").select("*").order("id", { ascending: false })

      if (error) {
        Alert.alert("Error", `Error al obtener usuarios: ${error.message}`)
        return
      }

      setUsers(data || [])
      setFilteredUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
      Alert.alert("Error", "Error al conectar con la base de datos")
    } finally {
      setLoading(false)
    }
  }

  // Filtrar usuarios por búsqueda
  const filterUsers = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(
      (user) =>
        user.nombre?.toLowerCase().includes(query.toLowerCase()) ||
        user.codigo?.toLowerCase().includes(query.toLowerCase()) ||
        user.id_chat?.includes(query) ||
        user.tipo?.toLowerCase().includes(query.toLowerCase()) ||
        user.rol?.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }

  // Subir imagen
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permisos requeridos", "Se necesitan permisos para acceder a la galería")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true)

        // Aquí podrías subir la imagen a Supabase Storage
        // Por ahora, solo guardamos la URI local
        const imageUri = result.assets[0].uri
        setFormData({ ...formData, foto: imageUri })

        setUploadingImage(false)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Error al seleccionar imagen")
      setUploadingImage(false)
    }
  }

  // Insertar nuevo usuario
  const insertUser = async () => {
    try {
      // Validar campos requeridos
      const requiredFields = userFields.filter((field) => field.required)
      for (const field of requiredFields) {
        if (!formData[field.key] || !formData[field.key].toString().trim()) {
          Alert.alert("Error", `El campo ${field.label} es requerido`)
          return
        }
      }

      // Preparar datos para insertar
      const userData = { ...formData }

      // Convertir notificaciones a JSON string si es necesario
      if (userData.notificaciones && typeof userData.notificaciones === "object") {
        userData.notificaciones = JSON.stringify(userData.notificaciones)
      } else if (!userData.notificaciones) {
        userData.notificaciones = "[]"
      }

      const { data, error } = await supabase.from("usuarios").insert([userData]).select()

      if (error) {
        Alert.alert("Error", `Error al crear usuario: ${error.message}`)
        return
      }

      Alert.alert("¡Éxito!", "Usuario creado correctamente", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false)
            setFormData({})
            fetchUsers()
          },
        },
      ])
    } catch (error) {
      console.error("Error inserting user:", error)
      Alert.alert("Error", "Error al crear usuario")
    }
  }

  // Actualizar usuario
  const updateUser = async () => {
    try {
      // Validar campos requeridos
      const requiredFields = userFields.filter((field) => field.required)
      for (const field of requiredFields) {
        if (!formData[field.key] || !formData[field.key].toString().trim()) {
          Alert.alert("Error", `El campo ${field.label} es requerido`)
          return
        }
      }

      // Preparar datos para actualizar
      const userData = { ...formData }

      // Convertir notificaciones a JSON string si es necesario
      if (userData.notificaciones && typeof userData.notificaciones === "object") {
        userData.notificaciones = JSON.stringify(userData.notificaciones)
      }

      const { error } = await supabase.from("usuarios").update(userData).eq("id", editingUser.id)

      if (error) {
        Alert.alert("Error", `Error al actualizar usuario: ${error.message}`)
        return
      }

      Alert.alert("¡Éxito!", "Usuario actualizado correctamente", [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false)
            setEditingUser(null)
            setFormData({})
            fetchUsers()
          },
        },
      ])
    } catch (error) {
      console.error("Error updating user:", error)
      Alert.alert("Error", "Error al actualizar usuario")
    }
  }

  // Archivar/Desarchivar usuario
  const toggleArchiveUser = async (user) => {
    const action = user.archivado ? "desarchivar" : "archivar"
    Alert.alert(
      `Confirmar ${action}`,
      `¿Estás seguro de que quieres ${action} a ${user.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: async () => {
            try {
              const { error } = await supabase.from("usuarios").update({ archivado: !user.archivado }).eq("id", user.id)

              if (error) {
                Alert.alert("Error", `Error al ${action} usuario: ${error.message}`)
                return
              }

              Alert.alert("¡Éxito!", `Usuario ${action}do correctamente`)
              fetchUsers()
            } catch (error) {
              console.error(`Error ${action}ing user:`, error)
              Alert.alert("Error", `Error al ${action} usuario`)
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  // Eliminar usuario
  const deleteUser = async (user) => {
    Alert.alert(
      "⚠️ Confirmar eliminación",
      `¿Estás seguro de que quieres eliminar permanentemente a ${user.nombre}?\n\nEsta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.from("usuarios").delete().eq("id", user.id)

              if (error) {
                Alert.alert("Error", `Error al eliminar usuario: ${error.message}`)
                return
              }

              Alert.alert("¡Éxito!", "Usuario eliminado correctamente")
              fetchUsers()
            } catch (error) {
              console.error("Error deleting user:", error)
              Alert.alert("Error", "Error al eliminar usuario")
            }
          },
        },
      ],
      { cancelable: true },
    )
  }

  // Abrir modal para editar
  const openEditModal = (user) => {
    setEditingUser(user)
    const userData = { ...user }

    // Parsear notificaciones si es string JSON
    if (userData.notificaciones && typeof userData.notificaciones === "string") {
      try {
        userData.notificaciones = JSON.parse(userData.notificaciones)
      } catch (e) {
        userData.notificaciones = []
      }
    }

    setFormData(userData)
    setModalVisible(true)
  }

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingUser(null)
    const emptyForm = {
      id_chat: "",
      nombre: "",
      codigo: "",
      nip: "",
      tipo: "Alumno",
      rol: "Backend",
      foto: null,
      permisos: 1,
      notificaciones: [],
      archivado: false,
    }
    setFormData(emptyForm)
    setModalVisible(true)
  }

  // Refrescar datos
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchUsers()
    setRefreshing(false)
  }

  // Renderizar campo de formulario
  const renderFormField = (field) => {
    const value = formData[field.key]

    if (field.type === "image") {
      return (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            <Ionicons name={field.icon} size={16} color="#BB86FC" /> {field.label}
          </Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage} disabled={uploadingImage}>
            {uploadingImage ? (
              <ActivityIndicator size="small" color="#BB86FC" />
            ) : value ? (
              <Image source={{ uri: value }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#666" />
                <Text style={styles.imagePlaceholderText}>Seleccionar foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )
    }

    if (field.type === "select") {
      return (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            <Ionicons name={field.icon} size={16} color="#BB86FC" /> {field.label}
            {field.required && <Text style={styles.required}> *</Text>}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectContainer}>
            {field.options.map((option, index) => {
              const optionValue = typeof option === "object" ? option.value : option
              const optionLabel = typeof option === "object" ? option.label : option
              const isSelected = value === optionValue

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.selectOption, isSelected && styles.selectOptionActive]}
                  onPress={() => setFormData({ ...formData, [field.key]: optionValue })}
                >
                  <Text style={[styles.selectOptionText, isSelected && styles.selectOptionTextActive]}>
                    {optionLabel}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      )
    }

    if (field.type === "boolean") {
      return (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            <Ionicons name={field.icon} size={16} color="#BB86FC" /> {field.label}
          </Text>
          <View style={styles.booleanContainer}>
            <TouchableOpacity
              style={[styles.booleanButton, value === false && styles.booleanButtonActive]}
              onPress={() => setFormData({ ...formData, [field.key]: false })}
            >
              <Ionicons name="checkmark-circle" size={16} color={value === false ? "#fff" : "#666"} />
              <Text style={[styles.booleanText, value === false && styles.booleanTextActive]}>Activo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.booleanButton, value === true && styles.booleanButtonActive]}
              onPress={() => setFormData({ ...formData, [field.key]: true })}
            >
              <Ionicons name="archive" size={16} color={value === true ? "#fff" : "#666"} />
              <Text style={[styles.booleanText, value === true && styles.booleanTextActive]}>Archivado</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    if (field.type === "json") {
      return (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            <Ionicons name={field.icon} size={16} color="#BB86FC" /> {field.label}
          </Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={Array.isArray(value) ? JSON.stringify(value, null, 2) : String(value || "[]")}
            onChangeText={(text) => {
              try {
                const parsed = JSON.parse(text)
                setFormData({ ...formData, [field.key]: parsed })
              } catch (e) {
                setFormData({ ...formData, [field.key]: text })
              }
            }}
            placeholder="[]"
            multiline
            numberOfLines={3}
            placeholderTextColor="#666"
          />
        </View>
      )
    }

    return (
      <View key={field.key} style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          <Ionicons name={field.icon} size={16} color="#BB86FC" /> {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        <TextInput
          style={styles.textInput}
          value={String(value || "")}
          onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
          placeholder={`Ingresa ${field.label.toLowerCase()}`}
          placeholderTextColor="#666"
          secureTextEntry={field.secure}
          keyboardType={field.key === "permisos" ? "numeric" : "default"}
        />
      </View>
    )
  }

  // Renderizar tarjeta de usuario
  const renderUserCard = (user, index) => (
    <View key={user.id || index} style={styles.userCard}>
      <LinearGradient colors={["#2D2D2D", "#1A1A1A"]} style={styles.cardGradient}>
        <View style={styles.userHeader}>
          <View style={styles.userAvatarContainer}>
            {user.foto ? (
              <Image source={{ uri: user.foto }} style={styles.userAvatar} />
            ) : (
              <LinearGradient colors={["#BB86FC", "#6200EE"]} style={styles.userAvatarPlaceholder}>
                <Text style={styles.avatarInitials}>{user.nombre?.charAt(0)?.toUpperCase() || "U"}</Text>
              </LinearGradient>
            )}
            <View style={[styles.statusIndicator, { backgroundColor: user.archivado ? "#FF5252" : "#4CAF50" }]} />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.nombre || "Sin nombre"}</Text>
            <Text style={styles.userCode}>
              <Ionicons name="barcode" size={12} color="#BB86FC" /> {user.codigo}
            </Text>
            <Text style={styles.userRole}>
              <Ionicons name="briefcase" size={12} color="#03DAC6" /> {user.rol} • {user.tipo}
            </Text>
            <Text style={styles.userChat}>
              <Ionicons name="chatbubble-ellipses" size={12} color="#666" /> ID: {user.id_chat}
            </Text>
          </View>

          <View style={styles.userPermissions}>
            <LinearGradient
              colors={user.permisos === 3 ? ["#FF6B35", "#F7931E"] : ["#03DAC6", "#018786"]}
              style={styles.permissionBadge}
            >
              <Ionicons name="shield-checkmark" size={14} color="#fff" />
              <Text style={styles.permissionText}>Nivel {user.permisos}</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(user)}>
            <Ionicons name="create" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.archiveButton} onPress={() => toggleArchiveUser(user)}>
            <Ionicons name={user.archivado ? "folder-open" : "archive"} size={16} color="#fff" />
            <Text style={styles.actionButtonText}>{user.archivado ? "Desarchivar" : "Archivar"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(user)}>
            <Ionicons name="trash" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* Header */}
      <LinearGradient colors={["#1F1F1F", "#121212"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={["#BB86FC", "#6200EE"]} style={styles.headerIcon}>
              <Ionicons name="people" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
          </View>
          <TouchableOpacity onPress={openCreateModal}>
            <LinearGradient colors={["#03DAC6", "#018786"]} style={styles.addButton}>
              <Ionicons name="add" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#BB86FC" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, código, rol..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={filterUsers}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <LinearGradient colors={["#2D2D2D", "#1A1A1A"]} style={styles.statItem}>
            <Text style={styles.statNumber}>{users.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </LinearGradient>
          <LinearGradient colors={["#2D2D2D", "#1A1A1A"]} style={styles.statItem}>
            <Text style={styles.statNumber}>{users.filter((u) => !u.archivado).length}</Text>
            <Text style={styles.statLabel}>Activos</Text>
          </LinearGradient>
          <LinearGradient colors={["#2D2D2D", "#1A1A1A"]} style={styles.statItem}>
            <Text style={styles.statNumber}>{users.filter((u) => u.archivado).length}</Text>
            <Text style={styles.statLabel}>Archivados</Text>
          </LinearGradient>
          <LinearGradient colors={["#2D2D2D", "#1A1A1A"]} style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredUsers.length}</Text>
            <Text style={styles.statLabel}>Mostrados</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Lista de usuarios */}
      <ScrollView
        style={styles.usersList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#BB86FC" />}
        showsVerticalScrollIndicator={false}
      >
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient colors={["#2D2D2D", "#1A1A1A"]} style={styles.emptyStateContainer}>
              <Ionicons name="people-outline" size={64} color="#666" />
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? "No se encontraron usuarios" : "No hay usuarios registrados"}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? "Intenta con otros términos de búsqueda" : "Agrega tu primer usuario tocando el botón +"}
              </Text>
            </LinearGradient>
          </View>
        ) : (
          filteredUsers.map(renderUserCard)
        )}
      </ScrollView>

      {/* Modal para crear/editar usuario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#1F1F1F", "#121212"]} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                <Ionicons name={editingUser ? "create" : "person-add"} size={20} color="#BB86FC" />{" "}
                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false)
                  setEditingUser(null)
                  setFormData({})
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScrollView} showsVerticalScrollIndicator={false}>
              {userFields.map(renderFormField)}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false)
                  setEditingUser(null)
                  setFormData({})
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={editingUser ? updateUser : insertUser}>
                <LinearGradient colors={["#03DAC6", "#018786"]} style={styles.saveButton}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.saveButtonText}>{editingUser ? "Actualizar" : "Crear"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#03DAC6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 48,
    borderWidth: 1,
    borderColor: "#333",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#BB86FC",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  userCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#BB86FC",
  },
  userAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#BB86FC",
  },
  avatarInitials: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  userCode: {
    fontSize: 13,
    color: "#BB86FC",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#03DAC6",
    marginBottom: 2,
  },
  userChat: {
    fontSize: 11,
    color: "#666",
  },
  userPermissions: {
    alignItems: "center",
  },
  permissionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  permissionText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  userActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9500",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 4,
    justifyContent: "center",
  },
  archiveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200EE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5252",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 4,
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    padding: 4,
  },
  formScrollView: {
    maxHeight: height * 0.6,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
  },
  required: {
    color: "#FF5252",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#2D2D2D",
    color: "#fff",
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },
  selectContainer: {
    flexDirection: "row",
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: "#2D2D2D",
    borderWidth: 1,
    borderColor: "#333",
  },
  selectOptionActive: {
    backgroundColor: "#BB86FC",
    borderColor: "#BB86FC",
  },
  selectOptionText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  selectOptionTextActive: {
    color: "#fff",
  },
  booleanContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    overflow: "hidden",
  },
  booleanButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#2D2D2D",
  },
  booleanButtonActive: {
    backgroundColor: "#BB86FC",
  },
  booleanText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
  },
  booleanTextActive: {
    color: "#fff",
  },
  imagePickerButton: {
    height: 120,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D2D2D",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#2D2D2D",
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginLeft: 4,
  },
})

export default UserManager
