
"use client"

import { SearchForm } from '@/components/reususables/form/searchForm';
import { Card, CardBody } from '@heroui/react';
import DateRangePicker from '@/components/ui/date-range-picker';
import React, { useState } from 'react'
import { DataTable, type Column } from "@/components/reususables/custom-ui/table";

const AdminCommissionView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    
    // Get current week (Sunday to Saturday)
    const getCurrentWeekRange = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const sundayOffset = -dayOfWeek; // Days to subtract to get to Sunday
        
        const sunday = new Date(today);
        sunday.setDate(today.getDate() + sundayOffset);
        sunday.setHours(0, 0, 0, 0);
        
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);
        
        return { start: sunday, end: saturday };
    };
    
    const currentWeek = getCurrentWeekRange();
    const [selectedStartDate, setSelectedStartDate] = useState(currentWeek.start);
    const [selectedEndDate, setSelectedEndDate] = useState(currentWeek.end);

    const handleDateRangeChange = (startDate: Date, endDate: Date) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
        console.log('Date range changed:', startDate, endDate)
    }

    const calculateDaysDifference = () => {
        const diffTime = Math.abs(selectedEndDate.getTime() - selectedStartDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const leadData = [
        {
            id: 1,
            leadName: "John Benson",
            ippis: "291029",
            phone: "08119934838",
            gradeLevel: "Level 6",
            state: "Lagos",
            commissions: "N10,000.00",
            lastTransactDate: "2025-07-18",
            status: "Declined",
        },
        {
            id: 2,
            leadName: "Alice Smith",
            ippis: "123456",
            gradeLevel: "Level 8",
            state: "Ondo",
            phone: "08011223344",
            commissions: "N10,000.00",
            lastTransactDate: "2025-07-13",
            status: "Approved",
        },
        {
            id: 3,
            leadName: "Michael Adams",
            ippis: "789101",
            gradeLevel: "Level 10",
            state: "Abuja",
            phone: "08122334455",
            commissions: "N10,000.00",
            lastTransactDate: "2025-07-14",
            status: "Approved",
        },
        {
            id: 4,
            leadName: "John Benson",
            ippis: "291029",
            phone: "08119934838",
            gradeLevel: "Level 16",
            state: "Lagos",
            commissions: "N10,000.00",
            lastTransactDate: "2025-07-20",
            status: "Declined",
        },
        {
            id: 5,
            leadName: "Alice Smith",
            ippis: "123456",
            gradeLevel: "Level 14",
            state: "Ondo",
            phone: "08011223344",
            commissions: "N10,000.00",
            lastTransactDate: "2025-07-22",
            status: "Approved",
        },
        {
            id: 5,
            leadName: "Michael Adams",
            ippis: "789101",
            gradeLevel: "Level 12",
            state: "Abuja",
            phone: "08122334455",
            commissions: "N10,000.00",
            lastTransactDate: "2025-07-26",
            status: "Approved",
        },
    ];

    // Filter based on search input
    const filteredData = leadData.filter((lead) => {
        const searchTerm = searchValue.toLowerCase();

        const matchesSearch =
            lead.leadName.toLowerCase().includes(searchTerm) ||
            lead.ippis.toLowerCase().includes(searchTerm) ||
            lead.phone.toLowerCase().includes(searchTerm) ||
            lead.state.toLowerCase().includes(searchTerm) ||
            lead.gradeLevel.toLowerCase().includes(searchTerm);

        // Date range filtering
        const leadDate = new Date(lead.lastTransactDate);
        const matchesDateRange = leadDate >= selectedStartDate && leadDate <= selectedEndDate;

        return matchesSearch && matchesDateRange;
    });

    const dashboardLeadColumns: Column[] = [
        { key: "id", header: "S/N", width: "w-12" },
        { key: "leadName", header: "Lead Name" },
        { key: "ippis", header: "IPPIS Number" },
        { key: "phone", header: "Phone Number" },
        { key: "gradeLevel", header: "Grade Level" },
        { key: "state", header: "State" },

        { key: "commissions", header: "Commissions" },
        { key: "lastTransactDate", header: "Last Transaction Date" },
        {
            key: "status",
            header: "Status",
            render: (value: string) => (
                <span className={value === "Approved" ? "text-[#1B7E02] font-medium" : "text-[#FF0000] font-medium"}>
                    {value}
                </span>
            ),
        },
    ];


    return (
        <div className="flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between md:items-center">
                <div className='flex flex-col gap-1'>
                    <h1 className="text-xl md:text-2xl font-bold text-primaryBlue">Commission</h1>
                    <p className='text-sm text-lightBrown tracking-wide'>Total commission earned</p>
                    <h1 className='text-xl md:text-4xl tracking-wide font-semibold text-lightBrown'>N550,000.00</h1>
                    <p className='text-sm text-lightBrown font-medium'>Last {calculateDaysDifference()} days</p>
                </div>
                <div className="flex flex-col gap-2 items-end p-4">
                    <DateRangePicker
                        startDate={selectedStartDate}
                        endDate={selectedEndDate}
                        onDateRangeChange={handleDateRangeChange}
                        className="w-64"
                    />
                    <SearchForm value={searchValue} onChange={setSearchValue} />
                </div>
            </div>



            <Card className="bg-white border border-darkCharcoal/20 rounded-lg">
                <CardBody className="p-6 shadow-md">
                    <DataTable
                        data={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        columns={dashboardLeadColumns}
                        totalItems={filteredData.length}
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

export default AdminCommissionView