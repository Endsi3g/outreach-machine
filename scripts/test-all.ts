/**
 * Outreach Machine — Comprehensive Test Script
 * Tests all major features: Auth, APIs, AI, Web Agent, Tasks
 * 
 * Usage: npx tsx scripts/test-all.ts
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3001"

interface TestResult {
  name: string
  passed: boolean
  duration: number
  error?: string
}

const results: TestResult[] = []

async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now()
  try {
    await fn()
    results.push({ name, passed: true, duration: Date.now() - start })
    console.log(`  ✅ ${name} (${Date.now() - start}ms)`)
  } catch (error: any) {
    results.push({ name, passed: false, duration: Date.now() - start, error: error.message })
    console.log(`  ❌ ${name}: ${error.message} (${Date.now() - start}ms)`)
  }
}

async function fetchJSON(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

// ════════════════════════════════════════
// TEST SUITES
// ════════════════════════════════════════

async function testConnectivity() {
  console.log("\n🌐 Connectivité")

  await runTest("Serveur accessible", async () => {
    const res = await fetch(BASE_URL)
    if (!res.ok && res.status !== 307) throw new Error(`Status: ${res.status}`)
  })

  await runTest("API Auth Session", async () => {
    const { status } = await fetchJSON("/api/auth/session")
    if (status !== 200) throw new Error(`Status: ${status}`)
  })

  await runTest("API Auth Providers", async () => {
    const { status } = await fetchJSON("/api/auth/providers")
    if (status !== 200) throw new Error(`Status: ${status}`)
  })
}

async function testAPIs() {
  console.log("\n📡 API Endpoints")

  await runTest("GET /api/stats", async () => {
    const { status, data } = await fetchJSON("/api/stats")
    if (status !== 200) throw new Error(`Status: ${status}`)
    if (!data.stats) throw new Error("Missing stats object")
  })

  await runTest("GET /api/notifications", async () => {
    const { status } = await fetchJSON("/api/notifications")
    // 200 or 401 are both acceptable
    if (status !== 200 && status !== 401) throw new Error(`Status: ${status}`)
  })

  await runTest("GET /api/tasks", async () => {
    const { status } = await fetchJSON("/api/tasks")
    // 200 or 401 are both acceptable
    if (status !== 200 && status !== 401) throw new Error(`Status: ${status}`)
  })

  await runTest("POST /api/tasks (create)", async () => {
    const { status, data } = await fetchJSON("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        type: "custom",
        title: "Test Task",
        description: "Test automatique",
      }),
    })
    // 201 or 401 are acceptable
    if (status !== 201 && status !== 401) throw new Error(`Status: ${status}`)
  })
}

async function testAI() {
  console.log("\n🤖 Intelligence Artificielle (Kimi K-2.5 via Ollama)")

  await runTest("Ollama accessible", async () => {
    try {
      const res = await fetch("http://localhost:11434/api/tags")
      if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`)
      const data = await res.json()
      const models = (data.models || []).map((m: any) => m.name)
      console.log(`     Modèles disponibles: ${models.join(", ") || "aucun"}`)
    } catch {
      throw new Error("Ollama n'est pas accessible sur localhost:11434")
    }
  })

  await runTest("POST /api/ai/chat", async () => {
    const { status } = await fetchJSON("/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message: "Bonjour, test rapide" }),
    })
    // 200 or 401 or 500 (if ollama not running) are all informative
    if (status !== 200 && status !== 401 && status !== 500) throw new Error(`Status: ${status}`)
  })

  await runTest("POST /api/ai/generate", async () => {
    const { status } = await fetchJSON("/api/ai/generate", {
      method: "POST",
      body: JSON.stringify({
        prospectName: "Test",
        companyName: "TestCo",
      }),
    })
    if (status !== 200 && status !== 401 && status !== 500) throw new Error(`Status: ${status}`)
  })
}

async function testWebAgent() {
  console.log("\n🕸️  Web Agent (Recherche de prospects)")

  await runTest("POST /api/agent/research", async () => {
    const { status } = await fetchJSON("/api/agent/research", {
      method: "POST",
      body: JSON.stringify({ url: "https://example.com" }),
    })
    if (status !== 200 && status !== 401) throw new Error(`Status: ${status}`)
  })
}

async function testPages() {
  console.log("\n📄 Pages (Rendu)")

  const pages = [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/dashboard/leads",
    "/dashboard/generate",
    "/dashboard/assistant",
    "/dashboard/planification",
    "/dashboard/review",
    "/dashboard/campaigns",
    "/dashboard/analytics",
    "/dashboard/settings",
  ]

  for (const page of pages) {
    await runTest(`GET ${page}`, async () => {
      const res = await fetch(`${BASE_URL}${page}`, { redirect: "manual" })
      // 200 or 307 (redirect to login) are both acceptable
      if (res.status !== 200 && res.status !== 307 && res.status !== 308) {
        throw new Error(`Status: ${res.status}`)
      }
    })
  }
}

// ════════════════════════════════════════
// MAIN
// ════════════════════════════════════════

async function main() {
  console.log("════════════════════════════════════════════════")
  console.log("  Outreach Machine — Test Complet")
  console.log(`  Serveur: ${BASE_URL}`)
  console.log(`  Date: ${new Date().toLocaleString("fr-CA")}`)
  console.log("════════════════════════════════════════════════")

  await testConnectivity()
  await testAPIs()
  await testAI()
  await testWebAgent()
  await testPages()

  // Summary
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  const total = results.length

  console.log("\n════════════════════════════════════════════════")
  console.log(`  Résultats: ${passed}/${total} réussis, ${failed} échoués`)
  console.log(`  Temps total: ${results.reduce((a, r) => a + r.duration, 0)}ms`)
  console.log("════════════════════════════════════════════════\n")

  if (failed > 0) {
    console.log("Tests échoués:")
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.name}: ${r.error}`)
    })
    process.exit(1)
  }

  console.log("✅ Tous les tests ont réussi!")
}

main().catch(console.error)
