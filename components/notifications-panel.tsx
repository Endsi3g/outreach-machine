"use client"

import * as React from "react"
import { IconBell, IconInfoCircle, IconAlertTriangle, IconCheck } from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  read: boolean
  created_at: string
}

export function NotificationsPanel() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

  const fetchNotifications = React.useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch("/api/notifications", {
        headers: { "x-user-id": session.user.id }
      })
      const data = await response.json()
      if (data.notifications) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Fetch notifications error:", error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  React.useEffect(() => {
    if (!session?.user?.id) return

    // Debug: Check Supabase config
    const isSupabaseConfigured = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")

    if (!isSupabaseConfigured) {
      console.warn("⚠️ [Notifications] Supabase n'est pas configuré. Le temps réel est désactivé.")
      setLoading(false)
      return
    }

    fetchNotifications()

    console.log(`🔌 [Notifications] Connexion au channel pour l'utilisateur ${session.user.id}...`)
    
    const channel = supabase
      .channel(`user-notifications-${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log("🔔 [Notifications] Nouveau message reçu !", payload)
          const newNotif = payload.new as Notification
          setNotifications((prev) => [newNotif, ...prev])
          toast(newNotif.title, {
            description: newNotif.message,
            icon: newNotif.type === "warning" ? <IconAlertTriangle className="size-4 text-warning" /> : <IconInfoCircle className="size-4 text-info" />,
          })
        }
      )
      .subscribe((status) => {
        console.log(`📡 [Notifications] Statut du channel : ${status}`)
        if (status === "CHANNEL_ERROR") {
          console.error("❌ [Notifications] Erreur de connexion au channel. Vérifiez les politiques RLS.")
        }
      })

    return () => {
      console.log("🔌 [Notifications] Déconnexion du channel.")
      supabase.removeChannel(channel)
    }
  }, [session?.user?.id, fetchNotifications])

  const markAllRead = async () => {
    if (!notifications.length) return
    
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (!unreadIds.length) return

    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ ids: unreadIds }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error("Mark read error:", error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "warning": return <IconAlertTriangle className="size-4 text-amber-500" />
      case "success": return <IconCheck className="size-4 text-emerald-500" />
      default: return <IconInfoCircle className="size-4 text-blue-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <IconBell className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-xs text-muted-foreground">Chargement...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-default focus:bg-accent/50"
              >
                <div className="flex w-full items-center gap-2">
                  {getIcon(notification.type)}
                  <span className={`font-medium text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.title}
                  </span>
                  {!notification.read && (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground line-clamp-2 pl-6">
                  {notification.message}
                </span>
                <span className="text-[10px] text-muted-foreground/60 pl-6 mt-1">
                  {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

