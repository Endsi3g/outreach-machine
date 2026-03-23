"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconMail,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconUsers,
  IconChecklist,
  IconAddressBook,
  IconFileText,
  IconBrain,
  IconClipboardList,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { News, NewsArticle } from "@/components/ui/sidebar-news"
import { getChangelogNews } from "@/lib/actions/changelog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Utilisateur",
    email: "user@outreachmachine.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: IconAddressBook,
    },
    {
      title: "Générer",
      url: "/dashboard/generate",
      icon: IconSparkles,
    },
    {
      title: "Assistant IA",
      url: "/dashboard/assistant",
      icon: IconBrain,
    },
    {
      title: "Planification",
      url: "/dashboard/planification",
      icon: IconClipboardList,
    },
    {
      title: "Réviser",
      url: "/dashboard/review",
      icon: IconChecklist,
    },
    {
      title: "Campagnes",
      url: "/dashboard/campaigns",
      icon: IconMail,
    },
    {
      title: "Analytiques",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Équipe",
      url: "/dashboard/team",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Aide",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Rechercher",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [news, setNews] = React.useState<NewsArticle[]>([])

  React.useEffect(() => {
    getChangelogNews().then((items) => {
      const articles: NewsArticle[] = items.map(item => ({
        href: "/dashboard/changelog", // Fallback or specific link
        title: `v${item.title}`,
        summary: item.description,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=120", // Default AI/Tech image
      }))
      setNews(articles)
    })
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Outreach Machine</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {news.length > 0 && (
          <div className="mt-4 px-0">
             <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nouveautés
            </div>
            <News articles={news} />
          </div>
        )}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
