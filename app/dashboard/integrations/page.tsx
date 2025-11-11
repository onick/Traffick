"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Facebook,
  Chrome,
  Music2,
  Linkedin,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Unplug
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface PlatformConnection {
  id: string;
  platform: string;
  platform_account_id: string;
  platform_account_name: string;
  is_active: boolean;
  last_sync_at: string | null;
  created_at: string;
}

const platforms = [
  {
    id: "meta",
    name: "Meta Ads",
    description: "Connect Facebook & Instagram advertising accounts",
    icon: Facebook,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Connect Google Ads and YouTube campaigns",
    icon: Chrome,
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    description: "Connect TikTok for Business ad accounts",
    icon: Music2,
    color: "bg-pink-500",
    hoverColor: "hover:bg-pink-600",
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    description: "Connect LinkedIn Campaign Manager",
    icon: Linkedin,
    color: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
  },
];

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Mock user ID - replace with real auth
  const userId = "550e8400-e29b-41d4-a716-446655440000";

  useEffect(() => {
    fetchConnections();

    // Check for OAuth callback status
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const platform = params.get("platform");
    const message = params.get("message");

    if (status === "success" && platform) {
      showToast(`Successfully connected ${platform}!`, "success");
      fetchConnections();
      // Clean URL
      window.history.replaceState({}, "", "/dashboard/integrations");
    } else if (status === "error") {
      showToast(`Connection failed: ${message || "Unknown error"}`, "error");
      window.history.replaceState({}, "", "/dashboard/integrations");
    }
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/platforms/connections?user_id=${userId}`
      );

      if (response.ok) {
        const data = await response.json();
        setConnections(data);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = (platformId: string) => {
    // Redirect to OAuth flow
    window.location.href = `http://localhost:8000/api/platforms/${platformId}/connect?user_id=${userId}`;
  };

  const handleSync = async (connectionId: string) => {
    setSyncingId(connectionId);

    try {
      const response = await fetch(
        `http://localhost:8000/api/platforms/meta/${connectionId}/sync`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        showToast(
          `Synced ${data.campaigns_synced} campaigns successfully!`,
          "success"
        );
        fetchConnections();
      } else {
        showToast("Sync failed. Please try again.", "error");
      }
    } catch (error) {
      showToast("Sync failed. Please try again.", "error");
    } finally {
      setSyncingId(null);
    }
  };

  const handleDisconnect = async (connectionId: string, platformName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platformName}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/platforms/connections/${connectionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        showToast(`${platformName} disconnected successfully`, "success");
        fetchConnections();
      } else {
        showToast("Failed to disconnect. Please try again.", "error");
      }
    } catch (error) {
      showToast("Failed to disconnect. Please try again.", "error");
    }
  };

  const getPlatformInfo = (platformId: string) => {
    return platforms.find((p) => p.id === platformId);
  };

  const isConnected = (platformId: string) => {
    return connections.some((c) => c.platform === platformId && c.is_active);
  };

  const getConnection = (platformId: string) => {
    return connections.find((c) => c.platform === platformId && c.is_active);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Platform Integrations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your advertising platforms to sync campaigns and track performance
        </p>
      </div>

      {/* Connected Platforms Summary */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Connected Platforms</p>
              <p className="text-3xl font-bold">
                {connections.filter((c) => c.is_active).length} / {platforms.length}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Platforms */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const connected = isConnected(platform.id);
            const connection = getConnection(platform.id);

            return (
              <Card key={platform.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${platform.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {platform.description}
                        </CardDescription>
                      </div>
                    </div>
                    {connected ? (
                      <Badge className="bg-green-100 text-green-700">
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {connected && connection ? (
                    <div className="space-y-4">
                      {/* Connection Info */}
                      <div className="text-sm">
                        <p className="text-muted-foreground">Account:</p>
                        <p className="font-medium">
                          {connection.platform_account_name || connection.platform_account_id}
                        </p>
                      </div>

                      {connection.last_sync_at && (
                        <div className="text-sm">
                          <p className="text-muted-foreground">Last Sync:</p>
                          <p className="font-medium">
                            {new Date(connection.last_sync_at).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSync(connection.id)}
                          disabled={syncingId === connection.id}
                          className="flex-1"
                        >
                          {syncingId === connection.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Campaigns
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDisconnect(connection.id, platform.name)
                          }
                        >
                          <Unplug className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      className={`w-full ${platform.color} ${platform.hoverColor} text-white`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Connect {platform.name}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Active Connections List */}
      {connections.filter((c) => c.is_active).length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Connections</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {connections
                  .filter((c) => c.is_active)
                  .map((connection) => {
                    const platformInfo = getPlatformInfo(connection.platform);
                    const Icon = platformInfo?.icon || Facebook;

                    return (
                      <div
                        key={connection.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`${platformInfo?.color || "bg-slate-500"} p-2 rounded-lg`}
                          >
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {platformInfo?.name || connection.platform}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {connection.platform_account_name ||
                                connection.platform_account_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleDisconnect(
                                connection.id,
                                platformInfo?.name || connection.platform
                              )
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
