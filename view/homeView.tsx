import { FormField, OtpField } from "@/components/reususables";
import React from "react";

const HomeView = () => {
	return (
		<div>
			<FormField
				label="Name"
				htmlFor="name"
				type="text"
				id="name"
				placeholder="Enter your name"
				size="lg"
			/>
			<OtpField
				label="OTP"
				htmlFor="otp"
				id="otp"
				placeholder="Enter your OTP"
				size="lg"
			/>
		</div>
	);
};

export default HomeView;
