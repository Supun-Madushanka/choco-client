import PageHeader from "@/components/common/page-header";
import RawMaterialsTab from "@/components/raw-materials/raw-materials-tab";

export default function RawMaterialsPage() {
  return (
    <div>
      <PageHeader
        title="Raw Materials"
        description="Manage raw materials inventory and related information." 
      />

      <RawMaterialsTab />
    </div>
  )
}
