"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native"
import { supabase } from "./supabase"

const SupabaseDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [customQuery, setCustomQuery] = useState("")
  const [queryResult, setQueryResult] = useState("")

  // Diagnóstico completo de la conexión
  const runFullDiagnostic = async () => {
    setLoading(true)
    const results = []

    // 1. Verificar conexión básica
    results.push("🔍 INICIANDO DIAGNÓSTICO DE SUPABASE...")
    results.push("")

    // 2. Verificar configuración del cliente
    try {
      const config = {
        url: supabase.supabaseUrl,
        key: supabase.supabaseKey ? "✅ Configurada" : "❌ No configurada",
      }
      results.push("📋 CONFIGURACIÓN:")
      results.push(`URL: ${config.url}`)
      results.push(`API Key: ${config.key}`)
      results.push("")
    } catch (error) {
      results.push("❌ Error al verificar configuración")
      results.push("")
    }

    // 3. Probar conexión con diferentes métodos
    results.push("🔗 PROBANDO CONEXIÓN:")

    // Método 1: Probar con una consulta simple
    try {
      const { data, error } = await supabase.from("usuarios").select("count", { count: "exact", head: true })
      if (!error) {
        results.push("✅ Conexión exitosa con tabla 'usuarios'")
        results.push(`   Registros encontrados: ${data || 0}`)
      } else {
        results.push("❌ Error con tabla 'usuarios':")
        results.push(`   ${error.message}`)
      }
    } catch (err) {
      results.push("❌ Error de conexión con 'usuarios':")
      results.push(`   ${err.message}`)
    }

    // Método 2: Probar con RPC (funciones almacenadas)
    try {
      const { data, error } = await supabase.rpc("get_schema_info")
      if (!error) {
        results.push("✅ RPC functions disponibles")
      } else {
        results.push("❌ RPC functions no disponibles:")
        results.push(`   ${error.message}`)
      }
    } catch (err) {
      results.push("❌ Error probando RPC")
    }

    // Método 3: Probar autenticación
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (!error && user) {
        results.push("✅ Usuario autenticado:")
        results.push(`   ID: ${user.id}`)
        results.push(`   Email: ${user.email || "No disponible"}`)
      } else {
        results.push("ℹ️ Sin usuario autenticado (usando clave anon)")
      }
    } catch (err) {
      results.push("❌ Error verificando autenticación")
    }

    results.push("")

    // 4. Probar tablas comunes
    results.push("📊 PROBANDO TABLAS COMUNES:")
    const commonTables = [
      "usuarios",
      "users",
      "user",
      "alumno",
      "alumnos",
      "student",
      "students",
      "checadas",
      "attendance",
      "inventario",
      "inventory",
      "productos",
      "products",
    ]

    for (const table of commonTables) {
      try {
        const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (!error) {
          results.push(`✅ ${table}: ${count || 0} registros`)
        } else {
          results.push(`❌ ${table}: ${error.message}`)
        }
      } catch (err) {
        results.push(`❌ ${table}: Error de conexión`)
      }
    }

    results.push("")

    // 5. Intentar obtener metadatos del esquema
    results.push("🗂️ INTENTANDO OBTENER ESQUEMA:")
    try {
      const { data, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")

      if (!error && data) {
        results.push("✅ Esquema accesible:")
        data.forEach((table) => {
          results.push(`   - ${table.table_name}`)
        })
      } else {
        results.push("❌ Esquema no accesible:")
        results.push(`   ${error?.message || "Sin acceso a information_schema"}`)
      }
    } catch (err) {
      results.push("❌ Error accediendo al esquema")
    }

    results.push("")

    // 6. Verificar políticas RLS
    results.push("🔒 VERIFICANDO POLÍTICAS RLS:")
    try {
      const { data, error } = await supabase.from("pg_policies").select("tablename, policyname, permissive")

      if (!error && data) {
        results.push("✅ Políticas RLS encontradas:")
        data.forEach((policy) => {
          results.push(`   ${policy.tablename}: ${policy.policyname}`)
        })
      } else {
        results.push("❌ No se pueden ver las políticas RLS")
        results.push("   Esto es normal con clave anon")
      }
    } catch (err) {
      results.push("ℹ️ Políticas RLS no accesibles (normal)")
    }

    setDiagnosticResults(results)
    setLoading(false)
  }

  // Ejecutar consulta personalizada
  const executeCustomQuery = async () => {
    if (!customQuery.trim()) {
      Alert.alert("Error", "Ingresa una consulta SQL")
      return
    }

    setLoading(true)
    try {
      // Intentar como RPC primero
      const { data, error } = await supabase.rpc("execute_sql", { query: customQuery })

      if (!error) {
        setQueryResult(JSON.stringify(data, null, 2))
      } else {
        setQueryResult(`Error: ${error.message}`)
      }
    } catch (err) {
      // Si RPC no funciona, intentar como consulta directa
      try {
        const { data, error } = await supabase.from(customQuery).select("*").limit(10)
        if (!error) {
          setQueryResult(JSON.stringify(data, null, 2))
        } else {
          setQueryResult(`Error: ${error.message}`)
        }
      } catch (err2) {
        setQueryResult(`Error: ${err2.message}`)
      }
    }
    setLoading(false)
  }

  // Probar con diferentes configuraciones
  const testDifferentConfigs = async () => {
    setLoading(true)
    const results = []

    results.push("🔧 PROBANDO DIFERENTES CONFIGURACIONES:")
    results.push("")

    // Configuración 1: Con service_role (si está disponible)
    results.push("1. Probando con configuración actual...")
    try {
      const { data, error } = await supabase.from("usuarios").select("*").limit(1)
      if (!error) {
        results.push("✅ Configuración actual funciona")
        if (data && data.length > 0) {
          results.push(`   Columnas encontradas: ${Object.keys(data[0]).join(", ")}`)
        }
      } else {
        results.push("❌ Configuración actual falla:")
        results.push(`   ${error.message}`)
      }
    } catch (err) {
      results.push("❌ Error con configuración actual")
    }

    results.push("")

    // Sugerencias de configuración
    results.push("💡 SUGERENCIAS:")
    results.push("1. Verifica que la URL y API Key sean correctas")
    results.push("2. Asegúrate de que RLS esté configurado correctamente")
    results.push("3. Verifica los permisos de la clave anon")
    results.push("4. Considera usar service_role key para desarrollo")
    results.push("")

    // Información de configuración recomendada
    results.push("⚙️ CONFIGURACIÓN RECOMENDADA:")
    results.push("En tu archivo supabase.js, asegúrate de tener:")
    results.push("")
    results.push("const SUPABASE_URL = 'tu-url-aqui'")
    results.push("const SUPABASE_ANON_KEY = 'tu-clave-anon-aqui'")
    results.push("// Para desarrollo, puedes usar:")
    results.push("// const SUPABASE_SERVICE_KEY = 'tu-service-role-key'")

    setDiagnosticResults(results)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Diagnóstico de Supabase</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={runFullDiagnostic}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Ejecutando..." : "🔍 Diagnóstico Completo"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={testDifferentConfigs}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🔧 Probar Configuraciones</Text>
          </TouchableOpacity>
        </View>

        {/* Consulta personalizada */}
        <View style={styles.querySection}>
          <Text style={styles.sectionTitle}>Consulta Personalizada</Text>
          <TextInput
            style={styles.textInput}
            value={customQuery}
            onChangeText={setCustomQuery}
            placeholder="Ej: usuarios, alumno, o nombre de tu tabla"
            multiline
          />
          <TouchableOpacity style={[styles.button, styles.queryButton]} onPress={executeCustomQuery} disabled={loading}>
            <Text style={styles.buttonText}>Ejecutar Consulta</Text>
          </TouchableOpacity>
        </View>

        {/* Resultados */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Ejecutando diagnóstico...</Text>
          </View>
        )}

        {diagnosticResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Resultados del Diagnóstico</Text>
            <ScrollView style={styles.resultsScroll}>
              {diagnosticResults.map((result, index) => (
                <Text key={index} style={styles.resultText}>
                  {result}
                </Text>
              ))}
            </ScrollView>
          </View>
        )}

        {queryResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Resultado de Consulta</Text>
            <ScrollView style={styles.resultsScroll}>
              <Text style={styles.resultText}>{queryResult}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#0066cc",
  },
  secondaryButton: {
    backgroundColor: "#28a745",
  },
  queryButton: {
    backgroundColor: "#17a2b8",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  querySection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    minHeight: 60,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 1,
  },
  resultsScroll: {
    maxHeight: 400,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 4,
  },
  resultText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
    lineHeight: 16,
  },
})

export default SupabaseDiagnostic
