
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appKey = process.env.NEXT_PUBLIC_APP_KEY;

// //samsung knox api url
// const samsungKnoxApiUrl = process.env.NEXT_PUBLIC_SAMSUNG_KNOX_API_URL;

export interface ApiCallOptions {
	cache?: RequestCache;
	revalidate?: number;
}

async function apiCall(endpoint: string, method: string, body?: any, requestKey?: string, token?: string, options?: ApiCallOptions) {
	try {
		const headers: HeadersInit = {
			Accept: "*/*",
		};

		// Conditionally add requestApiKey if it exists
		if (requestKey) {
			headers["requestApiKey"] = requestKey;
		}

		// Conditionally add appkey if it exists
		if (appKey) {
			headers["x-app-key"] = appKey;
		}

		// Add Authorization header if token is provided
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		// Define fetch options
		const fetchOptions: RequestInit = {
			method,
			headers,
		};

		// Only add body if the method is not GET or HEAD
		if (method !== "GET" && method !== "HEAD" && body) {
			if (body instanceof FormData) {
				// Allow browser to set Content-Type when using FormData
				// headers["Content-Type"] = "multipart/form-data";

				delete headers["Content-Type"];
				fetchOptions.body = body;
			} else {
				headers["Content-Type"] = "application/json";
				fetchOptions.body = JSON.stringify(body);
			}
		}

		// Apply caching and revalidation strategies for GET requests
		if (method === "GET") {
			if (options?.cache) {
				fetchOptions.cache = options.cache;
			}
			if (options?.revalidate !== undefined) {
				fetchOptions.next = { revalidate: options.revalidate };
			}
		}

		const response = await fetch(`${apiUrl}${endpoint}`, fetchOptions);

		// Check if response is ok before trying to parse JSON
		if (!response.ok) {
			const errorText = await response.text();
			let errorMessage = "Request failed";
			try {
				const errorData = JSON.parse(errorText);
				errorMessage = errorData?.message || errorMessage;
			} catch (e) {
				// If JSON parsing fails, use the raw error text
				errorMessage = errorText || errorMessage;
				console.log(errorMessage);
			}
			throw new Error(errorMessage);
		}

		const data = await response.json();
		return data;
	} catch (error: any) {
		const errorMessage = error?.message || "Something went wrong";
		console.log(`Error in ${method} ${endpoint}:`, errorMessage);
		return error;
	}
}

// bvn check
interface bvnCheckDetails {
	bvn: string;
	dob: string;
	email: string;
	dobByPass?: boolean;
	mbeId?: string;
	redirectUrl?: string;
}

export async function bvnCheck(bvnCheckDetails: bvnCheckDetails) {
	return apiCall("/application/create-customer", "POST", bvnCheckDetails);
}

// get customer by id
export async function getCustomerById(id: string) {
	return apiCall(`/application/customer/${id}`, "GET");
}

interface dropOffDetails {
	customerId: string;
	screenName: string;
	screenTime: string;
	apiResponseTime: string;
}

export async function customerDropOffPoint(dropOffDetails: dropOffDetails) {
	return apiCall("/application/log-drop-off", "POST", dropOffDetails);
}

//get bank list
export async function getBankList() {
	return apiCall("/bank-statement/banks", "GET");
}

interface customerDetails {
	duration?: string;
	bankId: number;
	accountNo: string;
	phone: string;
	customerId?: string;
	nameMatchByPass?: boolean;
}

//Check Customer Eligibility
export async function checkCustomerEligibility(customerDetails: customerDetails) {
	return apiCall("/application/customer-eligibility", "POST", customerDetails);
}

interface monoCustomerDetails {
	connectedCustomerId: string;
	callbackUrl: string;
	loanId: string;
}

//get mono customer details
export async function getMonoCustomerDetails(monoCustomerDetails: monoCustomerDetails) {
	return apiCall("/application/account-eligibility", "POST", monoCustomerDetails);
}

// interface paystackCustomerDetails {
// 	connectedCustomerId: string;
// 	callbackUrl: string;
// 	loanId: string;
// }

// //get paystack customer details
// export async function getPaystackCustomerDetails(paystackCustomerDetails: paystackCustomerDetails) {
// 	return apiCall("/application/customer-eligibility", "POST", paystackCustomerDetails);
// }

interface paystackVerifyDetails {
	token: string;
	customerId: string;
	loanId: string;
	cardNameByPass?: boolean;
}

//verify paystack payment
export async function verifyPaystackPayment(paystackVerifyDetails: paystackVerifyDetails) {
	return apiCall("/application/verify-tokenization", "POST", paystackVerifyDetails);
}

// //get all devices
// export async function getAllDevices(mbeId?: string, brandManufacturer?: string) {
// 	return apiCall(`/resources/devices?mbeId=${mbeId}`, "GET");
// }

//get single device
export async function getSingleDevice(id: string) {
	return apiCall(`/resources/device/${id}`, "GET");
}

// getAllDevices.ts
export async function getAllDevices(mbeId?: string, brandManufacturer?: string) {
	const query = mbeId ? `?mbeId=${mbeId}` : "";
	return apiCall(`/resources/devices${query}`, "GET");
}

// getAllStores.ts
export async function getAllStores(mbeId?: string) {
	const query = mbeId ? `?mbeId=${mbeId}` : "";
	return apiCall(`/resources/stores${query}`, "GET");
}

interface loanDetails {
	loanId: string;
	customerId: string;
	deviceId: string;
	devicePrice: number;
	storeId: string;
	duration: number;
	loanAmount: number;
	interestAmount: number;
	payFrequency: string;
	insurancePackage: string;
	insurancePrice: number;
	mbsEligibleAmount: number;
	deviceAmount: number;
	downPayment: number;
	monthlyRepayment: number;
	mbeId: string;
	deviceName: string;
}

export async function submitLoanDetails(loanDetails: loanDetails) {
	return apiCall("/application/loan-data", "POST", loanDetails);
}

interface kycDetails {
	loanId: string;
	mainPhoneNumber: string;
	phone2: string;
	phone3: string;
	houseNumber: string;
	streetAddress: string;
	nearestBusStop: string;
	localGovernment: string;
	state: string;
	town: string;
	occupation: string;
	businessName: string;
	applicantBusinessAddress: string;
	applicantAddress: string;
	source: string;
}

//update customer kyc details
export async function updateCustomerKycDetails(kycDetails: kycDetails) {
	return apiCall("/application/kyc", "POST", kycDetails);
}

interface downPaymentDetails {
	loanId: string;
	downPayment: number;
	storeId: string;
	customerId: string;
	devicePrice: number;
}

//update down payment details
export async function downPayment(downPaymentDetails: downPaymentDetails) {
	return apiCall("/application/down-payment", "POST", downPaymentDetails);
}

interface customerMandateDetails {
	customerId: string;
	debit_type: string;
	mandate_type: string;
	amount: number;
	duration: number;
	repaymentFrequency: string;
	start_date: string;
}

//update customer kyc details
export async function createCustomerMandate(customerMandateDetails: customerMandateDetails) {
	return apiCall("/accounts/mandate", "POST", customerMandateDetails);
}

interface downPaymentDetails {
	loanId: string;
	downPayment: number;
	storeId: string;
	customerId: string;
	devicePrice: number;
}

//update customer kyc details
export async function comfirmDownPayment(downPaymentDetails: downPaymentDetails) {
	return apiCall("/application/verify-down-payment", "POST", downPaymentDetails);
}

//verify customer mandate
export async function verifyCustomerMandate(mandateId: string, loanId: string) {
	return apiCall(`/application/verify-mandate/${mandateId}/${loanId}`, "GET");
}

interface deviceErollmentDetails {
	deviceId: string;
	customerId: string;
	loanId: string;
	imei: string;
}

//device enrollment
export async function deviceErollment(deviceErollmentDetails: deviceErollmentDetails) {
	return apiCall(`/application/device-enrollment`, "POST", deviceErollmentDetails);
}

interface refereeDetails {
	customerId: string;
	phone: string;
}

//update referee details
export async function updateRefereeDetails(refereeDetails: refereeDetails) {
	return apiCall("/application/update-kyc", "PUT", refereeDetails);
}

interface imeiNumberDetails {
	imei: string;
}

//update imei number
export async function enrollDevice(imeiNumberDetails: imeiNumberDetails) {
	return apiCall("/device-enrollment/qr", "POST", imeiNumberDetails);
}

interface confirmEnrollDeviceDetails {
	imei: string;
}

//update imei number
export async function confirmEnrollDevice(confirmEnrollDeviceDetails: confirmEnrollDeviceDetails) {
	return apiCall("/device-enrollment/confirm", "POST", confirmEnrollDeviceDetails);
}

//get enrollment status

interface comfirmEnrollmentStatus {
	loanId: string;
	customerId: string;
	deviceId: string;
	imei: string;
}

export async function confirmStatus(confirmEnrollmentStatus: comfirmEnrollmentStatus) {
	return apiCall("/application/device-status", "POST", confirmEnrollmentStatus);
}
