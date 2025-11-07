"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building2, TrendingUp, DollarSign, Target, ArrowUpRight, ArrowDownRight, MoreVertical } from "lucide-react";
import Link from "next/link";

const brandsData = [
  {
    id: "b1",
    name: "Nodo",
    industry: "Technology",
    status: "active",
    campaigns_count: 3,
    total_spend: 7850.00,
    total_leads: 187,
    avg_cpl: 41.98,
    roas: 3.4,
    spend_change: 15.2,
    leads_change: 22.5,
    color: "#3B82F6",
  },
  {
    id: "b2",
    name: "TechStart",
    industry: "SaaS",
    status: "active",
    campaigns_count: 3,
    total_spend: 5240.00,
    total_leads: 124,
    avg_cpl: 42.26,
    roas: 2.8,
    spend_change: -8.3,
    leads_change: 12.1,
    color: "#8B5CF6",
  },
  {
    id: "b3",
    name: "EcoShop",
    industry: "E-commerce",
    status: "active",
    campaigns_count: 3,
    total_spend: 6890.00,
    total_leads: 156,
    avg_cpl: 44.17,
    roas: 4.2,
    spend_change: 28.7,
    leads_change: 35.2,
    color: "#10B981",
  },
];

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = brandsData.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpend = brandsData.reduce((sum, brand) => sum + brand.total_spend, 0);
  const totalLeads = brandsData.reduce((sum, brand) => sum + brand.total_leads, 0);
  const avgRoas = brandsData.reduce((sum, brand) => sum + brand.roas, 0) / brandsData.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Brands</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your brands and track their performance
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Brand
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Brands</p>
                <p className="text-2xl font-bold">{brandsData.length}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Building2 className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">Avg ROAS</p>
                <p className="text-2xl font-bold">{avgRoas.toFixed(1)}x</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brands by name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBrands.map((brand) => (
          <Link key={brand.id} href={`/dashboard/brands/${brand.id}`}>
            <Card className="transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold text-lg"
                      style={{ backgroundColor: brand.color }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{brand.industry}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {brand.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Campaigns Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Active Campaigns</span>
                    <span className="font-semibold">{brand.campaigns_count}</span>
                  </div>

                  {/* Spend */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Spend</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${brand.total_spend.toLocaleString()}</span>
                      <div className={`flex items-center text-xs ${brand.spend_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {brand.spend_change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(brand.spend_change)}%
                      </div>
                    </div>
                  </div>

                  {/* Leads */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Leads</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{brand.total_leads}</span>
                      <div className={`flex items-center text-xs ${brand.leads_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {brand.leads_change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {Math.abs(brand.leads_change)}%
                      </div>
                    </div>
                  </div>

                  {/* CPL and ROAS */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Avg CPL</p>
                      <p className="text-sm font-semibold">${brand.avg_cpl}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ROAS</p>
                      <p className="text-sm font-semibold">{brand.roas}x</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredBrands.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No brands found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Try adjusting your search query or create a new brand
          </p>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Brand
          </Button>
        </div>
      )}
    </div>
  );
}
