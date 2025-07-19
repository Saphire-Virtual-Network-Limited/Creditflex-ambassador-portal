"use client"

import Image from "next/image"
import { Button } from "@heroui/react";
import signupIllus from "@/public/assets/svgs/signupIllus.svg"
import brandLogo from "@/public/assets/images/brand-logo.png"
import { FormField } from "@/components/reususables";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { createSchema } from "@/lib/zodValidator";
import { useField } from "@/lib/formState";
import { ArrowDown } from "lucide-react";




const EmailSchema = createSchema((value) => {
    // More comprehensive email regex that checks for valid format and common TLDs
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Trim whitespace and validate
    const trimmedEmail = value.trim();

    // Check length constraints (RFC 5321)
    if (trimmedEmail.length < 3 || trimmedEmail.length > 254) {
        return false;
    }

    // Check for valid email format
    if (!emailRegex.test(trimmedEmail)) {
        return false;
    }

    // Additional checks for common issues
    if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
        return false;
    }

    if (trimmedEmail.includes('..')) {
        return false;
    }

    // Validate local part and domain lengths
    const [localPart, domain] = trimmedEmail.split('@');
    if (localPart.length > 64 || domain.length > 255) {
        return false;
    }

    return true;
}, "Please enter a valid email address");

const PhoneSchema = createSchema((value) => {
    // Must be exactly 11 digits and start with valid Nigerian prefixes
    const phoneRegex = /^(071|070|080|081|090|091)\d{8}$/;
    return phoneRegex.test(value);
}, "Please enter a valid Nigerian 11 digit phone number");

const passwordSchema = createSchema((value) => value.length >= 8 && value.length <= 100, "Password must be between 8-100 characters");








export default function SigninView() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const nextSectionRef = useRef<HTMLDivElement>(null);


    const { value: email, error: emailError, handleChange: handleEmailChange } = useField("", EmailSchema);

    const { value: password, error: passwordError, handleChange: handlePasswordChange } = useField("", passwordSchema);


    // SCROLL TO NEXT SECTION FOR MOBILE
    const handleScroll = () => {
        nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };






    const handleSubmit = async () => {
        setLoading(true);

        try {
            router.push("/admin-dashboard");
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
                    <h1 className="text-3xl text-3xl font-semibold mb-6 leading-tight text-center md:text-left">
                        Join or Log In to the Sapphire Ambassador Program
                    </h1>
                    <p className="text-lg text-center md:text-left text-blue-100 mb-8 max-w-md">
                        Earn rewards by referring federal government workers to our loan services. Whether you're just getting
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
