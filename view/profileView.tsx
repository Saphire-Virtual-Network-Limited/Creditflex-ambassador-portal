"use client";


import React, { useState } from "react";
import {
    Button,
    Avatar,
    Input,
    Select,
    SelectItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
} from "@heroui/react"
import { X } from "lucide-react";
import { CardWrapper } from "@/components/reususables/card/card-wrapper";
import avatar from "@/public/assets/images/avatar.jpg";
import { ProfileDetailsWrap } from "@/components/reususables/custom-ui/profile-details-wrap";
import Image from "next/image";
import cancelIcon from "@/public/assets/svgs/modal-cancel.svg";
import { FormField, SelectField } from "@/components/reususables";
import { ModalWrap } from "@/components/reususables/custom-ui/modal-wrap";


function UpdateBankDetailsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedBank, setSelectedBank] = useState("");

    const [formData, setFormData] = useState({
        leadName: "",
        pfaName: "",
        ippis: "",
        phoneNumber: "",
        bvn: "",
        dateOfBirth: "",
        gradeLevel: "",
        state: "",
        salaryAccount: "",
    })

    const bankOptions = [
        { label: "Access Bank", value: "access" },
        { label: "GTBank", value: "gtbank" },
        { label: "First Bank", value: "firstbank" },
        { label: "Zenith Bank", value: "zenith" }
      ];

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        // Handle form submission
        console.log("Form submitted:", formData)
        onClose()
    }

    return (
        <ModalWrap isOpen={isOpen} onClose={onClose} title="Update Bank Details">
            <div className="space-y-6">
                <div>
                    <SelectField
                        label="Bank Name"
                        htmlFor="bankName"
                        id="bankName"
                        isInvalid={false}
                        errorMessage=""
                        placeholder="Select Bank"
                        options={bankOptions}
                        onChange={(value) => setSelectedBank(value as string)}
                        selectionMode="single"
                    />
                </div>
                <div>
                    <FormField
                        label="Account Number"
                        htmlFor="accountNumber"
                        type="text"
                        id="accountNumber"
                        placeholder="Enter Account Number"
                        size="lg"
                    />
                </div>
                <div>
                    <FormField
                        label="Account Name"
                        htmlFor="accountName"
                        type="text"
                        id="accountName"
                        placeholder="Enter Account Name"
                        size="lg"
                    />
                </div>
                {/* Submit Button */}
                <Button className="bg-primaryBlue rounded-lg w-full mt-6 text-sm text-white" size="lg" onPress={handleSubmit}>
                    Update
                </Button>
            </div>
        </ModalWrap>



    )
}

const ProfileView = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <div className="max-w-4xl mx-auto">
                <CardWrapper>
                    <div className="py-5">
                        <h1 className="text-2xl font-bold text-primaryBlue">Profile</h1>
                    </div>
                    <div className="flex flex-col divide-y  divide-[#8B8B8B5C]">
                        <div className="pt-6" >
                            {/* Primary Details */}
                            <div className="mb-4">
                                <h2 className="text-sm font-semibold text-primaryBlue mb-6">Primary Details</h2>

                                {/* Profile Photo Section */}
                                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                                    <Avatar
                                        className="w-20 h-20 text-large"
                                        src={avatar.src}
                                    />
                                    <div className="flex-1">
                                        <Button className="bg-primaryBlue rounded-lg  text-sm text-white" size="sm">
                                            Upload new photo
                                        </Button>
                                        <p className="text-xs text-lightBrown/50 font-medium mt-3">PNG, JPG, JPEG under 5MB</p>
                                    </div>
                                </div>

                                {/* Personal Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ProfileDetailsWrap label="First name" value="Geraldine" />
                                    <ProfileDetailsWrap label="Last name" value="Samson" />
                                    <ProfileDetailsWrap label="Email address" value="Geraldinesamson@gamil.com" />
                                    <ProfileDetailsWrap label="Phone number" value="09102847473" />
                                    <ProfileDetailsWrap label="BVN" value="2929388211" />
                                    <div className="md:col-span-2 lg:col-span-1">
                                        <label className="text-sm text-lightBrown/50 font-medium  mb-1 block">Home address</label>
                                        <p className="font-semibold text-sm text-lightBrown">12, George Bush Street, Montgomery Avenue, Lagos</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="pt-6">
                            {/* Other Details */}
                            <div className="mb-8">
                                <h2 className="text-sm font-semibold text-primaryBlue mb-6">Other Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ProfileDetailsWrap label="Telesales agent assigned to:" value="Abimbola Jinadu" />
                                    <ProfileDetailsWrap label="Institution/Company" value="Federal Civil Service" />
                                    <ProfileDetailsWrap label="IPPIS number" value="292934" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-6">
                            {/* Bank Details */}
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                    <h2 className="text-sm font-semibold text-primaryBlue">Bank Details</h2>
                                    <Button className="bg-primaryBlue rounded-lg  text-sm text-white" size="sm" onPress={onOpen}>
                                        Update bank details
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ProfileDetailsWrap label="Bank name" value="Polaris Bank" />
                                    <ProfileDetailsWrap label="Account name" value="James Samson" />
                                    <ProfileDetailsWrap label="Bank account number" value="0010399020" />
                                </div>
                            </div>
                        </div>
                        {/* Referral Information */}
                        <div className="pt-6">
                            <div className="flex justify-between">
                                <div>
                                    <ProfileDetailsWrap label="Referral/Invite link" value="sapphirecreditpaydayloan/amb/geraldine10293" />
                                </div>
                                <div>
                                    <ProfileDetailsWrap label="Referred by" value="Adebisi Adeleye" />
                                </div>
                            </div>
                        </div>

                    </div>
                </CardWrapper>
            </div>
            {/* Update Bank Details Modal */}
            <UpdateBankDetailsModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default ProfileView;
