"use client"

import { StatusDropdown } from "@/components/reususables/custom-ui/dropdown"
import { DataTable, type Column } from "@/components/reususables/custom-ui/table"
import { SearchForm } from "@/components/reususables/form/searchForm"
import { Button, Card, CardBody } from "@heroui/react"
import { useState } from "react"


export default function AdminLeadsView() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(9)
    const [searchValue, setSearchValue] = useState("");
    const [status, setStatus] = useState("Select Status");


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
                <span className={value === "Approved" ? "text-[#1B7E02] font-medium" : "text-[#FF0000] font-medium"}>
                    {value}
                </span>
            ),
        },
    ]


    const statuses = ["Select Status", "Approved", "Declined"];



    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-lightBrown">Leads</h1>
                </div>
                <div className="">
                    <Button className="bg-primaryBlue px-8 rounded-md text-white">Onboard a Lead</Button>
                </div>
            </div>
            <div className="flex gap-4 items-center p-4">
                <SearchForm value={searchValue} onChange={setSearchValue} />
                <StatusDropdown optionArray={statuses} selected={status} onChange={setStatus} />
            </div>

            <Card className="bg-white border border-darkCharcoal/20 rounded-lg">
                <CardBody className="p-6">
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
