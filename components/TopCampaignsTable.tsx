import { Badge } from "@/components/ui/badge"

const campaigns = [
  { name: "Black Friday - Meta Awareness", platform: "Meta", spend: "$420", leads: 35, cpl: "$12.00", status: "Active" },
  { name: "Google Search - Brand", platform: "Google", spend: "$320", leads: 28, cpl: "$11.43", status: "Active" },
  { name: "TikTok - UGC Campaign", platform: "TikTok", spend: "$280", leads: 22, cpl: "$12.73", status: "Active" },
  { name: "Meta Retargeting", platform: "Meta", spend: "$180", leads: 18, cpl: "$10.00", status: "Paused" },
  { name: "Google Display - Cold", platform: "Google", spend: "$150", leads: 8, cpl: "$18.75", status: "Completed" },
]

export default function TopCampaignsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="pb-2 text-left font-medium text-muted-foreground">Campaign</th>
            <th className="pb-2 text-left font-medium text-muted-foreground">Platform</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Spend</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">Leads</th>
            <th className="pb-2 text-right font-medium text-muted-foreground">CPL</th>
            <th className="pb-2 text-left font-medium text-muted-foreground">Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, idx) => (
            <tr key={idx} className="border-b last:border-0">
              <td className="py-3">{campaign.name}</td>
              <td className="py-3 text-muted-foreground">{campaign.platform}</td>
              <td className="py-3 text-right font-medium">{campaign.spend}</td>
              <td className="py-3 text-right">{campaign.leads}</td>
              <td className="py-3 text-right">{campaign.cpl}</td>
              <td className="py-3">
                <Badge 
                  variant={
                    campaign.status === "Active" ? "success" : 
                    campaign.status === "Paused" ? "warning" : 
                    "secondary"
                  }
                >
                  {campaign.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
