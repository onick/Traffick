"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Play, Pause, TrendingUp, DollarSign, Target, Eye, MousePointerClick, Users } from "lucide-react";
import Link from "next/link";
import SpendVsLeadsChart from "@/components/charts/SpendVsLeadsChart";
import { useToast } from "@/components/ToastProvider";

const campaignDetails: Record<string, any> = {
  c1: {
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
    conversions: 78,
    conversion_rate: 2.44,
    start_date: "2025-10-15",
    end_date: "2025-11-30",
    description: "Comprehensive awareness campaign targeting potential customers during Black Friday season",
    target_audience: "Ages 25-45, Tech enthusiasts, Urban areas",
  },
  c2: {
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
    conversions: 62,
    conversion_rate: 2.21,
    start_date: "2025-10-20",
    end_date: "2025-12-15",
    description: "Retargeting campaign for users who visited the website",
    target_audience: "Website visitors, Cart abandoners",
  },
};

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

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const campaign = campaignDetails[id];
  const [campaignStatus, setCampaignStatus] = useState(campaign?.status || "active");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handlePauseResume = () => {
    setIsLoading(true);

    // Simular API call
    setTimeout(() => {
      const newStatus = campaignStatus === "active" ? "paused" : "active";
      setCampaignStatus(newStatus);
      setIsLoading(false);

      showToast(
        `Campaign ${newStatus === "paused" ? "paused" : "resumed"} successfully`,
        "success"
      );
    }, 500);
  };

  const handleEdit = () => {
    showToast("Edit campaign feature coming soon", "info");
  };

  if (!campaign) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Campaign not found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The campaign you're looking for doesn't exist
          </p>
          <Link href="/dashboard/campaigns">
            <Button>Back to Campaigns</Button>
          </Link>
        </div>
      </div>
    );
  }

  const budgetUsed = (campaign.spent / campaign.total_budget) * 100;
  const daysRemaining = Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/campaigns">
          <Button variant="outline" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-slate-900">{campaign.name}</h1>
              <Badge variant="secondary" className={statusColors[campaignStatus]}>
                {campaignStatus}
              </Badge>
              <Badge variant="secondary" className={platformColors[campaign.platform]}>
                {campaign.platform}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Brand: <Link href={`/dashboard/brands/${campaign.brand_id}`} className="text-blue-600 hover:underline">{campaign.brand}</Link> • Objective: {campaign.objective}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {campaignStatus === "active" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={handlePauseResume}
                disabled={isLoading}
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            {campaignStatus === "paused" && (
              <Button
                variant="outline"
                className="gap-2"
                onClick={handlePauseResume}
                disabled={isLoading}
              >
                <Play className="h-4 w-4" />
                Resume
              </Button>
            )}
            <Button className="gap-2" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
              Edit Campaign
            </Button>
          </div>
        </div>

        {campaign.description && (
          <p className="mt-4 text-slate-600 max-w-3xl">{campaign.description}</p>
        )}
      </div>

      {/* Budget Progress */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Budget Used</p>
              <p className="text-2xl font-bold">${campaign.spent.toLocaleString()} <span className="text-lg text-muted-foreground">/ ${campaign.total_budget.toLocaleString()}</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Daily Budget</p>
              <p className="text-xl font-semibold">${campaign.daily_budget.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Days Remaining</p>
              <p className="text-xl font-semibold">{daysRemaining > 0 ? daysRemaining : 0} days</p>
            </div>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{budgetUsed.toFixed(1)}% of total budget used</p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Impressions</p>
                <p className="text-2xl font-bold">{campaign.impressions.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clicks</p>
                <p className="text-2xl font-bold">{campaign.clicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">CTR: {campaign.ctr}%</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <MousePointerClick className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{campaign.conversions}</p>
                <p className="text-xs text-muted-foreground mt-1">Rate: {campaign.conversion_rate}%</p>
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
                <p className="text-2xl font-bold">{campaign.roas}x</p>
                <p className="text-xs text-muted-foreground mt-1">CPL: ${campaign.cpl.toFixed(2)}</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendVsLeadsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Platform</p>
              <Badge variant="secondary" className={platformColors[campaign.platform]}>
                {campaign.platform}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Objective</p>
              <p className="font-medium capitalize">{campaign.objective.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
              <p className="text-sm">{campaign.target_audience}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge variant="secondary" className={statusColors[campaign.status]}>
                {campaign.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  07
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nov 7, 2025</div>
                  <div>Daily budget increased to ${campaign.daily_budget}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  05
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nov 5, 2025</div>
                  <div>New ad creative added</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                  03
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Nov 3, 2025</div>
                  <div>Target audience updated</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cost per Click</span>
                <span className="font-semibold">${(campaign.spent / campaign.clicks).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cost per 1K Impressions</span>
                <span className="font-semibold">${((campaign.spent / campaign.impressions) * 1000).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Click-Through Rate</span>
                <span className="font-semibold">{campaign.ctr}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold">{campaign.conversion_rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Return on Ad Spend</span>
                <span className="font-semibold">{campaign.roas}x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
