import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  subtitle: string
  trend?: "up" | "down"
}

export default function KpiCard({ title, value, subtitle, trend }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        <p className={cn(
          "mt-1 text-xs",
          trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
        )}>
          {subtitle}
        </p>
      </CardContent>
    </Card>
  )
}
