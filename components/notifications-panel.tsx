"use client"

import * as React from "react"
import { IconBell } from "@tabler/icons-react"
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

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      title: "Bienvenue !",
      message: "Votre espace Outreach Machine est prêt.",
      type: "info",
      read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Configuration requise",
      message: "Ajoutez vos clés API dans les Paramètres.",
      type: "warning",
      read: false,
      created_at: new Date().toISOString(),
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
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
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Tout marquer comme lu
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 p-3"
            >
              <div className="flex w-full items-center gap-2">
                {!notification.read && (
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                )}
                <span className="font-medium text-sm">
                  {notification.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground line-clamp-2">
                {notification.message}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
