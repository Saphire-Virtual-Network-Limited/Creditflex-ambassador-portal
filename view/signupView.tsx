"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/images/brand-logo.png"
import { FormField, SelectField } from "@/components/reususables";
import backArrow from "@/public/assets/svgs/back-arrow.svg"
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowDown } from "lucide-react"




export default function SignupView() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBank, setSelectedBank] = useState("");
  const [loading, setLoading] = useState(false);
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

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
          reqValue="*"
        />
      </div>
      <div>
        <SelectField
          label="Institution/Company"
          htmlFor="institution"
          id="institution"
          isInvalid={false}
          errorMessage=""
          placeholder="Institution/Company"
          options={[]}
          onChange={() => { }}
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
          onChange={() => { }}
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

    try {
      if (currentStep === 3) {
        router.push("/admin-dashboard");
      } else {
        nextStep();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full lg:overflow-hidden">
      {/* Left Section - Hero Content */}
      <div className="bg-primaryBlue text-white flex-1 flex flex-col justify-between relative overflow-hidden lg:max-w-[35%]">
        <div className="relative z-10 mt-5 p-8 lg:p-12">
          <h1 className="text-3xl text-3xl font-semibold mb-6 leading-tight text-center md:text-left">
            Join or Log In to the Sapphire Ambassador Program
          </h1>
          <p className="text-lg text-center md:text-left text-blue-100 mb-8 max-w-md">
            Earn rewards by referring federal government workers to our loan services. Whether you're just getting
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
                className="flex-1 h-12 bg-primaryBlue hover:bg-blue-700 text-white font-semibold text-sm rounded-lg"
              >
                {currentStep === 3 ? "Create Account" : "Continue"}
              </Button>
            </div>


            <div className="text-center ">
              <p className="text-darkCharcoal">
                Already have an account?{" "}
                <a href="/sign-in" className="text-primaryBlue hover:text-blue-700 font-semibold">
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
