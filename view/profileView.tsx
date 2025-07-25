"use client";


import React, { useRef, useState, useEffect } from "react";
import {
    Button,
    useDisclosure,
} from "@heroui/react"
import { CardWrapper } from "@/components/reususables/card/card-wrapper";
import ProfileDetailsWrap from "@/components/reususables/custom-ui/profile-details-wrap";
import { FormField, AutoCompleteField } from "@/components/reususables";
import ModalWrap from "@/components/reususables/custom-ui/modal-wrap";
import { Avatar } from "@/components/ui/avatar";
import { getBanks, getBankDetails, getAmbassadorProfile } from "@/lib/api";
import { toast } from "sonner";
import { TokenManager } from "@/lib/tokenManager";
import { useRouter } from "next/navigation";

// Interface for ambassador profile data
interface AmbassadorProfile {
    id: string;
    bvn: string;
    phoneNumber: string | null;
    emailAddress: string;
    institution: string | null;
    fullName: string;
    address: string;
    ippisNumber: string | null;
    password: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankCode: string;
    referralCode: string;
    referredBy: string | null;
    ambassadorProfile: string;
    teleSalesId: string | null;
    createdAt: string;
    updatedBy: string;
    teleSales?: {
        teleSalesId: string;
        fullName: string;
        email: string;
        phoneNumber: string;
        role: string;
        createdAt: string;
        updatedAt: string;
    };
}

function UpdateBankDetailsModal({ isOpen, onClose, onProfileUpdate }: {
    isOpen: boolean;
    onClose: () => void;
    onProfileUpdate?: () => void;
}) {
    // Form state
    const [formData, setFormData] = useState({
        accountNumber: "",
        bankName: "",
        accountName: "",
    });

    // Banks state
    const [banks, setBanks] = useState<{ label: string; value: string }[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [accountNameEnabled, setAccountNameEnabled] = useState(false);
    const [loadingBankDetails, setLoadingBankDetails] = useState(false);
    const [loading, setLoading] = useState(false);

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

    // Handle form field changes
    const handleChange = (field: string, value: string) => {
        // Prevent changes to account name once it's been auto-populated
        if (field === "accountName" && accountNameEnabled) {
            return;
        }

        // For account number, only allow digits
        if (field === "accountNumber") {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [field]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        // Clear account name when account number or bank changes
        if (field === "accountNumber" || field === "bankName") {
            setFormData(prev => ({ ...prev, accountName: "" }));
            setAccountNameEnabled(false);
        }

        // Call bank details endpoint when bank is selected and account number is available
        if (field === "bankName" && value && formData.accountNumber) {
            fetchBankDetails(formData.accountNumber, value);
        }

        // Call bank details endpoint when account number is entered and bank is already selected
        if (field === "accountNumber" && value && formData.bankName) {
            fetchBankDetails(value, formData.bankName);
        }
    };

    // Function to fetch bank details
    const fetchBankDetails = async (accountNumber: string, bankCode: string) => {
        try {
            setLoadingBankDetails(true);
            const response = await getBankDetails(accountNumber, bankCode);
            if (response?.statusCode === 200 && response?.data) {
                setFormData(prev => ({ ...prev, accountName: response.data.account_name }));
                setAccountNameEnabled(true);
                toast.success("Account details fetched successfully!");
            } else {
                // Clear account name if API call fails
                setFormData(prev => ({ ...prev, accountName: "" }));
                setAccountNameEnabled(false);
                toast.error(response?.message || "Failed to fetch account details. Please check your account number and bank selection.");
            }
        } catch (error) {
            console.error("Error fetching bank details:", error);
            // Clear account name if there's an error
            setFormData(prev => ({ ...prev, accountName: "" }));
            setAccountNameEnabled(false);
            toast.error("Failed to fetch account details. Please try again.");
        } finally {
            setLoadingBankDetails(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Validate form
            if (!formData.accountNumber || !formData.bankName || !formData.accountName) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }

            // TODO: Add API call to update bank details
            // const response = await updateBankDetails(formData);

            toast.success("Bank details updated successfully!");
            onClose();

            // Reset form
            setFormData({
                accountNumber: "",
                bankName: "",
                accountName: "",
            });
            setAccountNameEnabled(false);

            // Refresh profile data after successful update
            onProfileUpdate?.();
        } catch (error) {
            console.error("Error updating bank details:", error);
            toast.error("Failed to update bank details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrap size="sm" isOpen={isOpen} onClose={onClose} title="Update Bank Details">
            <div className="space-y-6">
                <div>
                    <FormField
                        label="Bank Account Number"
                        htmlFor="accountNumber"
                        type="text"
                        id="accountNumber"
                        placeholder="Enter your Account Number"
                        required
                        size="lg"
                        value={formData.accountNumber}
                        onChange={(value: string) => handleChange("accountNumber", value)}
                    />
                </div>
                <div>
                    <AutoCompleteField
                        label="Bank Name"
                        htmlFor="bankName"
                        id="bankName"
                        isInvalid={false}
                        errorMessage=""
                        placeholder={loadingBanks ? "Loading banks..." : banks.length > 0 ? "Search/select bank" : "No bank available"}
                        value={formData.bankName}
                        onChange={(value: string) => handleChange("bankName", value)}
                        options={banks}
                        isDisabled={loadingBanks || banks.length === 0}
                    />
                </div>
                <div>
                    <FormField
                        label="Account Name"
                        htmlFor="accountName"
                        type="text"
                        id="accountName"
                        placeholder={loadingBankDetails ? "Fetching account details..." : accountNameEnabled ? "Account name (auto-populated)" : "Select bank and enter account number first"}
                        required
                        size="lg"
                        value={formData.accountName}
                        onChange={(value: string) => handleChange("accountName", value)}
                        disabled={!accountNameEnabled || loadingBankDetails}
                    />
                    {loadingBankDetails && (
                        <div className="text-xs text-blue-600 mt-1">
                            Fetching account details...
                        </div>
                    )}
                </div>
                {/* Submit Button */}
                <Button
                    className="bg-primaryBlue rounded-lg w-full mt-6 text-sm text-white"
                    size="lg"
                    onPress={handleSubmit}
                    isLoading={loading}
                    spinner
                >
                    Update
                </Button>
            </div>
        </ModalWrap>
    )
}

const ProfileView = () => {
    const { isOpen, onClose } = useDisclosure();
    const [avatarUrl, setAvatarUrl] = useState<string>("/assets/images/avatar.jpg");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    // Profile data state
    const [profileData, setProfileData] = useState<AmbassadorProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Check authentication on component mount
    useEffect(() => {
        if (!TokenManager.isAuthenticated()) {
            toast.error("Please sign in to view your profile");
            router.push("/sign-in");
            return;
        }
    }, [router]);

    // Fetch profile data on component mount
    useEffect(() => {
        const fetchProfileData = async () => {
            // Don't fetch if user is not authenticated
            if (!TokenManager.isAuthenticated()) {
                return;
            }

            try {
                setLoadingProfile(true);
                const response = await getAmbassadorProfile();
                if (response?.statusCode === 200 && response?.data) {
                    setProfileData(response.data);
                } else {
                    console.error("Failed to fetch profile:", response);
                    toast.error("Failed to load profile data. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data. Please try again.");
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfileData();
    }, []);

    // Function to refresh profile data
    const refreshProfileData = () => {
        const fetchProfileData = async () => {
            // Don't fetch if user is not authenticated
            if (!TokenManager.isAuthenticated()) {
                return;
            }

            try {
                setLoadingProfile(true);
                const response = await getAmbassadorProfile();
                if (response?.statusCode === 200 && response?.data) {
                    setProfileData(response.data);
                } else {
                    console.error("Failed to fetch profile:", response);
                    toast.error("Failed to load profile data. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to load profile data. Please try again.");
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfileData();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.size < 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setAvatarUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload an image under 5MB.");
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <CardWrapper>
                    <div className="py-5">
                        <h1 className="text-2xl font-bold text-primaryBlue">Profile</h1>
                    </div>

                    {loadingProfile ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
                                <p className="text-primaryBlue">Loading profile...</p>
                            </div>
                        </div>
                    ) : profileData ? (
                        <div className="flex flex-col divide-y  divide-[#8B8B8B5C]">
                            <div className="pt-6" >
                                {/* Primary Details */}
                                <div className="mb-4">
                                    <h2 className="text-sm font-semibold text-primaryBlue mb-6">Primary Details</h2>

                                    {/* Profile Photo Section */}
                                    <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                                        <Avatar src={avatarUrl} name={profileData.fullName || "User"} size="lg" />
                                        <div className="flex-1">
                                            <Button
                                                className="bg-primaryBlue rounded-lg text-sm text-white"
                                                size="sm"
                                                onPress={triggerFileInput}
                                            >
                                                Upload new photo
                                            </Button>
                                            <p className="text-xs mt-1 text-lightBrown/50">PNG, Jpg, Jpeg under 5MB</p>

                                            <input
                                                type="file"
                                                accept="image/png, image/jpg, image/jpeg"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Personal Information Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <ProfileDetailsWrap
                                            label="Full name"
                                            value={profileData.fullName || 'N/A'}
                                        />
                                        <ProfileDetailsWrap
                                            label="Email address"
                                            value={profileData.emailAddress || 'N/A'}
                                        />
                                        <ProfileDetailsWrap
                                            label="Phone number"
                                            value={profileData.phoneNumber || 'N/A'}
                                        />
                                        <ProfileDetailsWrap
                                            label="BVN"
                                            value={profileData.bvn || 'N/A'}
                                        />
                                        <div className="md:col-span-2 lg:col-span-1">
                                            <label className="text-sm text-lightBrown/50 font-medium  mb-1 block">Home address</label>
                                            <p className="font-semibold text-sm text-lightBrown">{profileData.address || 'N/A'}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="pt-6">
                                {/* Other Details */}
                                <div className="mb-8">
                                    <h2 className="text-sm font-semibold text-primaryBlue mb-6">Other Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <ProfileDetailsWrap
                                            label="Telesales agent assigned to:"
                                            value={profileData.teleSales?.fullName || 'Non-assigned'}
                                        />
                                        <ProfileDetailsWrap
                                            label="Institution/Company"
                                            value={profileData.institution || 'N/A'}
                                        />
                                        <ProfileDetailsWrap
                                            label="IPPIS number"
                                            value={profileData.ippisNumber || 'N/A'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6">
                                {/* Bank Details */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-sm font-semibold text-primaryBlue">Bank Details</h2>
                                        {/* <Button className="bg-primaryBlue rounded-lg text-sm text-white" size="sm" onPress={onOpen}>
                                            Update bank details
                                        </Button> */}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <ProfileDetailsWrap
                                            label="Bank name"
                                            value={profileData.bankName || 'N/A'}
                                        />
                                        <ProfileDetailsWrap
                                            label="Account name"
                                            value={profileData.accountName || 'N/A'}
                                        />
                                        <ProfileDetailsWrap
                                            label="Bank account number"
                                            value={profileData.accountNumber || 'N/A'}
                                        />
                                    </div>
                                </div>
                                <p className="md:text-right mb-2 text-dimRed text-sm">Please contact support to change account details</p>
                            </div>
                            {/* Referral Information */}
                            {/* <div className="pt-6">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
                                    <div>
                                        <ProfileDetailsWrap
                                            label="Referral/Invite link"
                                            value={profileData.referralCode ? `https://ambassador.connectwithsapphire.com/sign-up?ref_code=${profileData.referralCode}` : 'N/A'}
                                        />
                                    </div>
                                    <div>
                                        <ProfileDetailsWrap
                                            label="Referred by"
                                            value={profileData.referredBy || 'Not referred'}
                                        />
                                    </div>
                                </div>
                            </div> */}

                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <p className="text-red-500">Failed to load profile data</p>
                                <Button
                                    className="bg-primaryBlue rounded-lg text-sm text-white mt-4"
                                    size="sm"
                                    onPress={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}
                </CardWrapper>
            </div>
            {/* Update Bank Details Modal */}
            <UpdateBankDetailsModal isOpen={isOpen} onClose={onClose} onProfileUpdate={refreshProfileData} />
        </>
    );
};

export default ProfileView;
