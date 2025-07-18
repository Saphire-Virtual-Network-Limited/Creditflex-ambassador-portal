"use client";


import React, { useState } from "react";
import {
    Card,
    CardBody,
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
import { CameraIcon, X } from "lucide-react";
import { CardWrapper } from "@/components/reususables/card/card-wrapper";



function UpdateBankDetailsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        // Handle form submission
        console.log("Form submitted:", formData)
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            scrollBehavior="inside"
            classNames={{
                base: "max-h-[90vh]",
                body: "py-6",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-xl font-semibold text-blue-600">Update Bank Details</h2>
                    <Button isIconOnly variant="light" onPress={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </Button>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Lead Name"
                                placeholder="Enter Lead's Full Name"
                                value={formData.leadName}
                                onValueChange={(value) => handleInputChange("leadName", value)}
                                variant="bordered"
                            />
                            <Input
                                label="PFA Name"
                                placeholder="PFA Name"
                                value={formData.pfaName}
                                onValueChange={(value) => handleInputChange("pfaName", value)}
                                variant="bordered"
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="IPPIS Number"
                                placeholder="Enter IPPIS Number"
                                value={formData.ippis}
                                onValueChange={(value) => handleInputChange("ippis", value)}
                                variant="bordered"
                            />
                            <Input
                                label="Phone Number"
                                placeholder="Enter Phone Number"
                                value={formData.phoneNumber}
                                onValueChange={(value) => handleInputChange("phoneNumber", value)}
                                variant="bordered"
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="BVN"
                                placeholder="Enter BVN"
                                value={formData.bvn}
                                onValueChange={(value) => handleInputChange("bvn", value)}
                                variant="bordered"
                            />
                            <Input
                                label="Date Of Birth"
                                placeholder="Pick Date of Birth"
                                type="date"
                                value={formData.dateOfBirth}
                                onValueChange={(value) => handleInputChange("dateOfBirth", value)}
                                variant="bordered"
                            />
                        </div>

                        {/* Row 4 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Grade Level"
                                placeholder="Enter Grade Level"
                                value={formData.gradeLevel}
                                onValueChange={(value) => handleInputChange("gradeLevel", value)}
                                variant="bordered"
                            />
                            <Select
                                label="State"
                                placeholder="Select State"
                                selectedKeys={formData.state ? [formData.state] : []}
                                onSelectionChange={(keys) => {
                                    const value = Array.from(keys)[0] as string
                                    handleInputChange("state", value || "")
                                }}
                                variant="bordered"
                            >
                                <SelectItem key="lagos" value="lagos">
                                    Lagos
                                </SelectItem>
                                <SelectItem key="abuja" value="abuja">
                                    Abuja
                                </SelectItem>
                                <SelectItem key="kano" value="kano">
                                    Kano
                                </SelectItem>
                                <SelectItem key="rivers" value="rivers">
                                    Rivers
                                </SelectItem>
                                <SelectItem key="ogun" value="ogun">
                                    Ogun
                                </SelectItem>
                                <SelectItem key="kaduna" value="kaduna">
                                    Kaduna
                                </SelectItem>
                            </Select>
                        </div>

                        {/* Row 5 */}
                        <Input
                            label="Salary Account Number"
                            placeholder="Enter Salary Account Number"
                            value={formData.salaryAccount}
                            onValueChange={(value) => handleInputChange("salaryAccount", value)}
                            variant="bordered"
                        />

                        {/* Submit Button */}
                        <Button color="primary" size="lg" className="w-full mt-6" onPress={handleSubmit}>
                            Onboard
                        </Button>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

const ProfileView = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <div className="max-w-4xl mx-auto">
                <CardWrapper>
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-blue-600">Profile</h1>
                    </div>
                    {/* Primary Details */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-blue-600 mb-6">Primary Details</h2>

                        {/* Profile Photo Section */}
                        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                            <div className="relative">
                                <Avatar src="/placeholder.svg?height=80&width=80" className="w-20 h-20" name="Geraldine" />
                                <Button isIconOnly size="sm" color="primary" className="absolute -bottom-1 -right-1">
                                    <CameraIcon className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex-1">
                                <Button color="primary" variant="bordered" size="sm" className="mb-2">
                                    Upload new photo
                                </Button>
                                <p className="text-sm text-gray-500">PNG, JPG, JPEG under 5MB</p>
                            </div>
                        </div>

                        {/* Personal Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">First name</label>
                                <p className="font-medium text-gray-900">Geraldine</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Last name</label>
                                <p className="font-medium text-gray-900">Samson</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Email address</label>
                                <p className="font-medium text-gray-900">Geraldinesamson@gamil.com</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Phone number</label>
                                <p className="font-medium text-gray-900">09102847473</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">BVN</label>
                                <p className="font-medium text-gray-900">2929388211</p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-1">
                                <label className="text-sm text-gray-600 mb-1 block">Home address</label>
                                <p className="font-medium text-gray-900">12, George Bush Street, Montgomery Avenue, Lagos</p>
                            </div>
                        </div>
                    </div>

                    {/* Other Details */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-blue-600 mb-6">Other Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Telesales agent assigned to:</label>
                                <p className="font-medium text-gray-900">Abimbola Jinadu</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Institution/Company</label>
                                <p className="font-medium text-gray-900">Federal Civil Service</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">IPPIS number</label>
                                <p className="font-medium text-gray-900">292934</p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h2 className="text-lg font-semibold text-blue-600 mb-4 sm:mb-0">Bank Details</h2>
                            <Button color="primary" size="sm" onPress={onOpen}>
                                Update bank details
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Bank name</label>
                                <p className="font-medium text-gray-900">Polaris Bank</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Account name</label>
                                <p className="font-medium text-gray-900">James Samson</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Bank account number</label>
                                <p className="font-medium text-gray-900">0010399020</p>
                            </div>
                        </div>
                    </div>

                    {/* Referral Information */}
                    <div className="border-t pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Referral/Invite link</label>
                                <p className="font-medium text-gray-900 break-all">sapphirecreditpaydayloan/amb/geraldine10293</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-1 block">Referred by</label>
                                <p className="font-medium text-gray-900">Adebisi Adeleye</p>
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
