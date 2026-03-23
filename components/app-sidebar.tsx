"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconMail,
  IconSearch,
  IconSettings,
  IconSparkles,
  IconUsers,
  IconChecklist,
  IconAddressBook,
  IconBrain,
  IconClipboardList,
  IconBuildingSkyscraper,
  IconAB2,
  IconFileAnalytics,
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

const navGroups = {
  main: [
    { title: "Tableau de bord", url: "/dashboard", icon: IconDashboard },
    { title: "Leads & Entreprises", url: "/dashboard/leads", icon: IconAddressBook },
    { title: "Scoring ICP", url: "/dashboard/scoring", icon: IconBuildingSkyscraper },
  ],
  outreach: [
    { title: "Générer", url: "/dashboard/generate", icon: IconSparkles },
    { title: "Assistant IA", url: "/dashboard/assistant", icon: IconBrain },
    { title: "Planification", url: "/dashboard/planification", icon: IconClipboardList },
    { title: "Réviser", url: "/dashboard/review", icon: IconChecklist },
  ],
  campaigns: [
    { title: "Campagnes", url: "/dashboard/campaigns", icon: IconMail },
    { title: "A/B Testing", url: "/dashboard/ab-testing", icon: IconAB2 },
    { title: "Rapports", url: "/dashboard/reports", icon: IconFileAnalytics },
    { title: "Analytiques", url: "/dashboard/analytics", icon: IconChartBar },
  ],
  team: [
    { title: "Équipe", url: "/dashboard/team", icon: IconUsers },
  ],
}

const navSecondary = [
  { title: "Paramètres", url: "/dashboard/settings", icon: IconSettings },
  { title: "Aide", url: "/dashboard/settings", icon: IconHelp },
  { title: "Rechercher", url: "/dashboard/settings", icon: IconSearch },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [news, setNews] = React.useState<NewsArticle[]>([])

  React.useEffect(() => {
    getChangelogNews().then((items) => {
      const articles: NewsArticle[] = items.map(item => ({
        href: "/dashboard",
        title: `v${item.title}`,
        summary: item.description,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=120",
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
        {/* Main Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={navGroups.main} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Outreach Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Outreach</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={navGroups.outreach} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Campaigns Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Campagnes & Rapports</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={navGroups.campaigns} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Team */}
        <SidebarGroup>
          <SidebarGroupLabel>Organisation</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMain items={navGroups.team} />
          </SidebarGroupContent>
        </SidebarGroup>

        {news.length > 0 && (
          <div className="mt-2 px-0">
             <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nouveautés
            </div>
            <News articles={news} />
          </div>
        )}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "Utilisateur", email: "user@outreachmachine.com", avatar: "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
