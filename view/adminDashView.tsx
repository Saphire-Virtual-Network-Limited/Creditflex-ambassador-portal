"use client"

import { CardWrapper } from "@/components/reususables/card/card-wrapper"
import { DataTable, type Column } from "@/components/reususables/custom-ui/table"
import multipleUser from "@/public/assets/svgs/multiple-user-filled.svg"
import { Button, Card, CardBody } from "@heroui/react"
import { useState } from "react"


export default function AdminDashView() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(9)

    const leadData = [
        {
            id: 1,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 6",
            state: "Lagos",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Declined",
        },
        {
            id: 2,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 8",
            state: "Ondo",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 3,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 8",
            state: "Abuja",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 4,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 8",
            state: "Kogi",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 5,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 8",
            state: "Kwara",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 6,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 10",
            state: "Lagos",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 7,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 6",
            state: "Oyo",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 8,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 10",
            state: "Ekiti",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Approved",
        },
        {
            id: 9,
            leadName: "John Benson",
            pfaName: "John Benson",
            ippis: "291029",
            bvn: "21039581029",
            dob: "01-04-1968",
            gradeLevel: "Level 10",
            state: "Kebbi",
            salaryAccount: "0193949402",
            phone: "08119934838",
            status: "Declined",
        },
    ]


    // Define columns for dashboard lead history
    const dashboardLeadColumns: Column[] = [
        { key: "id", header: "S/N", width: "w-12" },
        { key: "leadName", header: "Lead Name" },
        { key: "pfaName", header: "PFA Name" },
        { key: "ippis", header: "IPPIS Number" },
        { key: "bvn", header: "BVN" },
        { key: "dob", header: "Date Of Birth" },
        { key: "gradeLevel", header: "Grade Level" },
        { key: "state", header: "State" },
        { key: "salaryAccount", header: "Salary A/C Number" },
        { key: "phone", header: "Phone Number" },
        {
            key: "status",
            header: "Status",
            render: (value: string) => (
                <span className={value === "Approved" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {value}
                </span>
            ),
        },
    ]


    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-lightBrown">Hello, Geraldine</h1>
                    <p className="text-lightBrown">How are you doing today?</p>
                </div>
                <div className="">
                    <p className="text-sm font-medium text-lightBrown">Telesales Agent Assigned To:</p>
                    <p className="font-semibold text-primaryBlue">Abimbola Jinadus</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CardWrapper cardIcon={multipleUser} cardTitle="Total Leads Onboarded" cardValue={14} />
                <CardWrapper cardIcon={multipleUser} cardTitle="Total approved leads" cardValue={10} />
                <CardWrapper cardIcon={multipleUser} cardTitle="Total commission earned" cardValue={120000} currencyFormat={true} />
            </div>

            <Card className="bg-white border border-darkCharcoal/20 rounded-lg">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-semibold text-primaryBlue">Lead History</h2>
                        <Button className="text-primaryBlue bg-transparent text-sm font-medium">
                            View all
                        </Button>
                    </div>

                    <DataTable
                        data={leadData.slice(0, pageSize)}
                        columns={dashboardLeadColumns}
                        totalItems={leadData.length}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                    />
                </CardBody>
            </Card>

        </div>
    )
}
