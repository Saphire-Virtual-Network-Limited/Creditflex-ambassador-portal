"use client";

import { FormField, ModalWrap, SelectField } from "@/components/reususables";
import { StatusDropdown } from "@/components/reususables/custom-ui/dropdown";
import { DataTable, type Column } from "@/components/reususables/custom-ui/table";
import { SearchForm } from "@/components/reususables/form/searchForm";
import { Button, Card, CardBody, useDisclosure } from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import successIcon from "@/public/assets/svgs/green-checkmark.svg";


// Onboard Modal
function OnboardModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    const stateOptions = [
        { label: "Lagos", value: "lagos" },
        { label: "Ibadan", value: "ibadan" },
    ];

    const handleSubmit = () => {
        onClose();
        onSuccess();
    };

    return (
        <ModalWrap size="4xl" isOpen={isOpen} onClose={onClose} title="Update Bank Details">
            <div className="space-y-6 mt-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Lead Name" htmlFor="leadName" type="text" id="leadName" placeholder="Enter Lead's Full Name" size="lg" />
                    <FormField label="PFA Name" htmlFor="pfaName" type="text" id="pfaName" placeholder="Enter PFA Name" size="lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="IPPIS Number" htmlFor="ippis" type="text" id="ippis" placeholder="Enter IPPIS Number" size="lg" />
                    <FormField label="Phone Number" htmlFor="phoneNumber" type="text" id="phoneNumber" placeholder="Enter Phone Number" size="lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="BVN" htmlFor="bvn" type="text" id="bvn" placeholder="Enter BVN" size="lg" />
                    <FormField label="Date Of Birth" htmlFor="dateOfBirth" type="date" id="dateOfBirth" placeholder="Pick Date of Birth" size="lg" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Grade Level" htmlFor="gradeLevel" type="text" id="gradeLevel" placeholder="Enter Grade Level" size="lg" />
                    <SelectField
                        label="State"
                        htmlFor="state"
                        id="state"
                        isInvalid={false}
                        errorMessage=""
                        placeholder="Select State"
                        options={stateOptions}
                        onChange={(value) => (value as string)}
                        selectionMode="single"
                    />
                </div>
                <div className=" w-1/2">
                    <FormField label="Salary Account Number" htmlFor="salaryAccount" type="text" id="salaryAccount" placeholder="Enter Salary Account Number" size="lg" />
                </div>

                <Button className="bg-primaryBlue rounded-lg w-full mt-6 text-sm text-white" size="lg" onPress={handleSubmit}>
                    Onboard
                </Button>
            </div>
        </ModalWrap>
    );
}

// Success Modal
function SuccessModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <ModalWrap size="sm" hasHeader={false} isOpen={isOpen} onClose={onClose}>
            <div className="text-center flex flex-col justify-center items-center space-y-4 py-6">
                <span>
                    <Image src={successIcon} width={100} alt="Success" />
                </span>
                <p className="text-lg font-semibold text-lightBrown">James Samson has been onboarded successfully</p>

                <Button onPress={onClose} className="bg-primaryBlue px-10 rounded-md text-white">
                    Okay
                </Button>
            </div>
        </ModalWrap>
    );
}

// Main Component
export default function AdminLeadsView() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState("");
    const [status, setStatus] = useState("Select Status");
    const { isOpen, onOpen, onClose } = useDisclosure(); // onboard modal
    const [showSuccess, setShowSuccess] = useState(false); // success modal

    const handleSuccess = () => setShowSuccess(true);
    const closeSuccess = () => setShowSuccess(false);

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
            leadName: "Alice Smith",
            pfaName: "Alice Smith",
            ippis: "123456",
            bvn: "21039581030",
            dob: "15-08-1975",
            gradeLevel: "Level 8",
            state: "Ondo",
            salaryAccount: "0193949403",
            phone: "08011223344",
            status: "Approved",
        },
        {
            id: 3,
            leadName: "Michael Adams",
            pfaName: "Michael Adams",
            ippis: "789101",
            bvn: "21039581031",
            dob: "22-11-1980",
            gradeLevel: "Level 8",
            state: "Abuja",
            salaryAccount: "0193949404",
            phone: "08122334455",
            status: "Approved",
        },
        {
            id: 4,
            leadName: "Sarah Johnson",
            pfaName: "Sarah Johnson",
            ippis: "456789",
            bvn: "21039581032",
            dob: "03-06-1972",
            gradeLevel: "Level 8",
            state: "Kogi",
            salaryAccount: "0193949405",
            phone: "08033445566",
            status: "Approved",
        },
        {
            id: 5,
            leadName: "David Wilson",
            pfaName: "David Wilson",
            ippis: "654321",
            bvn: "21039581033",
            dob: "12-09-1965",
            gradeLevel: "Level 8",
            state: "Kwara",
            salaryAccount: "0193949406",
            phone: "08144556677",
            status: "Approved",
        },
        {
            id: 6,
            leadName: "Emily Brown",
            pfaName: "Emily Brown",
            ippis: "987654",
            bvn: "21039581034",
            dob: "28-02-1985",
            gradeLevel: "Level 10",
            state: "Lagos",
            salaryAccount: "0193949407",
            phone: "08055667788",
            status: "Approved",
        },
        {
            id: 7,
            leadName: "Robert Taylor",
            pfaName: "Robert Taylor",
            ippis: "135792",
            bvn: "21039581035",
            dob: "07-12-1978",
            gradeLevel: "Level 6",
            state: "Oyo",
            salaryAccount: "0193949408",
            phone: "08166778899",
            status: "Approved",
        },
        {
            id: 8,
            leadName: "Jennifer Davis",
            pfaName: "Jennifer Davis",
            ippis: "246813",
            bvn: "21039581036",
            dob: "19-05-1982",
            gradeLevel: "Level 10",
            state: "Ekiti",
            salaryAccount: "0193949409",
            phone: "08077889900",
            status: "Approved",
        },
        {
            id: 9,
            leadName: "Christopher Miller",
            pfaName: "Christopher Miller",
            ippis: "369258",
            bvn: "21039581037",
            dob: "14-07-1970",
            gradeLevel: "Level 10",
            state: "Kebbi",
            salaryAccount: "0193949410",
            phone: "08188990011",
            status: "Declined",
        },
        {
            id: 10,
            leadName: "Amanda Garcia",
            pfaName: "Amanda Garcia",
            ippis: "147258",
            bvn: "21039581038",
            dob: "25-10-1988",
            gradeLevel: "Level 12",
            state: "Kano",
            salaryAccount: "0193949411",
            phone: "08099001122",
            status: "Approved",
        },
        {
            id: 11,
            leadName: "James Rodriguez",
            pfaName: "James Rodriguez",
            ippis: "258369",
            bvn: "21039581039",
            dob: "08-03-1973",
            gradeLevel: "Level 8",
            state: "Kaduna",
            salaryAccount: "0193949412",
            phone: "08100112233",
            status: "Approved",
        },
        {
            id: 12,
            leadName: "Lisa Martinez",
            pfaName: "Lisa Martinez",
            ippis: "369147",
            bvn: "21039581040",
            dob: "30-01-1987",
            gradeLevel: "Level 10",
            state: "Plateau",
            salaryAccount: "0193949413",
            phone: "08011223344",
            status: "Declined",
        },
        {
            id: 13,
            leadName: "Thomas Anderson",
            pfaName: "Thomas Anderson",
            ippis: "741852",
            bvn: "21039581041",
            dob: "17-06-1976",
            gradeLevel: "Level 6",
            state: "Sokoto",
            salaryAccount: "0193949414",
            phone: "08122334455",
            status: "Approved",
        },
        {
            id: 14,
            leadName: "Michelle Thompson",
            pfaName: "Michelle Thompson",
            ippis: "852963",
            bvn: "21039581042",
            dob: "11-12-1983",
            gradeLevel: "Level 12",
            state: "Zamfara",
            salaryAccount: "0193949415",
            phone: "08033445566",
            status: "Approved",
        },
        {
            id: 15,
            leadName: "Daniel White",
            pfaName: "Daniel White",
            ippis: "963741",
            bvn: "21039581043",
            dob: "04-08-1969",
            gradeLevel: "Level 8",
            state: "Katsina",
            salaryAccount: "0193949416",
            phone: "08144556677",
            status: "Approved",
        },
        {
            id: 16,
            leadName: "Nicole Harris",
            pfaName: "Nicole Harris",
            ippis: "159357",
            bvn: "21039581044",
            dob: "21-04-1981",
            gradeLevel: "Level 10",
            state: "Jigawa",
            salaryAccount: "0193949417",
            phone: "08055667788",
            status: "Declined",
        },
        {
            id: 17,
            leadName: "Kevin Clark",
            pfaName: "Kevin Clark",
            ippis: "357159",
            bvn: "21039581045",
            dob: "13-09-1974",
            gradeLevel: "Level 6",
            state: "Yobe",
            salaryAccount: "0193949418",
            phone: "08166778899",
            status: "Approved",
        },
        {
            id: 18,
            leadName: "Stephanie Lewis",
            pfaName: "Stephanie Lewis",
            ippis: "753951",
            bvn: "21039581046",
            dob: "26-11-1986",
            gradeLevel: "Level 12",
            state: "Borno",
            salaryAccount: "0193949419",
            phone: "08077889900",
            status: "Approved",
        },
        {
            id: 19,
            leadName: "Brian Hall",
            pfaName: "Brian Hall",
            ippis: "951753",
            bvn: "21039581047",
            dob: "09-05-1977",
            gradeLevel: "Level 8",
            state: "Adamawa",
            salaryAccount: "0193949420",
            phone: "08188990011",
            status: "Approved",
        },
        {
            id: 20,
            leadName: "Rachel Young",
            pfaName: "Rachel Young",
            ippis: "357951",
            bvn: "21039581048",
            dob: "02-12-1984",
            gradeLevel: "Level 10",
            state: "Taraba",
            salaryAccount: "0193949421",
            phone: "08099001122",
            status: "Declined",
        },
    ];

    // Filter based on search input
    const filteredData = leadData.filter((lead) => {
        const searchTerm = searchValue.toLowerCase();

        const matchesSearch =
            lead.leadName.toLowerCase().includes(searchTerm) ||
            lead.pfaName.toLowerCase().includes(searchTerm) ||
            lead.ippis.toLowerCase().includes(searchTerm) ||
            lead.bvn.toLowerCase().includes(searchTerm) ||
            lead.phone.toLowerCase().includes(searchTerm) ||
            lead.state.toLowerCase().includes(searchTerm) ||
            lead.gradeLevel.toLowerCase().includes(searchTerm) ||
            lead.salaryAccount.toLowerCase().includes(searchTerm);

        const matchesStatus =
            status === "Select Status" || lead.status.toLowerCase() === status.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const dashboardLeadColumns: Column[] = [
        { key: "id", header: "S/N", width: "w-16", minWidth: "60px" },
        { key: "leadName", header: "Lead Name", width: "w-32", minWidth: "120px" },
        { key: "pfaName", header: "PFA Name", width: "w-32", minWidth: "120px" },
        { key: "ippis", header: "IPPIS Number", width: "w-28", minWidth: "100px" },
        { key: "bvn", header: "BVN", width: "w-32", minWidth: "110px" },
        { key: "dob", header: "Date Of Birth", width: "w-28", minWidth: "100px" },
        { key: "gradeLevel", header: "Grade Level", width: "w-24", minWidth: "90px" },
        { key: "state", header: "State", width: "w-20", minWidth: "80px" },
        { key: "salaryAccount", header: "Salary A/C Number", width: "w-32", minWidth: "120px" },
        { key: "phone", header: "Phone Number", width: "w-32", minWidth: "110px" },
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

    const statuses = ["Select Status", "Approved", "Declined"];

    return (
        <div className="flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between md:items-center">
                <h1 className="text-xl md:text-2xl font-bold text-lightBrown">Leads</h1>
                <div className="flex justify-end md:justify-start">
                    <Button onPress={onOpen} className="bg-primaryBlue text-sm md:text-base  px-8 rounded-md text-white">
                        Onboard a Lead
                    </Button>
                </div>

            </div>

            <div className="flex flex-row gap-4 items-center p-4">
                <SearchForm value={searchValue} onChange={setSearchValue} />
                <StatusDropdown optionArray={statuses} selected={status} onChange={setStatus} />
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

            <OnboardModal isOpen={isOpen} onClose={onClose} onSuccess={handleSuccess} />
            <SuccessModal isOpen={showSuccess} onClose={closeSuccess} />
        </div>
    );
}
