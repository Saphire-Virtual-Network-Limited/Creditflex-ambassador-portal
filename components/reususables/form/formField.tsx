"use client";
import React, { ChangeEvent, ReactElement, useState } from "react";
import { cn, GeneralSans_Meduim } from "@/lib";
import { Label } from "@/components/ui/label";
import { Input } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

interface FormFieldProps {
	label: string;
	htmlFor: string;
	type: string;
	id: string;
	variant?: string;
	isInvalid?: boolean;
	errorMessage?: string;
	size: string;
	startcnt?: string | ReactElement;
	placeholder: string;
	reqValue?: string;
	onChange?: (value: string) => void;
	required?: boolean;
	minLen?: number;
	maxLen?: number;
	value?: any;
	disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, type, id, isInvalid, errorMessage, placeholder, startcnt, onChange, reqValue, required, minLen, maxLen, value, disabled }) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPassword = type === "password";

	return (
		<div className="flex flex-col space-y-1.5">
			<Label
				htmlFor={htmlFor}
				className={cn("mb-2 text-base font-medium text-lightBrown", GeneralSans_Meduim.className)}>
				{label} <sup className="text-danger">{reqValue}</sup>
			</Label>
			<div className="relative">
				<Input
					type={isPassword && showPassword ? "text" : type}
					id={id}
					variant="bordered"
					classNames={{
						inputWrapper: ["data-[hover=true]:border-primary group-data-[focus=true]:border-primary border border-lightGray font-light text-sm rounded-lg"],
						input: ["placeholder:text-[#33333380] placeholder:text-sm font-light"]
					}}
					aria-label={label}
					size="lg"
					radius="md"
					// required={required}
					placeholder={placeholder}
					startContent={startcnt}
					onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
					minLength={minLen}
					maxLength={maxLen}
					disabled={disabled}
					value={value}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
						}
					}}
				/>
				{isPassword && (
					<span
						className="absolute right-3 top-1/2   -translate-y-1/2 cursor-pointer text-gray-500"
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
					</span>
				)}
			</div>
			{/* <Input
				type={isPassword && showPassword ? "text" : type}
				id={id}
				variant="bordered"
				classNames={{
					inputWrapper: ["data-[hover=true]:border-primary group-data-[focus=true]:border-lightGray border border-lightGray font-light rounded-lg"],
					input: ["placeholder:text-[#33333380] placeholder:text-sm font-light rounded-lg"]
				}}
				aria-label={label}
				size="lg"
				radius="md"
				required={required}
				placeholder={placeholder}
				startContent={startcnt}
				onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
				minLength={minLen}
				maxLength={maxLen}
				disabled={disabled}
				value={value}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault(); // Prevent the default Enter key behavior
					}
				}}
			/> */}
			{isInvalid && <div className="text-red-500 text-xs">{errorMessage}</div>}
		</div>
	);
};

export default FormField;
