"use client"

import { InfoCard } from "@/components/reususables/card/info-card"
import { DataTable, type Column } from "@/components/reususables/custom-ui/table"
import multipleUser from "@/public/assets/svgs/multiple-user-filled.svg"
import { Button, Card, CardBody } from "@heroui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getLeads, getAmbassadorProfile } from "@/lib/api"
import { toast } from "sonner"
import React from "react"
import { useAuthListener } from "@/lib/tokenManager"

export default function AdminDashView() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const router = useRouter();

    // Listen for auth events (sign-out, token expiration)
    useAuthListener();

    // API data states
    const [leadsData, setLeadsData] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);

    // Ambassador profile states
    const [ambassadorProfile, setAmbassadorProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Fetch leads from API
    const fetchLeads = async () => {
        try {
            setLoadingLeads(true);
            const response = await getLeads();
            if (response?.statusCode === 200 && response?.data?.data) {
                // Access the nested data structure: response.data.data
                const leadsArray = Array.isArray(response.data.data) ? response.data.data : [];
                setLeadsData(leadsArray);
            } else {
                console.error("Failed to fetch leads:", response);
                toast.error("Failed to load leads. Please try again.");
                setLeadsData([]); // Set empty array on error
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to load leads. Please try again.");
            setLeadsData([]); // Set empty array on error
        } finally {
            setLoadingLeads(false);
        }
    };

    // Fetch ambassador profile from API
    const fetchAmbassadorProfile = async () => {
        try {
            setLoadingProfile(true);
            const response = await getAmbassadorProfile();
            if (response?.statusCode === 200 && response?.data) {
                setAmbassadorProfile(response.data);
            } else {
                console.error("Failed to fetch ambassador profile:", response);
                toast.error("Failed to load profile. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching ambassador profile:", error);
            toast.error("Failed to load profile. Please try again.");
        } finally {
            setLoadingProfile(false);
        }
    };

    // Fetch leads on component mount
    React.useEffect(() => {
        fetchLeads();
        fetchAmbassadorProfile();
    }, []);


    console.log(loadingProfile)

    // Calculate dashboard statistics from real data
    const totalLeads = Array.isArray(leadsData) ? leadsData.length : 0;
    const approvedLeads = Array.isArray(leadsData) ? leadsData.filter(lead => lead.status === "APPROVED").length : 0;
    const commissionEarned = approvedLeads * 5000;

    // Define columns for dashboard lead history
    const dashboardLeadColumns: Column[] = [
        {
            key: "id",
            header: "S/N",
            width: "w-16",
            minWidth: "60px",
            render: (value: string, row: any) => {
                // Find the index of this row in the current page data
                const currentPageData = leadsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                const rowIndex = currentPageData.findIndex(item => item.id === row.id);
                const actualIndex = (currentPage - 1) * pageSize + rowIndex + 1;
                return actualIndex;
            }
        },
        { key: "leadName", header: "Lead Name", width: "w-32", minWidth: "120px" },
        { key: "pfaName", header: "PFA Name", width: "w-32", minWidth: "120px" },
        { key: "ippisNumber", header: "IPPIS Number", width: "w-28", minWidth: "100px" },
        { key: "bvn", header: "BVN", width: "w-32", minWidth: "110px" },
        {
            key: "dob",
            header: "Date Of Birth",
            width: "w-28",
            minWidth: "100px",
            render: (value: string) => {
                if (!value) return "-";
                try {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
                } catch {
                    return value;
                }
            }
        },
        { key: "gradeLevel", header: "Grade Level", width: "w-24", minWidth: "90px" },
        { key: "state", header: "State", width: "w-20", minWidth: "80px" },
        { key: "salaryAccountNumber", header: "Salary A/C Number", width: "w-32", minWidth: "120px" },
        { key: "phoneNumber", header: "Phone Number", width: "w-32", minWidth: "110px" },
        {
            key: "status",
            header: "Status",
            width: "w-24",
            minWidth: "80px",
            render: (value: string) => {
                const statusMap: { [key: string]: { text: string; color: string } } = {
                    "APPROVED": { text: "Approved", color: "text-[#1B7E02] font-medium" },
                    "DECLINED": { text: "Declined", color: "text-[#FF0000] font-medium" },
                    "INITIATED": { text: "Initiated", color: "text-[#FFA500] font-medium" },
                    "PENDING": { text: "Pending", color: "text-[#FFA500] font-medium" }
                };
                const status = statusMap[value?.toUpperCase()] || { text: value || "Unknown", color: "text-gray-600 font-medium" };
                return <span className={status.color}>{status.text}</span>;
            },
        },
    ]


    return (
        <div className="flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between md:items-center">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-lightBrown">
                        Hello, {ambassadorProfile?.fullName || ""}
                    </h1>
                    <p className="text-sm md:text-base text-lightBrown">How are you doing today?</p>
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-medium text-lightBrown">Telesales Agent Assigned To:</p>
                    <p className="font-semibold text-right text-primaryBlue">
                        {ambassadorProfile?.telesalesId ? ambassadorProfile?.telesalesAgentName || "Assigned" : "Non-assigned"}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard cardIcon={multipleUser} cardTitle="Total Leads Onboarded" cardValue={totalLeads} />
                <InfoCard cardIcon={multipleUser} cardTitle="Total approved leads" cardValue={approvedLeads} />
                <InfoCard cardIcon={multipleUser} cardTitle="Total commission earned" cardValue={commissionEarned} currencyFormat={true} />
            </div>

            <Card className="bg-white border border-darkCharcoal/20 rounded-lg">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-semibold text-primaryBlue">Lead History</h2>
                        <Button onPress={() => router.push("/admin-leads")} className="text-primaryBlue bg-transparent text-sm font-medium">
                            View all
                        </Button>
                    </div>

                    {loadingLeads ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryBlue mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading leads...</p>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            data={Array.isArray(leadsData) ? leadsData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : []}
                            columns={dashboardLeadColumns}
                            totalItems={Array.isArray(leadsData) ? leadsData.length : 0}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={setPageSize}
                            emptyMessage="No leads registered"
                            hasOriginalData={Array.isArray(leadsData) && leadsData.length > 0}
                        />
                    )}
                </CardBody>
            </Card>

        </div>
    )
}
