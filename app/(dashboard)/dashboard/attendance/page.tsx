import PageHeader from "@/components/common/page-header";
import TodayAttendanceCard from "@/components/attendance/today-attendance-card";
import AttendanceHistoryTable from "@/components/attendance/attendance-history-table";

export default function AttendancePage() {
    return (
        <div>
            <PageHeader
                title="My Attendance"
                description="Mark your daily attendance and view history"
            />

            <TodayAttendanceCard />
            <AttendanceHistoryTable />
        </div>
    );
}