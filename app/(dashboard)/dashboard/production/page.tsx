import PageHeader from "@/components/common/page-header";
import ProductionMainTab from "@/components/production/production-main-tab";

export default function ProductionPage() {
  return (
    <div>
      <PageHeader 
        title="Production" 
        description="Monitor and manage production processes."
      />

      <ProductionMainTab/>
    </div>
  )
}
