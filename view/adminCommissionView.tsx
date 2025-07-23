
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
            leadName: "Sarah Johnson",
            ippis: "456789",
            gradeLevel: "Level 8",
            state: "Kogi",
            phone: "08033445566",
            commissions: "N15,000.00",
            lastTransactDate: "2025-07-20",
            status: "Approved",
        },
        {
            id: 5,
            leadName: "David Wilson",
            ippis: "654321",
            gradeLevel: "Level 8",
            state: "Kwara",
            phone: "08144556677",
            commissions: "N12,000.00",
            lastTransactDate: "2025-07-22",
            status: "Approved",
        },
        {
            id: 6,
            leadName: "Emily Brown",
            ippis: "987654",
            gradeLevel: "Level 10",
            state: "Lagos",
            phone: "08055667788",
            commissions: "N18,000.00",
            lastTransactDate: "2025-07-26",
            status: "Approved",
        },
        {
            id: 7,
            leadName: "Robert Taylor",
            ippis: "135792",
            gradeLevel: "Level 6",
            state: "Oyo",
            phone: "08166778899",
            commissions: "N8,000.00",
            lastTransactDate: "2025-07-15",
            status: "Approved",
        },
        {
            id: 8,
            leadName: "Jennifer Davis",
            ippis: "246813",
            gradeLevel: "Level 10",
            state: "Ekiti",
            phone: "08077889900",
            commissions: "N20,000.00",
            lastTransactDate: "2025-07-28",
            status: "Approved",
        },
        {
            id: 9,
            leadName: "Christopher Miller",
            ippis: "369258",
            gradeLevel: "Level 10",
            state: "Kebbi",
            phone: "08188990011",
            commissions: "N5,000.00",
            lastTransactDate: "2025-07-12",
            status: "Declined",
        },
        {
            id: 10,
            leadName: "Amanda Garcia",
            ippis: "147258",
            gradeLevel: "Level 12",
            state: "Kano",
            phone: "08099001122",
            commissions: "N25,000.00",
            lastTransactDate: "2025-07-30",
            status: "Approved",
        },
        {
            id: 11,
            leadName: "James Rodriguez",
            ippis: "258369",
            gradeLevel: "Level 8",
            state: "Kaduna",
            phone: "08100112233",
            commissions: "N14,000.00",
            lastTransactDate: "2025-07-25",
            status: "Approved",
        },
        {
            id: 12,
            leadName: "Lisa Martinez",
            ippis: "369147",
            gradeLevel: "Level 10",
            state: "Plateau",
            phone: "08011223344",
            commissions: "N16,000.00",
            lastTransactDate: "2025-07-17",
            status: "Declined",
        },
        {
            id: 13,
            leadName: "Thomas Anderson",
            ippis: "741852",
            gradeLevel: "Level 6",
            state: "Sokoto",
            phone: "08122334455",
            commissions: "N9,000.00",
            lastTransactDate: "2025-07-19",
            status: "Approved",
        },
        {
            id: 14,
            leadName: "Michelle Thompson",
            ippis: "852963",
            gradeLevel: "Level 12",
            state: "Zamfara",
            phone: "08033445566",
            commissions: "N30,000.00",
            lastTransactDate: "2025-07-31",
            status: "Approved",
        },
        {
            id: 15,
            leadName: "Daniel White",
            ippis: "963741",
            gradeLevel: "Level 8",
            state: "Katsina",
            phone: "08144556677",
            commissions: "N11,000.00",
            lastTransactDate: "2025-07-23",
            status: "Approved",
        },
        {
            id: 16,
            leadName: "Nicole Harris",
            ippis: "159357",
            gradeLevel: "Level 10",
            state: "Jigawa",
            phone: "08055667788",
            commissions: "N7,000.00",
            lastTransactDate: "2025-07-16",
            status: "Declined",
        },
        {
            id: 17,
            leadName: "Kevin Clark",
            ippis: "357159",
            gradeLevel: "Level 6",
            state: "Yobe",
            phone: "08166778899",
            commissions: "N6,000.00",
            lastTransactDate: "2025-07-21",
            status: "Approved",
        },
        {
            id: 18,
            leadName: "Stephanie Lewis",
            ippis: "753951",
            gradeLevel: "Level 12",
            state: "Borno",
            phone: "08077889900",
            commissions: "N35,000.00",
            lastTransactDate: "2025-07-29",
            status: "Approved",
        },
        {
            id: 19,
            leadName: "Brian Hall",
            ippis: "951753",
            gradeLevel: "Level 8",
            state: "Adamawa",
            phone: "08188990011",
            commissions: "N13,000.00",
            lastTransactDate: "2025-07-24",
            status: "Approved",
        },
        {
            id: 20,
            leadName: "Rachel Young",
            ippis: "357951",
            gradeLevel: "Level 10",
            state: "Taraba",
            phone: "08099001122",
            commissions: "N17,000.00",
            lastTransactDate: "2025-07-27",
            status: "Declined",
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
        { key: "id", header: "S/N", width: "w-16", minWidth: "60px" },
        { key: "leadName", header: "Lead Name", width: "w-32", minWidth: "120px" },
        { key: "ippis", header: "IPPIS Number", width: "w-28", minWidth: "100px" },
        { key: "phone", header: "Phone Number", width: "w-32", minWidth: "110px" },
        { key: "gradeLevel", header: "Grade Level", width: "w-24", minWidth: "90px" },
        { key: "state", header: "State", width: "w-20", minWidth: "80px" },
        { key: "commissions", header: "Commissions", width: "w-32", minWidth: "120px" },
        { key: "lastTransactDate", header: "Last Transaction Date", width: "w-36", minWidth: "140px" },
        {
            key: "status",
            header: "Status",
            width: "w-24",
            minWidth: "80px",
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
                    <h1 className='text-2xl md:text-4xl tracking-wide font-semibold text-lightBrown'>N550,000.00</h1>
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