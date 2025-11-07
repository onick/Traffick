"use client";

import CopilotChat from "@/components/CopilotChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle, Zap } from "lucide-react";

const quickActions = [
  {
    title: "Analizar Rendimiento",
    description: "Obtén un análisis completo de tus campañas activas",
    icon: TrendingUp,
    prompt: "Analiza el rendimiento de todas mis campañas activas",
  },
  {
    title: "Detectar Anomalías",
    description: "Identifica problemas o cambios inusuales",
    icon: AlertTriangle,
    prompt: "¿Hay alguna anomalía en mis campañas que deba revisar?",
  },
  {
    title: "Recomendaciones",
    description: "Recibe sugerencias para mejorar tus resultados",
    icon: Lightbulb,
    prompt: "¿Qué recomendaciones tienes para mejorar mi ROAS?",
  },
  {
    title: "Optimización Express",
    description: "Acciones rápidas para optimizar el gasto",
    icon: Zap,
    prompt: "Dame 3 acciones concretas para optimizar mi gasto publicitario hoy",
  },
];

export default function CopilotPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Campaign Copilot</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu asistente inteligente para optimizar campañas de paid media
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <CopilotChat />
        </div>

        {/* Sidebar with Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 mb-1">
                          {action.title}
                        </div>
                        <div className="text-xs text-slate-600">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capacidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span className="text-slate-700">
                    Análisis en tiempo real de métricas y KPIs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span className="text-slate-700">
                    Detección automática de anomalías y alertas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span className="text-slate-700">
                    Recomendaciones basadas en datos históricos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span className="text-slate-700">
                    Correlación entre cambios y resultados
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span className="text-slate-700">
                    Insights específicos por plataforma
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span className="text-slate-700">
                    Sugerencias de optimización de presupuesto
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Powered by Claude 3.5 Sonnet
                </h3>
                <p className="text-xs text-slate-600">
                  Inteligencia artificial avanzada para análisis profesional de campañas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
