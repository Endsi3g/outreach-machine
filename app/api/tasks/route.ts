import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export interface Task {
  id: string
  type: "email" | "campaign" | "research" | "custom"
  title: string
  description: string
  status: "pending" | "scheduled" | "running" | "completed" | "failed"
  scheduledAt: string | null
  completedAt: string | null
  data: Record<string, any>
  createdAt: string
}

// In-memory store (for MVP, will be migrated to Supabase)
const tasks: Task[] = []

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    return NextResponse.json({ tasks: tasks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )})
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, description, scheduledAt, data } = body

    if (!type || !title) {
      return NextResponse.json({ error: "type et title sont requis" }, { status: 400 })
    }

    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type,
      title,
      description: description || "",
      status: scheduledAt ? "scheduled" : "pending",
      scheduledAt: scheduledAt || null,
      completedAt: null,
      data: data || {},
      createdAt: new Date().toISOString(),
    }

    tasks.push(task)

    return NextResponse.json({ task }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { id, status, data } = body

    const task = tasks.find(t => t.id === id)
    if (!task) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    if (status) task.status = status
    if (data) task.data = { ...task.data, ...data }
    if (status === "completed") task.completedAt = new Date().toISOString()

    return NextResponse.json({ task })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 })
    }

    tasks.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
