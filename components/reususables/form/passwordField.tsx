"use client";
import React, { useState, ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@heroui/react";
import Link from "next/link";

interface PasswordInputProps {
	PasswordText: string;
	placheolderText: string;
	passwordError: string | null;
	handlePasswordChange: (value: string) => void;
	showForgotPassword?: boolean;
	forgotPasswordLink?: string;
}

const PasswordField: React.FC<PasswordInputProps> = ({ passwordError, handlePasswordChange, PasswordText, placheolderText, showForgotPassword = false, forgotPasswordLink }) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	return (
		<div className="flex flex-col space-y-1.5">
			<div className="flex items-center">
				<Label
					htmlFor={PasswordText}
					className="text-black mb-1">
					{PasswordText} <sup className="text-danger">*</sup>
				</Label>

				{/* Conditionally render the forgot password link */}
				{showForgotPassword && (
					<Link
						href={forgotPasswordLink || "/auth/forgot-password"}
						className="ml-auto inline-block text-sm text-muted-foreground underline">
						Forgot password?
					</Link>
				)}
			</div>
			<Input
				placeholder={placheolderText}
				variant="bordered"
				classNames={{
					inputWrapper: ["data-[hover=true]:border-primary group-data-[focus=true]:border-primary border border-lightGray font-light text-sm rounded-lg"],
					input: ["placeholder:text-[#33333380] disabled:cursor-not-allowed placeholder:text-sm font-light"]
				}}
				isInvalid={!!passwordError}
				aria-label={PasswordText}
				errorMessage={passwordError || ""}
				onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
				size="lg"
				endContent={
					<button
						className="focus:outline-none"
						type="button"
						onClick={toggleVisibility}>
						{isVisible ? <EyeOff className="text-sm w-5 h-5 text-default-400 pointer-events-none" /> : <Eye className="text-sm w-5 h-5 text-default-400 pointer-events-none" />}
					</button>
				}
				type={isVisible ? "text" : "password"}
				className="w-full py-2 hover:bg-transparent focus:outline-none bg-transparent"
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault(); // Prevent the default Enter key behavior
					}
				}}
			/>
			{passwordError && <div className="text-red-500 text-xs">{passwordError}</div>}
		</div>
	);
};

export default PasswordField;
