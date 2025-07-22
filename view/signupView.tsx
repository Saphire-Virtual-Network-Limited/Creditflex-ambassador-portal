"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/images/brand-logo.png"
import { FormField, PasswordField, SelectField } from "@/components/reususables";
import backArrow from "@/public/assets/svgs/back-arrow.svg"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowDown } from "lucide-react"
import { signupStepOne, signupStepTwo, signupStepThree } from "@/lib/api";
import { signupStep1Schema, signupStep2Schema, signupStep3Schema, validateForm } from "@/lib/validations";
import { toast } from "sonner";
import React from "react";

export default function SignupView() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track if ref_code is present and its value
  const refCodeFromUrl = searchParams.get("ref_code") || "";
  const [refCodeLocked, setRefCodeLocked] = useState(false);

  // Form state for all steps
  const [formData, setFormData] = useState({
    // Step 1
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    // Step 2
    accountNumber: "",
    bankName: "",
    accountName: "",
    bvn: "",
    // Step 3
    address: "",
    institution: "",
    ippis: "",
    telesalesAgent: "",
  });

  // Set referralCode from URL on mount if present
  React.useEffect(() => {
    if (refCodeFromUrl) {
      setFormData(prev => ({ ...prev, referralCode: refCodeFromUrl }));
      setRefCodeLocked(true);
    }
  }, [refCodeFromUrl]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    // For phone number, only allow digits
    if (field === "phoneNumber") {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // SCROLL TO NEXT SECTION FOR MOBILE
  const handleScroll = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const bankOptions = [
    { label: "Access Bank", value: "access" },
    { label: "GTBank", value: "gtbank" },
    { label: "First Bank", value: "firstbank" },
    { label: "Zenith Bank", value: "zenith" }
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <FormField
          label="Email Address"
          htmlFor="email"
          type="text"
          id="email"
          placeholder="Enter your Email Address"
          size="lg"
          value={formData.email}
          onChange={(value: string) => handleChange("email", value)}
          isInvalid={!!errors.email && formData.email.length > 0}
          errorMessage={formData.email.length > 0 ? errors.email : ""}
        />
      </div>
      <div>
        <FormField
          label="Phone Number"
          htmlFor="phoneNumber"
          type="tel"
          id="phoneNumber"
          placeholder="Enter your Phone Number"
          size="lg"
          value={formData.phoneNumber}
          onChange={(value: string) => handleChange("phoneNumber", value)}
          isInvalid={!!errors.phone && formData.phoneNumber.length > 0}
          errorMessage={formData.phoneNumber.length > 0 ? errors.phone : ""}
        />
      </div>

      <div>
        <PasswordField
          PasswordText="Password"
          placheolderText="Enter Password"
          passwordError={errors.password}
          handlePasswordChange={(value: string) => handleChange("password", value)}
        />
      </div>
      <div>
        <PasswordField
          PasswordText="Confirm Password"
          placheolderText="Confirm Password"
          passwordError={errors.confirmPassword}
          handlePasswordChange={(value: string) => handleChange("confirmPassword", value)}
        />
      </div>
      <div>
        <FormField
          label="Referral Code"
          htmlFor="referralCode"
          type="text"
          id="referralCode"
          placeholder="Enter referral code"
          size="lg"
          value={formData.referralCode}
          onChange={(value: string) => handleChange("referralCode", value)}
          isInvalid={!!errors.referredBy}
          errorMessage={errors.referredBy}
          disabled={refCodeLocked}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
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
          reqValue="*"
          value={formData.accountNumber}
          onChange={(value: string) => handleChange("accountNumber", value)}
          isInvalid={!!errors.accountNumber}
          errorMessage={errors.accountNumber}
        />
      </div>
      <div>
        <SelectField
          label="Bank Name"
          htmlFor="bankName"
          id="bankName"
          isInvalid={!!errors.bankName}
          errorMessage={errors.bankName}
          placeholder="Select Bank"
          options={bankOptions}
          onChange={(value) => handleChange("bankName", value as string)}
          selectionMode="single"
        />
      </div>
      <div>
        <FormField
          label="Account Name"
          htmlFor="accountName"
          type="text"
          id="accountName"
          placeholder="Enter your Account Name"
          required
          size="lg"
          value={formData.accountName}
          onChange={(value: string) => handleChange("accountName", value)}
        />
      </div>
      <div>
        <FormField
          label="BVN"
          htmlFor="bvn"
          type="text"
          id="bvn"
          placeholder="Enter BVN"
          required
          size="lg"
          value={formData.bvn}
          onChange={(value: string) => handleChange("bvn", value)}
          isInvalid={!!errors.bvn}
          errorMessage={errors.bvn}
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <FormField
          label="Home Address"
          htmlFor="address"
          type="text"
          id="address"
          placeholder="Enter your home address"
          required
          size="lg"
          reqValue="*"
          value={formData.address}
          onChange={(value: string) => handleChange("address", value)}
          isInvalid={!!errors.address}
          errorMessage={errors.address}
        />
      </div>
      <div>
        <SelectField
          label="Institution/Company"
          htmlFor="institution"
          id="institution"
          isInvalid={!!errors.institution}
          errorMessage={errors.institution}
          placeholder="Institution/Company"
          options={[]}
          onChange={(value) => handleChange("institution", value as string)}
          selectionMode="single"
        />
      </div>
      <div>
        <FormField
          label="IPPIS Number"
          htmlFor="ippis"
          type="text"
          id="ippis"
          placeholder="Enter your IPPIS number"
          required
          size="lg"
          value={formData.ippis}
          onChange={(value: string) => handleChange("ippis", value)}
          isInvalid={!!errors.ippis}
          errorMessage={errors.ippis}
        />
      </div>
      <div>
        <SelectField
          label="Choose Assigned Telesales Agent"
          htmlFor="telesalesAgent"
          id="telesalesAgent"
          isInvalid={false}
          errorMessage=""
          placeholder="Choose assigned Telesales Agent"
          options={[]}
          onChange={(value) => handleChange("telesalesAgent", value as string)}
          selectionMode="single"
        />
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      if (currentStep === 1) {
        // Validate Step 1
        const validationResult = validateForm(signupStep1Schema, {
          email: formData.email,
          phone: formData.phoneNumber,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          referredBy: formData.referralCode || undefined,
        });

        if (!validationResult.success) {
          setErrors(validationResult.errors || {});
          setLoading(false);
          toast.error("Please fix the errors in the form.");
          return;
        }

        // Step 1: Initiate signup
        const stepOnePayload = {
          email: formData.email,
          phone: formData.phoneNumber.replace(/\D/g, ''),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          referredBy: formData.referralCode || undefined,
        };

        const response = await signupStepOne(stepOnePayload);

        if (response?.success || response?.data) {
          toast.success("Step 1 complete! Proceed to the next step.");
          nextStep();
        } else {
          console.error("Step 1 failed:", response);
          toast.error(response?.message || "Step 1 failed. Please try again.");
        }
      } else if (currentStep === 2) {
        // Validate Step 2
        const validationResult = validateForm(signupStep2Schema, {
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          bvn: formData.bvn,
        });

        if (!validationResult.success) {
          setErrors(validationResult.errors || {});
          setLoading(false);
          toast.error("Please fix the errors in the form.");
          return;
        }

        // Step 2: Add account info
        const stepTwoPayload = {
          accountNumber: formData.accountNumber,
          bankName: formData.bankName,
          bvn: formData.bvn,
        };

        const response = await signupStepTwo(stepTwoPayload);

        if (response?.success || response?.data) {
          toast.success("Step 2 complete! Proceed to the next step.");
          nextStep();
        } else {
          console.error("Step 2 failed:", response);
          toast.error(response?.message || "Step 2 failed. Please try again.");
        }
      } else if (currentStep === 3) {
        // Validate Step 3
        const validationResult = validateForm(signupStep3Schema, {
          address: formData.address,
          ippis: formData.ippis,
          institution: formData.institution,
        });

        if (!validationResult.success) {
          setErrors(validationResult.errors || {});
          setLoading(false);
          toast.error("Please fix the errors in the form.");
          return;
        }

        // Step 3: Complete signup
        const stepThreePayload = {
          address: formData.address,
          ippis: formData.ippis,
          institution: formData.institution,
        };

        const response = await signupStepThree(stepThreePayload);

        if (response?.success || response?.data) {
          toast.success("Registration complete! Redirecting to dashboard...");
          router.push("/admin-dashboard");
        } else {
          console.error("Step 3 failed:", response);
          toast.error(response?.message || "Step 3 failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      // Handle error - show message to user
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full lg:overflow-hidden">
      {/* Left Section - Hero Content */}
      <div className="bg-primaryBlue text-white hidden lg:flex flex-1 flex-col justify-between relative overflow-hidden lg:max-w-[35%]">
        <div className="relative z-10 mt-5 p-8 lg:p-12">
          <h1 className="text-3xl font-semibold mb-6 leading-tight text-center md:text-left">
            Join or Log In to the Sapphire Ambassador Program
          </h1>
          <p className="text-lg text-center md:text-left text-blue-100 mb-8 max-w-md">
            Earn rewards by referring federal government workers to our loan services. Whether you&apos;re just getting
            started or returning to track your referrals—sign in or create your account below.
          </p>
          <div className="flex justify-center md:hidden">
            <Button className="bg-primaryBlue border rounded-full  text-sm text-white" size="lg" onPress={handleScroll}>Get Started
              <ArrowDown className="w-4 h-4 animate-bounce-down" />
            </Button>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative mt-8 lg:mt-0">
          <div className=" w-full lg:mx-0">
            <Image
              src={signupIllus}
              alt="Diverse group of people illustration"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div ref={nextSectionRef} className="bg-white p-8 lg:p-14 flex-1 lg:overflow-y-auto lg:h-screen flex flex-col lg:max-w-none mx-auto lg:mx-0 w-full">

        <div className="w-full max-w-md mx-auto pt-10 pb-10">
          {/* Logo */}
          <div className="mb-8 flex justify-center items-center text-center lg:text-right">
            <Image src={brandLogo} alt="Sapphire Credit Logo" width={150} height={100} />
          </div>

          {/* Form Header */}
          <div className="mb-8">
            {currentStep > 1 && (
              <span>
                <Image onClick={prevStep} className="cursor-pointer w-8" src={backArrow} alt="backArrow" />
              </span>
            )}
            <h2 className="text-2xl lg:text-3xl font-semibold text-primaryBlue my-2">Create an account</h2>
            <p className="text-lightBrown font-normal text-sm ">Complete the sign up process to get started</p>

            {/* Progress Steps */}
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-1 rounded flex-1 ${step <= currentStep ? "bg-blue-600" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <Button
                isLoading={loading}
                spinner
                type="button"
                onPress={handleSubmit}
                className="flex-1 h-12 bg-primaryBlue hover:bg-blue-700 text-white font-semibold text-sm rounded-lg [&>svg]:text-white"
              >
                {currentStep === 3 ? "Create Account" : "Continue"}
              </Button>
            </div>


            <div className="text-center">
              <p className="text-darkCharcoal">
                Already have an account?{" "}
                <Button onPress={() => router.push("/sign-in")} variant="ghost" className="text-primaryBlue hover:text-blue-700 font-semibold">
                  Login
                </Button>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
