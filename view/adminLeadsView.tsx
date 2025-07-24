"use client";

import { FormField, ModalWrap, SelectField, AutoCompleteField, DateFormField } from "@/components/reususables";
import { StatusDropdown } from "@/components/reususables/custom-ui/dropdown";
import { DataTable, type Column } from "@/components/reususables/custom-ui/table";
import { SearchForm } from "@/components/reususables/form/searchForm";
import { Button, Card, CardBody, useDisclosure } from "@heroui/react";
import { useState, useRef } from "react";
import Image from "next/image";
import successIcon from "@/public/assets/svgs/green-checkmark.svg";
import { createLead, getBanks, getBankDetails, getLeads } from "@/lib/api";
import { toast } from "sonner";
import React from "react";
import NaijaStates from 'naija-state-local-government';
import { useAuthListener } from "@/lib/tokenManager";

// Onboard Modal
function OnboardModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: (leadName?: string) => void }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        leadName: "",
        ippisNumber: "",
        phoneNumber: "",
        bvn: "",
        salaryAccountNumber: "",
        salaryAccountName: "",
        salaryBankCode: "",
        gradeLevel: "",
        pfaName: "",
        dob: "",
        state: "",
    });

    // Error state for form validation
    const [errors, setErrors] = useState({
        leadName: "",
        ippisNumber: "",
        phoneNumber: "",
        bvn: "",
        salaryAccountNumber: "",
        salaryAccountName: "",
        salaryBankCode: "",
        gradeLevel: "",
        pfaName: "",
        dob: "",
        state: "",
    });

    // Banks state for salary account
    const [banks, setBanks] = useState<{ label: string; value: string }[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [accountNameEnabled, setAccountNameEnabled] = useState(false);
    const [loadingBankDetails, setLoadingBankDetails] = useState(false);

    // Add refs for debouncing and canceling requests
    const bankDetailsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const stateOptions = NaijaStates.states().map((stateName: string) => ({
        label: stateName,
        value: stateName
    }));

    // Calculate minimum date (18 years ago from today)
    const getMinDate = () => {
        const today = new Date();
        // Calculate the date exactly 18 years ago
        const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        const result = minDate.toISOString().split('T')[0];
        console.log('Minimum date for 18+ years:', result, 'Today:', today.toISOString().split('T')[0]);
        return result;
    };

    // Calculate maximum date (today)
    const getMaxDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Fetch banks on component mount
    React.useEffect(() => {
        const fetchBanks = async () => {
            try {
                setLoadingBanks(true);
                const response = await getBanks();
                if (response?.statusCode === 200 && response?.data) {
                    const bankOptions = response.data.map((bank: any) => ({
                        label: bank.name,
                        value: bank.code
                    }));
                    setBanks(bankOptions);
                } else {
                    console.error("Failed to fetch banks:", response);
                    toast.error("Failed to load bank options. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching banks:", error);
                toast.error("Failed to load bank options. Please try again.");
            } finally {
                setLoadingBanks(false);
            }
        };
        fetchBanks();
    }, []);

    // Cleanup effect to clear timeouts and abort requests on unmount
    React.useEffect(() => {
        return () => {
            if (bankDetailsTimeoutRef.current) {
                clearTimeout(bankDetailsTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Validate individual field
    const validateField = (field: string, value: string) => {
        let error = "";
        
        switch (field) {
            case "leadName":
                if (!value.trim()) {
                    error = "Lead name is required";
                }
                break;
            case "pfaName":
                if (!value.trim()) {
                    error = "PFA name is required";
                }
                break;
            case "ippisNumber":
                if (!value.trim()) {
                    error = "IPPIS number is required";
                } else if (value.length < 6) {
                    error = "IPPIS number must be at least 6 digits";
                }
                break;
            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (value.length !== 11) {
                    error = "Phone number must be 11 digits";
                }
                break;
            case "bvn":
                if (!value.trim()) {
                    error = "BVN is required";
                } else if (value.length !== 11) {
                    error = "BVN must be 11 digits";
                }
                break;
            case "dob":
                console.log("Validating dob field with value:", value);
                if (!value.trim()) {
                    console.log("DOB validation failed: empty value");
                    error = "Date of birth is required";
                } else {
                    // Calculate age and ensure person is at least 18 years old
                    const birthDate = new Date(value);
                    const today = new Date();
                    console.log("Parsed birth date:", birthDate);
                    console.log("Today's date:", today);
                    
                    // Check if the date is valid
                    if (isNaN(birthDate.getTime())) {
                        console.log("DOB validation failed: invalid date");
                        error = "Please enter a valid date of birth";
                        break;
                    }
                    
                    // Calculate age more precisely
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    
                    // Adjust age if birthday hasn't occurred this year
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    
                    console.log("Calculated age:", age);
                    
                    if (age < 18) {
                        console.log("DOB validation failed: too young");
                        error = "Person must be at least 18 years old";
                    } else if (age > 100) {
                        console.log("DOB validation failed: too old");
                        error = "Please enter a valid date of birth";
                    } else {
                        console.log("DOB validation passed");
                    }
                }
                break;
            case "gradeLevel":
                if (!value.trim()) {
                    error = "Grade level is required";
                }
                break;
            case "state":
                if (!value.trim()) {
                    error = "State is required";
                }
                break;
            case "salaryAccountNumber":
                if (!value.trim()) {
                    error = "Salary account number is required";
                } else if (value.length < 10) {
                    error = "Account number must be at least 10 digits";
                }
                break;
            case "salaryBankCode":
                if (!value.trim()) {
                    error = "Salary bank is required";
                }
                break;
            case "salaryAccountName":
                if (!value.trim()) {
                    error = "Salary account name is required";
                }
                break;
        }
        
        return error;
    };

    // Handle form field changes
    const handleChange = (field: string, value: string) => {
        // Debug logging for date of birth
        if (field === "dob") {
            console.log("Date of Birth value received:", value);
            console.log("Value type:", typeof value);
            console.log("Value length:", value?.length);
        }

        // Prevent changes to account name once it's been auto-populated
        if (field === "salaryAccountName" && accountNameEnabled) {
            return;
        }

        // For phone number and BVN, only allow digits
        if (field === "phoneNumber" || field === "bvn" || field === "ippisNumber") {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [field]: numericValue }));
            // Clear error when user starts typing
            setErrors(prev => ({ ...prev, [field]: "" }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
            // Clear error when user starts typing
            setErrors(prev => ({ ...prev, [field]: "" }));
        }

        // Clear account name when account number or bank changes
        if (field === "salaryAccountNumber" || field === "salaryBankCode") {
            setFormData(prev => ({ ...prev, salaryAccountName: "" }));
            setAccountNameEnabled(false);
            // Clear account name error when these fields change
            setErrors(prev => ({ ...prev, salaryAccountName: "" }));

            // Cancel any pending bank details request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (bankDetailsTimeoutRef.current) {
                clearTimeout(bankDetailsTimeoutRef.current);
            }

            // Debounce the bank details fetch
            bankDetailsTimeoutRef.current = setTimeout(() => {
                const newFormData = { ...formData, [field]: value };
                const accountNumber = field === "salaryAccountNumber" ? value : newFormData.salaryAccountNumber;
                const bankCode = field === "salaryBankCode" ? value : newFormData.salaryBankCode;

                // Only fetch if both fields are filled
                if (accountNumber && bankCode && accountNumber.length >= 10) {
                    fetchBankDetails(accountNumber, bankCode);
                }
            }, 500); // 500ms delay
        }
    };

    // Function to fetch bank details
    const fetchBankDetails = async (accountNumber: string, bankCode: string) => {
        try {
            // Cancel any existing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            setLoadingBankDetails(true);
            const response = await getBankDetails(accountNumber, bankCode, abortControllerRef.current.signal);
            
            // Check if request was aborted
            if (abortControllerRef.current.signal.aborted) {
                return;
            }

            if (response?.statusCode === 200 && response?.data) {
                setFormData(prev => ({ ...prev, salaryAccountName: response.data.account_name }));
                setAccountNameEnabled(true);
                // Clear account name error when successfully fetched
                setErrors(prev => ({ ...prev, salaryAccountName: "" }));
                toast.success("Account details fetched successfully!");
            } else {
                // Clear account name if API call fails
                setFormData(prev => ({ ...prev, salaryAccountName: "" }));
                setAccountNameEnabled(false);
                toast.error(response?.message || "Failed to fetch account details. Please check your account number and bank selection.");
            }
        } catch (error) {
            // Don't show error if request was aborted
            if (error instanceof Error && error.name === 'AbortError') {
                return;
            }
            console.error("Error fetching bank details:", error);
            // Clear account name if there's an error
            setFormData(prev => ({ ...prev, salaryAccountName: "" }));
            setAccountNameEnabled(false);
            toast.error("Failed to fetch account details. Please try again.");
        } finally {
            setLoadingBankDetails(false);
        }
    };

    // Reset form when modal closes
    const handleClose = () => {
        // Clear any pending timeouts and abort any ongoing requests
        if (bankDetailsTimeoutRef.current) {
            clearTimeout(bankDetailsTimeoutRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setFormData({
            leadName: "",
            ippisNumber: "",
            phoneNumber: "",
            bvn: "",
            salaryAccountNumber: "",
            salaryAccountName: "",
            salaryBankCode: "",
            gradeLevel: "",
            pfaName: "",
            dob: "",
            state: "",
        });
        setErrors({
            leadName: "",
            ippisNumber: "",
            phoneNumber: "",
            bvn: "",
            salaryAccountNumber: "",
            salaryAccountName: "",
            salaryBankCode: "",
            gradeLevel: "",
            pfaName: "",
            dob: "",
            state: "",
        });
        setAccountNameEnabled(false);
        onClose();
    };

    const handleSubmit = async () => {
        setLoading(true);
        
        console.log("handleSubmit called - current formData:", formData);
        console.log("formData.dob value:", formData.dob);
        console.log("formData.dob type:", typeof formData.dob);
        console.log("formData.dob length:", formData.dob?.length);
        
        try {
            // Validate all fields
            const newErrors = {
                leadName: validateField("leadName", formData.leadName),
                pfaName: validateField("pfaName", formData.pfaName),
                ippisNumber: validateField("ippisNumber", formData.ippisNumber),
                phoneNumber: validateField("phoneNumber", formData.phoneNumber),
                bvn: validateField("bvn", formData.bvn),
                dob: validateField("dob", formData.dob),
                gradeLevel: validateField("gradeLevel", formData.gradeLevel),
                state: validateField("state", formData.state),
                salaryAccountNumber: validateField("salaryAccountNumber", formData.salaryAccountNumber),
                salaryBankCode: validateField("salaryBankCode", formData.salaryBankCode),
                salaryAccountName: validateField("salaryAccountName", formData.salaryAccountName),
            };

            console.log("Validation errors:", newErrors);

            setErrors(newErrors);

            // Check if there are any errors
            const hasErrors = Object.values(newErrors).some(error => error !== "");
            
            if (hasErrors) {
                toast.error("Please fix the errors in the form");
                setLoading(false);
                return;
            }

            const payload = {
                leadName: formData.leadName,
                ippisNumber: formData.ippisNumber,
                phoneNumber: formData.phoneNumber,
                bvn: formData.bvn,
                salaryAccountNumber: formData.salaryAccountNumber,
                salaryAccountName: formData.salaryAccountName,
                salaryBankCode: formData.salaryBankCode,
                gradeLevel: formData.gradeLevel,
                pfaName: formData.pfaName,
                dob: new Date(formData.dob).toISOString(),
                state: formData.state,
            };

            const response = await createLead(payload);

            if (response?.statusCode === 200 && response?.data) {
                toast.success("Lead created successfully!");
                handleClose();
                onSuccess(formData.leadName);
            } else {
                console.error("Failed to create lead:", response);
                toast.error(response?.message || "Failed to create lead. Please try again.");
            }
        } catch (error) {
            console.error("Error creating lead:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrap size="4xl" isOpen={isOpen} onClose={handleClose} title="Onboard a Lead" mobileResponsive={true}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="Lead Name" 
                        htmlFor="leadName" 
                        type="text" 
                        id="leadName" 
                        placeholder="Enter Lead's Full Name" 
                        size="lg" 
                        value={formData.leadName}
                        onChange={(value: string) => handleChange("leadName", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.leadName}
                        errorMessage={errors.leadName}
                    />
                    <FormField 
                        label="PFA Name" 
                        htmlFor="pfaName" 
                        type="text" 
                        id="pfaName" 
                        placeholder="Enter PFA Name" 
                        size="lg" 
                        value={formData.pfaName}
                        onChange={(value: string) => handleChange("pfaName", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.pfaName}
                        errorMessage={errors.pfaName}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="IPPIS Number" 
                        htmlFor="ippis" 
                        type="text" 
                        id="ippis" 
                        placeholder="Enter IPPIS Number" 
                        size="lg" 
                        value={formData.ippisNumber}
                        onChange={(value: string) => handleChange("ippisNumber", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.ippisNumber}
                        errorMessage={errors.ippisNumber}
                    />
                    <FormField 
                        label="Phone Number" 
                        htmlFor="phoneNumber" 
                        type="tel" 
                        id="phoneNumber" 
                        placeholder="Enter Phone Number" 
                        size="lg" 
                        value={formData.phoneNumber}
                        onChange={(value: string) => handleChange("phoneNumber", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.phoneNumber}
                        errorMessage={errors.phoneNumber}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="BVN" 
                        htmlFor="bvn" 
                        type="text" 
                        id="bvn" 
                        placeholder="Enter BVN" 
                        size="lg" 
                        value={formData.bvn}
                        onChange={(value: string) => handleChange("bvn", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.bvn}
                        errorMessage={errors.bvn}
                    />
                    <DateFormField 
                        label="Date Of Birth" 
                        htmlFor="dateOfBirth" 
                        type="date"
                        id="dateOfBirth" 
                        size="lg"
                        value={formData.dob}
                        onChange={(value: string) => handleChange("dob", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.dob}
                        errorMessage={errors.dob}
                        min={getMinDate()}
                        max={getMaxDate()}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="Grade Level" 
                        htmlFor="gradeLevel" 
                        type="text" 
                        id="gradeLevel" 
                        placeholder="Enter Grade Level" 
                        size="lg" 
                        value={formData.gradeLevel}
                        onChange={(value: string) => handleChange("gradeLevel", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.gradeLevel}
                        errorMessage={errors.gradeLevel}
                    />
                    <SelectField
                        label="State"
                        htmlFor="state"
                        id="state"
                        isInvalid={!!errors.state}
                        errorMessage={errors.state}
                        placeholder="Select State"
                        options={stateOptions}
                        onChange={(value) => handleChange("state", value as string)}
                        selectionMode="single"
                        required
                        reqValue="*"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField 
                        label="Salary Account Number" 
                        htmlFor="salaryAccount" 
                        type="text" 
                        id="salaryAccount" 
                        placeholder="Enter Salary Account Number" 
                        size="lg" 
                        value={formData.salaryAccountNumber}
                        onChange={(value: string) => handleChange("salaryAccountNumber", value)}
                        required
                        reqValue="*"
                        isInvalid={!!errors.salaryAccountNumber}
                        errorMessage={errors.salaryAccountNumber}
                    />
                    <AutoCompleteField
                        label="Salary Bank"
                        htmlFor="salaryBankCode"
                        id="salaryBankCode"
                        isInvalid={!!errors.salaryBankCode}
                        errorMessage={errors.salaryBankCode}
                        placeholder={loadingBanks ? "Loading banks..." : banks.length > 0 ? "Search/select bank" : "No bank available"}
                        value={formData.salaryBankCode}
                        onChange={(value: string) => handleChange("salaryBankCode", value)}
                        options={banks}
                        isDisabled={loadingBanks || banks.length === 0}
                        required
                        reqValue="*"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <FormField 
                        label="Salary Account Name" 
                        htmlFor="salaryAccountName" 
                        type="text" 
                        id="salaryAccountName" 
                        placeholder={loadingBankDetails ? "Fetching account details..." : accountNameEnabled ? "Account name (auto-populated)" : "Enter account number and select bank to auto-fetch"}
                        size="lg" 
                        value={formData.salaryAccountName}
                        onChange={(value: string) => handleChange("salaryAccountName", value)}
                        disabled={!accountNameEnabled || loadingBankDetails}
                        required
                        isInvalid={!!errors.salaryAccountName}
                        errorMessage={errors.salaryAccountName}
                    />
                    {loadingBankDetails && (
                        <div className="text-xs text-blue-600 mt-1">
                            Fetching account details...
                        </div>
                    )}
                </div>

                <Button 
                    className="bg-primaryBlue rounded-lg w-full mt-6 text-sm text-white" 
                    size="lg" 
                    onPress={handleSubmit}
                    isLoading={loading}
                    spinner
                >
                    Onboard Lead
                </Button>
            </div>
        </ModalWrap>
    );
}

// Success Modal
function SuccessModal({ isOpen, onClose, leadName }: { isOpen: boolean; onClose: () => void; leadName?: string }) {
    return (
        <ModalWrap size="sm" hasHeader={false} isOpen={isOpen} onClose={onClose}>
            <div className="text-center flex flex-col justify-center items-center space-y-4 py-6">
                <span>
                    <Image src={successIcon} width={100} alt="Success" />
                </span>
                <p className="text-lg font-semibold text-lightBrown">
                    {leadName ? `${leadName} has been onboarded successfully` : "Lead has been onboarded successfully"}
                </p>

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
    const [createdLeadName, setCreatedLeadName] = useState<string>("");

    // Listen for auth events (sign-out, token expiration)
    useAuthListener();

    // API data states
    const [leadsData, setLeadsData] = useState<any[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(false);

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

    // Fetch leads on component mount
    React.useEffect(() => {
        fetchLeads();
    }, []);

    const handleSuccess = (leadName?: string) => {
        setCreatedLeadName(leadName || "");
        setShowSuccess(true);
        // Refresh leads data after successful creation
        fetchLeads();
    };
    const closeSuccess = () => setShowSuccess(false);

    // Filter based on search input
    const filteredData = Array.isArray(leadsData) ? leadsData.filter((lead) => {
        const searchTerm = searchValue.toLowerCase();

        const matchesSearch =
            lead.leadName?.toLowerCase().includes(searchTerm) ||
            lead.pfaName?.toLowerCase().includes(searchTerm) ||
            lead.ippisNumber?.toLowerCase().includes(searchTerm) ||
            lead.bvn?.toLowerCase().includes(searchTerm) ||
            lead.phoneNumber?.toLowerCase().includes(searchTerm) ||
            lead.state?.toLowerCase().includes(searchTerm) ||
            lead.gradeLevel?.toLowerCase().includes(searchTerm) ||
            lead.salaryAccountNumber?.toLowerCase().includes(searchTerm);

        const matchesStatus =
            status === "Select Status" || lead.status?.toLowerCase() === status.toLowerCase();

        return matchesSearch && matchesStatus;
    }) : [];

    const dashboardLeadColumns: Column[] = [
        { 
            key: "id", 
            header: "S/N", 
            width: "w-16", 
            minWidth: "60px",
            render: (value: string, row: any) => {
                // Find the index of this row in the current page data
                const currentPageData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
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
                };
                const status = statusMap[value?.toUpperCase()] || { text: value || "Unknown", color: "text-gray-600 font-medium" };
                return <span className={status.color}>{status.text}</span>;
            },
        },
    ];

    const statuses = ["Select Status", "APPROVED", "DECLINED", "INITIATED"];

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
                    {loadingLeads ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryBlue mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading leads...</p>
                            </div>
                        </div>
                    ) : (
                        <DataTable
                            data={Array.isArray(filteredData) ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : []}
                            columns={dashboardLeadColumns}
                            totalItems={Array.isArray(filteredData) ? filteredData.length : 0}
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

            <OnboardModal isOpen={isOpen} onClose={onClose} onSuccess={handleSuccess} />
            <SuccessModal isOpen={showSuccess} onClose={closeSuccess} leadName={createdLeadName} />
        </div>
    );
}
