import DashboardClientWrapper from "@/components/DashboardClientWrapper"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>
}
