"use client"

import Image from "next/image"
import { Button } from "@heroui/react";
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/images/brand-logo.png"
import { FormField } from "@/components/reususables";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { login } from "@/lib/api";
import { loginSchema, validateForm } from "@/lib/validations";


export default function SigninView() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const nextSectionRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

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
            // Validate form
            const validationResult = validateForm(loginSchema, {
                email: formData.email,
                password: formData.password,
            });

            if (!validationResult.success) {
                setErrors(validationResult.errors || {});
                setLoading(false);
                return;
            }

            const response = await login({
                email: formData.email,
                password: formData.password,
            });
            if (response?.success || response?.data) {
                router.push("/admin-dashboard");
            } else {
                // Handle error - show message to user
                console.error("Login failed:", response);
            }
        }
        catch (error) {
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
                                    label="Phone Number/Email Address"
                                    htmlFor="contact"
                                    type="text"
                                    id="contact"
                                    placeholder="Enter your Email or Phone Number"
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
                                <FormField
                                    label="Password"
                                    htmlFor="password"
                                    type="password"
                                    id="password"
                                    placeholder="Enter Password"
                                    required
                                    size="lg"
                                    reqValue="*"
                                    value={formData.password}
                                    onChange={(value: string) => handleChange("password", value)}
                                    isInvalid={!!errors.password}
                                    errorMessage={errors.password}
                                />
                            </div>
                        </div>


                        <div className="flex gap-4">

                            <Button
                                isLoading={loading}
                                onPress={handleSubmit}
                                className="flex-1 h-12 bg-primaryBlue hover:bg-blue-700 text-white font-semibold text-sm rounded-lg"
                            >
                                Continue
                            </Button>
                        </div>



                        <div className="text-center ">
                            <p className="text-darkCharcoal">
                                Don’t have an account?{" "}
                                <a href="/sign-up" className="text-primaryBlue hover:text-blue-700 font-semibold">
                                    Sign Up
                                </a>
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
