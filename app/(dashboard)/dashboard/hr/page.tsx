import PageHeader from "@/components/common/page-header";
import HrTabs from "@/components/hr/hr-tabs";

export default function HrPage() {
    return (
        <div>
            <PageHeader
                title="Human Resources"
                description="Manage employee information and HR-related tasks."
            />

            <HrTabs/>
        </div>
    );
}