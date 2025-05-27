import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Tus credenciales de Supabase
const SUPABASE_URL = "https://uhoyvmorjucsvewjxutp.supabase.co"
const SUPABASE_ANON_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVob3l2bW9yanVjc3Zld2p4dXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODEwOTksImV4cCI6MjA1NjI1NzA5OX0.jXH4RYhVEYdKcnXPXbkSPmy0qVujfG5ynQcA6MbVOGM"
// const SUPABASE_URL = "https://uhoyvmorjucsvewjxutp.supabase.co"
// const SUPABASE_ANON_KEY =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVob3l2bW9yanVjc3Zld2p4dXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2ODEwOTksImV4cCI6MjA1NjI1NzA5OX0.jXH4RYhVEYdKcnXPXb"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("usuarios").select("count", { count: "exact", head: true })

    if (error) {
      console.log("Error de conexión:", error.message)
      return { success: false, error: error.message }
    }

    console.log("✅ Conexión exitosa!")
    return { success: true, count: data }
  } catch (err) {
    console.log("Error:", err.message)
    return { success: false, error: err.message }
  }
}
