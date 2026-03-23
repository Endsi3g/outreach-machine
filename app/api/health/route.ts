import { NextResponse } from "next/server"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  const healthStatus: any = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      ollama: { status: "unknown" },
      database: { status: "unknown" },
    }
  }

  // 1. Check Ollama
  try {
    const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
    const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/version`, { 
      method: "GET",
      // Using standard timeout pattern for Node.js fetch
      signal: AbortSignal.timeout(3000) 
    })
    
    if (ollamaResponse.ok) {
      healthStatus.services.ollama.status = "ok"
    } else {
      healthStatus.services.ollama.status = "error"
      healthStatus.status = "degraded"
    }
  } catch (error) {
    healthStatus.services.ollama.status = "error"
    healthStatus.services.ollama.error = error instanceof Error ? error.message : "Connection failed"
    healthStatus.status = "degraded"
  }

  // 2. Check Database (Supabase)
  try {
    if (!isSupabaseConfigured) {
      healthStatus.services.database.status = "unconfigured"
    } else {
      // Perform a lightweight query to check connection
      // A valid response or even a "table not found" error means the DB API is reachable
      const { error } = await supabase.from('_health_check_').select('*').limit(1)
      
      // If error exists but it's a PostgREST error (like table not found), the service is up.
      // If it's a network error (like fetch failed), we throw it.
      if (error && error.message.toLowerCase().includes('fetch')) {
         throw new Error(error.message)
      }
      
      healthStatus.services.database.status = "ok"
    }
  } catch (error) {
    healthStatus.services.database.status = "error"
    healthStatus.services.database.error = error instanceof Error ? error.message : "Connection failed"
    healthStatus.status = "degraded"
  }

  return NextResponse.json(healthStatus, {
    status: healthStatus.status === "ok" ? 200 : 503
  })
}
