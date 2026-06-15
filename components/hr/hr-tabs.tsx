"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, Clock, CalendarDays, ClipboardList, DollarSign } from "lucide-react";

// import EmployeesTab from "./employees-tab";
import DepartmentsTab from "./department/departments-tab";
import ShiftsTab from "./shifts/shifts-tab";
// import RosterTab from "./roster-tab";
// import AttendanceTab from "./attendance-tab";
// import PayrollTab from "./payroll-tab";

export default function HrTabs() {
    return (
        <Tabs defaultValue="employees" className="w-full space-y-4">

            {/* Tabs Header */}
            <TabsList className="grid grid-cols-6 w-full">
                
                {/* <TabsTrigger value="employees" className="gap-2">
                    <Users size={16} />
                    Employees
                </TabsTrigger> */}

                <TabsTrigger value="departments" className="gap-2">
                    <Building2 size={16} />
                    Departments
                </TabsTrigger>

                 <TabsTrigger value="shifts" className="gap-2">
                    <Clock size={16} />
                    Shifts
                </TabsTrigger>

                {/* <TabsTrigger value="roster" className="gap-2">
                    <CalendarDays size={16} />
                    Roster
                </TabsTrigger>

                <TabsTrigger value="attendance" className="gap-2">
                    <ClipboardList size={16} />
                    Attendance
                </TabsTrigger>

                <TabsTrigger value="payroll" className="gap-2">
                    <DollarSign size={16} />
                    Payroll
                </TabsTrigger> */}

            </TabsList>

            {/* Tab Content */}
            {/* <TabsContent value="employees">
                <EmployeesTab />
            </TabsContent> */}

            <TabsContent value="departments">
                <DepartmentsTab />
            </TabsContent>

             <TabsContent value="shifts">
                <ShiftsTab />
            </TabsContent>

            {/*<TabsContent value="roster">
                <RosterTab />
            </TabsContent>

            <TabsContent value="attendance">
                <AttendanceTab />
            </TabsContent>

            <TabsContent value="payroll">
                <PayrollTab />
            </TabsContent> */}

        </Tabs>
    );
}