"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import KpiCard from "@/components/KpiCard"
import TopCampaignsTable from "@/components/TopCampaignsTable"
import SpendVsLeadsChart from "@/components/charts/SpendVsLeadsChart"
import PlatformBreakdownChart from "@/components/charts/PlatformBreakdownChart"
import ObjectivesChart from "@/components/charts/ObjectivesChart"
import FunnelChart from "@/components/charts/FunnelChart"
import CopilotChat from "@/components/CopilotChat"

const platformData = [
  { platform: "Meta", spend: "$980", leads: 78, cpl: "$12.56" },
  { platform: "Google", spend: "$720", leads: 62, cpl: "$11.61" },
  { platform: "TikTok", spend: "$640", leads: 47, cpl: "$13.62" },
]

const changelog = [
  { date: "2025-11-01", text: "Paused high CPL campaign on Meta." },
  { date: "2025-11-03", text: "Increased budget for Google retargeting." },
  { date: "2025-11-05", text: "Launched new creative test for TikTok." },
]

const tasks = [
  { text: "Launch Black Friday campaign", completed: false },
  { text: "Review TikTok CPL after 3 days", completed: false },
  { text: "Upload new creatives for Meta remarketing", completed: true },
]

const funnelData = [
  { stage: "Impressions", value: "1.25M" },
  { stage: "Clicks", value: "25.0K" },
  { stage: "Leads", value: "187" },
  { stage: "Sales", value: "42" },
]

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nodo – Paid Media Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your campaigns performance and metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="meta">Meta</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">MF</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Ad Spend"
          value="$2,340.00"
          subtitle="+15% vs prev. period"
          trend="up"
        />
        <KpiCard
          title="Leads"
          value="187"
          subtitle="+22% vs prev. period"
          trend="up"
        />
        <KpiCard
          title="CPL (Cost per Lead)"
          value="$12.51"
          subtitle="-8% vs prev. period"
          trend="down"
        />
        <KpiCard
          title="ROAS"
          value="3.4x"
          subtitle="+12% vs prev. period"
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spend vs Leads Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendVsLeadsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformBreakdownChart />
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">Platform Summary</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2">Platform</th>
                      <th className="pb-2 text-right">Spend</th>
                      <th className="pb-2 text-right">Leads</th>
                      <th className="pb-2 text-right">CPL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformData.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2">{row.platform}</td>
                        <td className="py-2 text-right font-medium">{row.spend}</td>
                        <td className="py-2 text-right">{row.leads}</td>
                        <td className="py-2 text-right">{row.cpl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Campaigns, Funnel, Objectives */}
      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCampaignsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objectives Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ObjectivesChart />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>Awareness</span>
                </div>
                <span className="font-medium">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span>Traffic</span>
                </div>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Conversions</span>
                </div>
                <span className="font-medium">40%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel and Additional Metrics */}
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funnel Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelChart />
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {funnelData.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-muted-foreground">{item.stage}</div>
                  <div className="mt-1 text-xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Changelog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {changelog.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                      {item.date.slice(-2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">{item.date}</div>
                      <div className="text-sm">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center ${
                      task.completed ? "border-green-600 bg-green-600" : "border-slate-300"
                    }`}>
                      {task.completed && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign Copilot */}
      <div className="mb-8">
        <CopilotChat />
      </div>
    </div>
  )
}
