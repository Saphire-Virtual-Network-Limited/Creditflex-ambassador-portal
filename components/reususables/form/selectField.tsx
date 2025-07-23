"use client";
import React, { useState } from "react";
import { cn, GeneralSans_Meduim } from "@/lib";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, Selection } from "@heroui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SelectFieldProps {
	label?: string;
	htmlFor: string;
	id: string;
	isInvalid: boolean;
	errorMessage: string;
	placeholder: string;
	reqValue?: string;
	onChange: (value: string | string[]) => void;
	required?: boolean;
	selectionMode?: "single" | "multiple";
	options: { label: string; value: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, htmlFor, id, isInvalid, errorMessage, placeholder, reqValue, onChange, required, options, selectionMode = "single" }) => {
	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (keys: Selection) => {
		const value = selectionMode === "multiple" ? Array.from(keys as Set<string>) : Array.from(keys as Set<string>)[0] || "";
		onChange(value);
	};


	return (
		<div className="flex flex-col space-y-1.5">
			<Label
				htmlFor={htmlFor}
				className={cn("mb-2 text-base font-medium text-lightBrown", GeneralSans_Meduim.className)}>
				{label} <sup className="text-danger">{reqValue}</sup>
			</Label>
			<div className="relative">
				<Select
					selectionMode={selectionMode}
					id={id}
					aria-label={label}
					aria-invalid={isInvalid ? "true" : "false"}
					aria-describedby={isInvalid ? `${id}-error` : undefined}
					required={required}
					placeholder={placeholder}
					onSelectionChange={handleChange}
					onOpenChange={(open) => setIsOpen(open)} // track open/close
					radius="lg"
					size="lg"
					variant="bordered"
					selectorIcon={<span className="hidden" />}
					popoverProps={{ className: "bg-white shadow-lg z-50" }}
					listboxProps={{ className: "bg-white" }}
					classNames={{
						base: "border border-lightGray rounded-lg",
						trigger: ["flex items-center justify-between w-full pr-10 data-[focus=true]:border-lightGray active:border-primary"],
						innerWrapper: "truncate whitespace-inherit text-[#33333380] text-sm font-light text-left",
						value: "truncate whitespace-inherit text-sm text-left text-black",
					}}
				>
					{options.map((option) => (
						<SelectItem className="text-sm" key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</Select>

				{/* Chevron icon */}
				<div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
					{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
				</div>
			</div>
			{/* <Select
				selectionMode={selectionMode}
				id={id}
				aria-label={label}
				aria-invalid={isInvalid ? "true" : "false"}
				aria-describedby={isInvalid ? `${id}-error` : undefined}
				required={required}
				placeholder={placeholder}
				onSelectionChange={handleChange}
				radius="lg"
				size="lg"
				variant="bordered"
				classNames={{
					base: "border-lightGray border",
					trigger: ["data-[focus=true]:border-lightGray", "active:border-primary"],
					value: "truncate whitespace-inherit",
					innerWrapper: "truncate whitespace-inherit placeholder:text-[#33333380] placeholder:text-sm font-light ",
					
				}}>
				{options.map((option) => (
					<SelectItem
						key={option.value}
						value={option.value}
						className="bg-[red]">
						{option.label}
					</SelectItem>
				))}
			</Select> */}
			{isInvalid && <div className="text-red-500 text-xs">{errorMessage}</div>}
		</div>
	);
};

export default SelectField;
