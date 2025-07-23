"use client"

import Image from "next/image"
import { useRef, useState, Suspense } from "react"
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/images/brand-logo.png"
import { FormField, PasswordField, SelectField, AutoCompleteField } from "@/components/reususables";
import backArrow from "@/public/assets/svgs/back-arrow.svg"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { ArrowDown } from "lucide-react"
import { signupStepOne, signupStepTwo, signupStepThree, getBanks, getBankDetails, handleAuthResponse } from "@/lib/api";
import { signupStep1Schema, signupStep2Schema, signupStep3Schema, validateForm } from "@/lib/validations";
import { toast } from "sonner";
import React from "react";
import { TokenManager } from "@/lib/tokenManager";

function SignupViewContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false);
  const [checkingProgress, setCheckingProgress] = useState(true);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track if ref_code is present and its value
  const refCodeFromUrl = searchParams?.get("ref_code") || "";
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

  // Check for existing signup progress
  React.useEffect(() => {
    const checkExistingProgress = async () => {
      try {
        // Check if there's a step parameter in URL (from signin redirect)
        const stepFromUrl = searchParams?.get("step");
        if (stepFromUrl) {
          const step = parseInt(stepFromUrl);
          if (step >= 1 && step <= 3) {
            setCurrentStep(step);
            toast.info(`Welcome back! Continuing from step ${step}`);
            setCheckingProgress(false);
            return;
          }
        }

        // Check if user has tokens (indicating they've started signup)
        const hasTokens = TokenManager.isAuthenticated();

        if (hasTokens) {
          // User has tokens, likely completed step 1, go to step 2
          setCurrentStep(2);
          toast.info("Welcome back! Continuing from step 2");
        }
      } catch (error) {
        console.error("Error checking signup progress:", error);
        // If there's an error, just continue with step 1
        toast.error("Unable to restore your progress. Starting from step 1.");
      } finally {
        setCheckingProgress(false);
      }
    };

    checkExistingProgress();
  }, [router, searchParams]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Banks state
  const [banks, setBanks] = useState<{ label: string; value: string }[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [accountNameEnabled, setAccountNameEnabled] = useState(false);
  const [loadingBankDetails, setLoadingBankDetails] = useState(false);

  // Fetch banks on component mount
  React.useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoadingBanks(true);
        const response = await getBanks();
        console.log(response)
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

    // For phone number, only allow digits
    if (field === "phoneNumber") {
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
      console.log("Bank details response:", response);
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

  // SCROLL TO NEXT SECTION FOR MOBILE
  const handleScroll = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        <AutoCompleteField
          label="Bank Name"
          htmlFor="bankName"
          id="bankName"
          isInvalid={!!errors.bankCode}
          errorMessage={errors.bankCode || ""}
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
          isInvalid={!!errors.accountName}
          errorMessage={errors.accountName}
        />
        {loadingBankDetails && (
          <div className="text-xs text-blue-600 mt-1">
            Fetching account details...
          </div>
        )}
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
          placeholder="Institution/Company (optional)"
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
          placeholder="Enter your IPPIS number (optional)"
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
          placeholder="Choose assigned Telesales Agent (optional)"
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

        if (response?.statusCode === 200 && response?.data) {
          // Use the handleAuthResponse function to store tokens and status
          handleAuthResponse(response);

          toast.success("Step 1 complete! Proceed to the next step.");
          nextStep();
        } else {
          console.error("Step 1 failed:", response);
          toast.error(response?.message || "Step 1 failed. Please try again.");
        }
      } else if (currentStep === 2) {
        // Check if we have an access token
        if (!TokenManager.getAccessToken()) {
          toast.error("Authentication required. Please start from step 1.");
          setCurrentStep(1);
          setLoading(false);
          return;
        }

        // Validate Step 2
        const validationResult = validateForm(signupStep2Schema, {
          accountNumber: formData.accountNumber,
          bankCode: formData.bankName,
          accountName: formData.accountName,
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
          bankCode: formData.bankName, // Bank code as string
          accountName: formData.accountName, // Auto-populated from bank details API
          bvn: formData.bvn,
        };

        const response = await signupStepTwo(stepTwoPayload);

        if (response?.statusCode === 200 && response?.data) {
          // Use the handleAuthResponse function to store tokens and status
          handleAuthResponse(response);

          toast.success("Step 2 complete! Proceed to the next step.");
          nextStep();
        } else {
          console.error("Step 2 failed:", response);
          toast.error(response?.message || "Step 2 failed. Please try again.");
        }
      } else if (currentStep === 3) {
        // Check if we have an access token
        if (!TokenManager.getAccessToken()) {
          toast.error("Authentication required. Please start from step 1.");
          setCurrentStep(1);
          setLoading(false);
          return;
        }

        // Validate Step 3
        const validationResult = validateForm(signupStep3Schema, {
          address: formData.address,
          ippis: formData.ippis || undefined,
          institution: formData.institution || undefined,
          telesalesAgent: formData.telesalesAgent || undefined,
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
          ...(formData.ippis && { ippis: formData.ippis }),
          ...(formData.institution && { institution: formData.institution }),
          ...(formData.telesalesAgent && { telesalesAgent: formData.telesalesAgent }),
        };

        const response = await signupStepThree(stepThreePayload);

        if (response?.statusCode === 200 && response?.data) {
          // Use the handleAuthResponse function to store tokens and status
          handleAuthResponse(response);

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
      {/* Show loading while checking progress */}
      {checkingProgress && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mx-auto mb-4"></div>
            <p className="text-primaryBlue">Checking your progress...</p>
          </div>
        </div>
      )}

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
                <Button onPress={() => router.push("/sign-in")} variant="ghost" className="text-primaryBlue text-sm hover:text-blue-700 p-0 font-semibold">
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

export default function SignupView() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupViewContent />
    </Suspense>
  );
}
