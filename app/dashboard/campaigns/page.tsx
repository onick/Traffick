"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Megaphone, TrendingUp, DollarSign, Target, Play, Pause, CheckCircle } from "lucide-react";
import Link from "next/link";

// Mock data de campaigns
const campaignsData = [
  {
    id: "c1",
    name: "Black Friday - Meta Awareness",
    brand: "Nodo",
    brand_id: "b1",
    platform: "meta",
    objective: "awareness",
    status: "active",
    daily_budget: 150.00,
    total_budget: 4500.00,
    spent: 3240.00,
    leads: 78,
    cpl: 41.54,
    roas: 3.4,
    impressions: 245000,
    clicks: 3200,
    ctr: 1.31,
    start_date: "2025-10-15",
    end_date: "2025-11-30",
  },
  {
    id: "c2",
    name: "Retargeting - Google Search",
    brand: "Nodo",
    brand_id: "b1",
    platform: "google",
    objective: "conversions",
    status: "active",
    daily_budget: 120.00,
    total_budget: 3600.00,
    spent: 2890.00,
    leads: 62,
    cpl: 46.61,
    roas: 2.8,
    impressions: 180000,
    clicks: 2800,
    ctr: 1.56,
    start_date: "2025-10-20",
    end_date: "2025-12-15",
  },
  {
    id: "c3",
    name: "Product Launch - TikTok",
    brand: "Nodo",
    brand_id: "b1",
    platform: "tiktok",
    objective: "traffic",
    status: "active",
    daily_budget: 100.00,
    total_budget: 3000.00,
    spent: 1720.00,
    leads: 47,
    cpl: 36.60,
    roas: 4.1,
    impressions: 520000,
    clicks: 4100,
    ctr: 0.79,
    start_date: "2025-11-01",
    end_date: "2025-11-30",
  },
  {
    id: "c4",
    name: "Lead Gen - LinkedIn",
    brand: "TechStart",
    brand_id: "b2",
    platform: "linkedin",
    objective: "lead_generation",
    status: "active",
    daily_budget: 80.00,
    total_budget: 2400.00,
    spent: 1960.00,
    leads: 45,
    cpl: 43.56,
    roas: 2.9,
    impressions: 95000,
    clicks: 1800,
    ctr: 1.89,
    start_date: "2025-10-10",
    end_date: "2025-12-10",
  },
  {
    id: "c5",
    name: "Brand Awareness - Meta",
    brand: "TechStart",
    brand_id: "b2",
    platform: "meta",
    objective: "awareness",
    status: "paused",
    daily_budget: 90.00,
    total_budget: 2700.00,
    spent: 1840.00,
    leads: 38,
    cpl: 48.42,
    roas: 2.5,
    impressions: 210000,
    clicks: 2500,
    ctr: 1.19,
    start_date: "2025-10-05",
    end_date: "2025-11-20",
  },
  {
    id: "c6",
    name: "Sales Campaign - Google",
    brand: "TechStart",
    brand_id: "b2",
    platform: "google",
    objective: "conversions",
    status: "active",
    daily_budget: 110.00,
    total_budget: 3300.00,
    spent: 1440.00,
    leads: 41,
    cpl: 35.12,
    roas: 3.2,
    impressions: 145000,
    clicks: 2100,
    ctr: 1.45,
    start_date: "2025-10-25",
    end_date: "2025-12-25",
  },
  {
    id: "c7",
    name: "Holiday Special - Meta",
    brand: "EcoShop",
    brand_id: "b3",
    platform: "meta",
    objective: "conversions",
    status: "active",
    daily_budget: 130.00,
    total_budget: 3900.00,
    spent: 2680.00,
    leads: 64,
    cpl: 41.88,
    roas: 4.5,
    impressions: 280000,
    clicks: 3500,
    ctr: 1.25,
    start_date: "2025-10-15",
    end_date: "2025-12-24",
  },
  {
    id: "c8",
    name: "Shopping Ads - Google",
    brand: "EcoShop",
    brand_id: "b3",
    platform: "google",
    objective: "conversions",
    status: "active",
    daily_budget: 140.00,
    total_budget: 4200.00,
    spent: 2450.00,
    leads: 58,
    cpl: 42.24,
    roas: 4.0,
    impressions: 195000,
    clicks: 2900,
    ctr: 1.49,
    start_date: "2025-10-12",
    end_date: "2025-12-31",
  },
  {
    id: "c9",
    name: "Influencer Collab - TikTok",
    brand: "EcoShop",
    brand_id: "b3",
    platform: "tiktok",
    objective: "traffic",
    status: "completed",
    daily_budget: 85.00,
    total_budget: 2550.00,
    spent: 1760.00,
    leads: 34,
    cpl: 51.76,
    roas: 3.8,
    impressions: 450000,
    clicks: 3800,
    ctr: 0.84,
    start_date: "2025-09-01",
    end_date: "2025-10-31",
  },
];

const platformColors: Record<string, string> = {
  meta: "bg-blue-100 text-blue-700",
  google: "bg-red-100 text-red-700",
  tiktok: "bg-pink-100 text-pink-700",
  linkedin: "bg-indigo-100 text-indigo-700",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  completed: "bg-slate-100 text-slate-700",
};

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");

  const filteredCampaigns = campaignsData.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || campaign.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesBrand = brandFilter === "all" || campaign.brand_id === brandFilter;

    return matchesSearch && matchesPlatform && matchesStatus && matchesBrand;
  });

  const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = filteredCampaigns.reduce((sum, c) => sum + c.leads, 0);
  const avgCPL = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const activeCampaigns = filteredCampaigns.filter(c => c.status === "active").length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaigns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor all your advertising campaigns
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{filteredCampaigns.length}</p>
                <p className="text-xs text-green-600 mt-1">{activeCampaigns} active</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${totalSpend.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg CPL</p>
                <p className="text-2xl font-bold">${avgCPL.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="meta">Meta</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            <SelectItem value="b1">Nodo</SelectItem>
            <SelectItem value="b2">TechStart</SelectItem>
            <SelectItem value="b3">EcoShop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-semibold">Campaign</th>
                  <th className="pb-3 font-semibold">Brand</th>
                  <th className="pb-3 font-semibold">Platform</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Spend</th>
                  <th className="pb-3 font-semibold text-right">Leads</th>
                  <th className="pb-3 font-semibold text-right">CPL</th>
                  <th className="pb-3 font-semibold text-right">ROAS</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-4">
                      <Link href={`/dashboard/campaigns/${campaign.id}`} className="font-medium text-blue-600 hover:underline">
                        {campaign.name}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{campaign.objective}</p>
                    </td>
                    <td className="py-4">{campaign.brand}</td>
                    <td className="py-4">
                      <Badge variant="secondary" className={platformColors[campaign.platform]}>
                        {campaign.platform}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge variant="secondary" className={statusColors[campaign.status]}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-right font-medium">${campaign.spent.toLocaleString()}</td>
                    <td className="py-4 text-right">{campaign.leads}</td>
                    <td className="py-4 text-right">${campaign.cpl.toFixed(2)}</td>
                    <td className="py-4 text-right">{campaign.roas.toFixed(1)}x</td>
                    <td className="py-4 text-right">
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <Megaphone className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No campaigns found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
