"use client";
import React from "react";
import { cn, GeneralSans_Meduim } from "@/lib";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
	label: string;
	htmlFor: string;
	type: string;
	id: string;
	variant?: string;
	isInvalid?: boolean;
	errorMessage?: string;
	size: string;
	startcnt?: string | React.ReactElement;
	placeholder?: string;
	reqValue?: string;
	onChange?: (value: string) => void;
	required?: boolean;
	minLen?: number;
	maxLen?: number;
	value?: string;
	disabled?: boolean;
	min?: string;
	max?: string;
}

const DateFormField: React.FC<FormFieldProps> = ({ label, htmlFor, isInvalid, errorMessage, placeholder, onChange, reqValue, required, value, disabled, min, max }) => {
	const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		console.log("DateFormField handleDateChange called with:", newValue);
		console.log("onChange function exists:", !!onChange);
		
		if (onChange) {
			onChange(newValue);
		} else {
			console.error("onChange function is not provided!");
		}
	};

	console.log("DateFormField render - value:", value);
	console.log("DateFormField render - min:", min);
	console.log("DateFormField render - max:", max);

	return (
		<div className="flex flex-col space-y-1.5">
			<Label
				htmlFor={htmlFor}
				className={cn("mb-2 text-base font-medium text-lightBrown", GeneralSans_Meduim.className)}>
				{label} <sup className="text-danger">{reqValue}</sup>
			</Label>
			<input
				type="date"
				id={htmlFor}
				value={value || ""}
				onChange={handleDateChange}
				min={min}
				max={max}
				disabled={disabled}
				required={required}
				className={cn(
					"flex h-12 w-full rounded-lg border border-lightGray bg-white px-3 py-2 text-sm",
					"placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
					"focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					"data-[hover=true]:border-primary group-data-[focus=true]:border-primary",
					isInvalid && "border-red-500 focus-visible:ring-red-500"
				)}
				placeholder={placeholder}
			/>
			{isInvalid && <div className="text-red-500 text-xs">{errorMessage}</div>}
		</div>
	);
};

export default DateFormField;
