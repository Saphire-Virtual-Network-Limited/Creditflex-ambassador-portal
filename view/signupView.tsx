"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/reususables/form/formField"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/svgs/brand-logo.svg"
import { FormField, SelectField } from "@/components/reususables";
import backArrow from "@/public/assets/svgs/back-arrow.svg"

export default function SignupView() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBank, setSelectedBank] = useState("");

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

  // const getStepTitle = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return "Create an account"
  //     case 2:
  //       return "Personal Information"
  //     case 3:
  //       return "Final Details"
  //     default:
  //       return "Create an account"
  //   }
  // }

  // const getStepDescription = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return "Complete the sign up process to get started"
  //     case 2:
  //       return "Please provide your personal details"
  //     case 3:
  //       return "Review and complete your registration"
  //     default:
  //       return "Complete the sign up process to get started"
  //   }
  // }



  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <FormField
          label="Phone Number/Email Address"
          htmlFor="contact"
          type="text"
          id="contact"
          placeholder="Enter your Phone Number/Email Address"
          required
          size="lg"
          reqValue="*"
        />

      </div>

      <div>
        <FormField
          label="Password"
          htmlFor="password"
          type="password"
          id="password"
          placeholder="Enter Password"
          required
          size="lg"
          reqValue="*"
        />
      </div>

      <div>
        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          required
          size="lg"
          reqValue="*"
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
        />
      </div>
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
          label="Account Name"
          htmlFor="accountName"
          type="text"
          id="accountName"
          placeholder="Enter your Account Name"
          required
          size="lg"
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
        />
      </div>
      <div>
        <SelectField
          label="Institution/Company"
          htmlFor="institution"
          id="institution"
          isInvalid={false}
          errorMessage=""
          placeholder="institution/company"
          options={[]}
          onChange={() => { }}
          selectionMode="single"
        />
      </div>
      <div>
        <FormField
          label="IPPIS Number"
          htmlFor="address"
          type="text"
          id="address"
          placeholder="Enter your home address"
          required
          size="lg"
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


  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Left Section - Hero Content */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white flex-1 flex flex-col justify-between relative overflow-hidden lg:max-w-[35%]">
        <div className="relative z-10 mt-5 p-8 lg:p-12">
          <h1 className="text-3xl text-3xl font-semibold mb-6 leading-tight">
            Join or Log In to the Sapphire Ambassador Program
          </h1>
          <p className="text-lg  text-blue-100 mb-8 max-w-md">
            Earn rewards by referring federal government workers to our loan services. Whether you're just getting
            started or returning to track your referrals—sign in or create your account below.
          </p>
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
      <div className="bg-white p-8  flex-1 flex flex-col justify-center max-w-[65%] lg:max-w-none mx-auto lg:mx-0 w-full">
        <div className="w-full max-w-md mx-auto mt-10">
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
                type="button"
                onClick={currentStep === 3 ? () => alert("Form submitted!") : nextStep}
                className="flex-1 h-12 bg-primaryBlue hover:bg-blue-700 text-white font-medium text-lg"
              >
                {currentStep === 3 ? "Complete Registration" : "Continue"}
              </Button>
            </div>


            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="#" className="text-primaryBlue hover:text-blue-700 font-semibold">
                  Login
                </a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
