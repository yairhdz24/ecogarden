import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Camera, CameraView } from "expo-camera";

export default function Scannerprueba() {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  // Solicitar permisos de la cámara
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Verificación de permisos
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text>No hay acceso a la cámara</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          type="back" // Usando "back" como cadena directamente
        >
          <View style={styles.overlay}>
            {/* Puedes agregar controles u otros elementos dentro de la cámara */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Escanear</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 15,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
