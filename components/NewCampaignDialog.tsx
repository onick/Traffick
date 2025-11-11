"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ToastProvider";

interface NewCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignCreated?: () => void;
}

export default function NewCampaignDialog({ open, onOpenChange, onCampaignCreated }: NewCampaignDialogProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    platform: "",
    objective: "",
    daily_budget: "",
    total_budget: "",
    start_date: "",
    end_date: "",
    target_audience: "",
    description: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name || !formData.brand_id || !formData.platform || !formData.objective ||
        !formData.daily_budget || !formData.total_budget || !formData.start_date || !formData.end_date) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Validar que el presupuesto total sea mayor que el diario
    const dailyBudget = parseFloat(formData.daily_budget);
    const totalBudget = parseFloat(formData.total_budget);

    if (dailyBudget <= 0 || totalBudget <= 0) {
      showToast("Budgets must be greater than 0", "error");
      return;
    }

    if (totalBudget < dailyBudget) {
      showToast("Total budget must be greater than daily budget", "error");
      return;
    }

    // Validar fechas
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate <= startDate) {
      showToast("End date must be after start date", "error");
      return;
    }

    setIsLoading(true);

    // Simular API call
    setTimeout(() => {
      setIsLoading(false);
      showToast("Campaign created successfully!", "success");

      // Reset form
      setFormData({
        name: "",
        brand_id: "",
        platform: "",
        objective: "",
        daily_budget: "",
        total_budget: "",
        start_date: "",
        end_date: "",
        target_audience: "",
        description: "",
      });

      onOpenChange(false);
      onCampaignCreated?.();
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new advertising campaign
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Black Friday - Meta Awareness"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Brand and Platform Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select value={formData.brand_id} onValueChange={(value) => handleChange("brand_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="b1">Nodo</SelectItem>
                  <SelectItem value="b2">TechStart</SelectItem>
                  <SelectItem value="b3">EcoShop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform *</Label>
              <Select value={formData.platform} onValueChange={(value) => handleChange("platform", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meta">Meta (Facebook/Instagram)</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <Label htmlFor="objective">Campaign Objective *</Label>
            <Select value={formData.objective} onValueChange={(value) => handleChange("objective", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awareness">Brand Awareness</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="lead_generation">Lead Generation</SelectItem>
                <SelectItem value="conversions">Conversions</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="daily_budget">Daily Budget (USD) *</Label>
              <Input
                id="daily_budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
                value={formData.daily_budget}
                onChange={(e) => handleChange("daily_budget", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_budget">Total Budget (USD) *</Label>
              <Input
                id="total_budget"
                type="number"
                step="0.01"
                min="0"
                placeholder="4500.00"
                value={formData.total_budget}
                onChange={(e) => handleChange("total_budget", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="target_audience">Target Audience</Label>
            <Input
              id="target_audience"
              placeholder="e.g., Ages 25-45, Tech enthusiasts, Urban areas"
              value={formData.target_audience}
              onChange={(e) => handleChange("target_audience", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the campaign goals and strategy..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
