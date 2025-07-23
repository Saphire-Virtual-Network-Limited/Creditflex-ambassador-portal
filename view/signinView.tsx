"use client"

import Image from "next/image"
import { Button } from "@heroui/react";
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/images/brand-logo.png"
import { FormField, PasswordField } from "@/components/reususables";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { login } from "@/lib/api";
import { loginSchema, validateForm } from "@/lib/validations";
import { toast } from "sonner";
import { TokenManager } from "@/lib/tokenManager";
import { handleAuthResponse } from "@/lib/api";


export default function SigninView() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const nextSectionRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Helper function to detect if input is email or phone
    const detectInputType = (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+234|0)?[789][01]\d{8}$/;
        
        if (emailRegex.test(input)) {
            return 'email';
        } else if (phoneRegex.test(input.replace(/\D/g, ''))) {
            return 'phone';
        }
        return 'invalid';
    };

    const handleChange = (field: string, value: string) => {
        // For email field (which can be phone or email), allow both
        if (field === "email") {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };


    // SCROLL TO NEXT SECTION FOR MOBILE
    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    const handleSubmit = async () => {
        setLoading(true);
        setErrors({});

        try {
            // Determine if the input is email or phone
            const inputType = detectInputType(formData.email);
            
            if (inputType === 'invalid') {
                setErrors({ email: "Please enter a valid email address or phone number" });
                setLoading(false);
                toast.error("Please enter a valid email address or phone number.");
                return;
            }
            
            // Prepare the data object based on input type
            const loginData: any = {
                password: formData.password,
            };
            
            if (inputType === 'email') {
                loginData.email = formData.email;
            } else if (inputType === 'phone') {
                loginData.phone = formData.email.replace(/\D/g, ''); // Remove non-digits for phone
            }

            // Validate form
            const validationResult = validateForm(loginSchema, loginData);

            if (!validationResult.success) {
                setErrors(validationResult.errors || {});
                setLoading(false);
                toast.error("Please fix the errors in the form.");
                return;
            }

            const response = await login(loginData);
            
            if (response?.statusCode === 200 && response?.data) {
                // Use the handleAuthResponse function to store tokens and user data
                handleAuthResponse(response);
                
                // Redirect to dashboard after successful login
                toast.success("Login successful! Redirecting to dashboard...");
                router.push("/admin-dashboard");
            } else {
                // Handle error - show message to user
                console.error("Login failed:", response);
                toast.error(response?.message || "Login failed. Please try again.");
            }
        }
        catch (error) {
            console.error("Submission error:", error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full lg:overflow-hidden">
            {/* Left Section - Hero Content */}
            <div className="bg-primaryBlue text-white hidden lg:flex  flex-1 flex-col justify-between relative overflow-hidden lg:max-w-[35%]">
                <div className="relative z-10 mt-5 p-8 lg:p-12">
                    <h1 className="text-3xl font-semibold mb-6 leading-tight text-center md:text-left">
                        Join or Log In to the Sapphire Ambassador Program
                    </h1>
                    <p className="text-lg text-center md:text-left text-blue-100 mb-8 max-w-md">
                        Earn rewards by referring federal government workers to our loan services. Whether you&apos;re just getting
                        started or returning to track your referrals—sign in or create your account below.
                    </p>
                    <div className="flex justify-center md:hidden">
                        <Button className="bg-primaryBlue border rounded-full flex justify-center items-center gap-2  text-base text-white" size="lg" onPress={handleScroll}>
                            Sign In
                            <ArrowDown className="w-4 h-4" />
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
                    <div className="mb-14 flex justify-center items-center text-center lg:text-right">
                        <Image src={brandLogo} alt="Sapphire Credit Logo" width={150} height={100} />
                    </div>

                    {/* Form Header */}
                    <div className="mb-8">

                        <h2 className="text-2xl lg:text-3xl font-semibold text-primaryBlue my-2">Welcome Back</h2>
                        <p className="text-lightBrown font-normal text-sm ">Kindly login to your account with your details</p>


                    </div>

                    {/* Form */}
                    <form className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <FormField
                                    label="Email Address or Phone Number"
                                    htmlFor="contact"
                                    type="text"
                                    id="contact"
                                    placeholder="Enter your email address or phone number"
                                    required
                                    size="lg"
                                    reqValue="*"
                                    value={formData.email}
                                    onChange={(value: string) => handleChange("email", value)}
                                    isInvalid={!!errors.email}
                                    errorMessage={errors.email}
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
                        </div>


                        <div className="flex gap-4">

                            <Button
                                isLoading={loading}
                                spinner
                                onPress={handleSubmit}
                                className="flex-1 h-12 bg-primaryBlue hover:bg-blue-700 text-white font-semibold text-sm rounded-lg [&>svg]:text-white"
                            >
                                {loading ? "Logging In..." : "Continue"}
                            </Button>
                        </div>



                        <div className="text-center ">
                            <p className="text-darkCharcoal">
                                Don’t have an account?{" "}
                                <Button onPress={() => router.push("/sign-up")} variant="ghost" className="text-primaryBlue text-sm hover:text-blue-700 p-0 font-semibold">
                                    Sign Up
                                </Button>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
