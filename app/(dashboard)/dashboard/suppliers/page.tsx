import PageHeader from "@/components/common/page-header";
import SuppliersMainTab from "@/components/suppliers/suplier-main-tab";

export default function SuppliersPage() {
  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage suppliers and their materials." 
      />

      <SuppliersMainTab />
    </div>
  )
}
