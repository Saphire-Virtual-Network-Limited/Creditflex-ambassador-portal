
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
