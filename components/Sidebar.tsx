"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Image as ImageIcon,
  CheckSquare,
  FileBarChart,
  Bot,
  Plug
} from "lucide-react"

const menuItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campaign Copilot",
    href: "/dashboard/copilot",
    icon: Bot,
    highlight: true,
  },
  {
    title: "Brands",
    href: "/dashboard/brands",
    icon: Building2,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Plug,
  },
  {
    title: "Creatives",
    href: "/dashboard/creatives",
    icon: ImageIcon,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileBarChart,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <h1 className="text-xl font-bold text-blue-400">TraffickerHub</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                isActive
                  ? item.highlight
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-blue-600 text-white"
                  : item.highlight
                  ? "text-blue-300 hover:bg-slate-800 hover:text-blue-200 border border-blue-500/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
              {item.highlight && !isActive && (
                <span className="ml-auto text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  AI
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
