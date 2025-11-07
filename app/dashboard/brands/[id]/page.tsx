"use client";

import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, TrendingUp, DollarSign, Target, Users } from "lucide-react";
import Link from "next/link";
import SpendVsLeadsChart from "@/components/charts/SpendVsLeadsChart";
import TopCampaignsTable from "@/components/TopCampaignsTable";

// Mock data - en producción vendría del backend
const brandDetails: Record<string, any> = {
  b1: {
    id: "b1",
    name: "Nodo",
    industry: "Technology",
    status: "active",
    website: "https://nodo.tech",
    description: "Leading technology solutions provider specializing in digital transformation",
    campaigns_count: 3,
    total_spend: 7850.00,
    total_leads: 187,
    avg_cpl: 41.98,
    roas: 3.4,
    spend_change: 15.2,
    leads_change: 22.5,
    color: "#3B82F6",
  },
  b2: {
    id: "b2",
    name: "TechStart",
    industry: "SaaS",
    status: "active",
    website: "https://techstart.io",
    description: "Innovative SaaS platform for modern businesses",
    campaigns_count: 3,
    total_spend: 5240.00,
    total_leads: 124,
    avg_cpl: 42.26,
    roas: 2.8,
    spend_change: -8.3,
    leads_change: 12.1,
    color: "#8B5CF6",
  },
  b3: {
    id: "b3",
    name: "EcoShop",
    industry: "E-commerce",
    status: "active",
    website: "https://ecoshop.com",
    description: "Sustainable e-commerce marketplace for eco-friendly products",
    campaigns_count: 3,
    total_spend: 6890.00,
    total_leads: 156,
    avg_cpl: 44.17,
    roas: 4.2,
    spend_change: 28.7,
    leads_change: 35.2,
    color: "#10B981",
  },
};

export default function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const brand = brandDetails[id];

  if (!brand) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Brand not found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The brand you're looking for doesn't exist
          </p>
          <Link href="/dashboard/brands">
            <Button>Back to Brands</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/brands">
          <Button variant="outline" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Brands
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-lg text-white font-bold text-2xl"
              style={{ backgroundColor: brand.color }}
            >
              {brand.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900">{brand.name}</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {brand.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{brand.industry}</p>
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {brand.website}
                </a>
              )}
            </div>
          </div>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Brand
          </Button>
        </div>

        {brand.description && (
          <p className="mt-4 text-slate-600 max-w-3xl">{brand.description}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{brand.campaigns_count}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${brand.total_spend.toLocaleString()}</p>
                <p className={`text-xs mt-1 ${brand.spend_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {brand.spend_change >= 0 ? '+' : ''}{brand.spend_change}% vs last period
                </p>
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
                <p className="text-2xl font-bold">{brand.total_leads}</p>
                <p className={`text-xs mt-1 ${brand.leads_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {brand.leads_change >= 0 ? '+' : ''}{brand.leads_change}% vs last period
                </p>
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
                <p className="text-sm text-muted-foreground">ROAS</p>
                <p className="text-2xl font-bold">{brand.roas}x</p>
                <p className="text-xs text-muted-foreground mt-1">Avg CPL: ${brand.avg_cpl}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Campaigns */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
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
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCampaignsTable />
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  07
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nov 7, 2025</div>
                  <div>Campaign budget increased by 20%</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  05
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nov 5, 2025</div>
                  <div>New creative added to Meta campaign</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  03
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nov 3, 2025</div>
                  <div>Google campaign performance optimized</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Meta</span>
                  <span className="text-sm font-semibold">45%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Google</span>
                  <span className="text-sm font-semibold">35%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "35%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">TikTok</span>
                  <span className="text-sm font-semibold">20%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Create New Campaign
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View All Campaigns
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Export Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Brand Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
