const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appKey = process.env.NEXT_PUBLIC_APP_KEY || process.env.APP_KEY;


export interface ApiCallOptions {
  cache?: RequestCache;
  revalidate?: number;
}

async function apiCall(
  endpoint: string,
  method: string,
  body?: any,
  requestKey?: string,
  token?: string,
  options?: ApiCallOptions
) {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    };

    if (requestKey) headers["requestApiKey"] = requestKey;
    if (appKey) headers["x-app-key"] = appKey;
    if (token) headers.Authorization = `Bearer ${token}`;

    const fetchOptions: RequestInit = { method, headers };

    if (method !== "GET" && method !== "HEAD" && body) {
      if (body instanceof FormData) {
        delete headers["Content-Type"];
        fetchOptions.body = body;
      } else {
        headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(body);
      }
    }

    if (method === "GET") {
      if (options?.cache) fetchOptions.cache = options.cache;
      if (options?.revalidate !== undefined) fetchOptions.next = { revalidate: options.revalidate };
    }

    const response = await fetch(`${apiUrl}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Request failed";
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData?.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.log(`Error in ${method} ${endpoint}:`, error?.message || "Something went wrong");
    return error;
  }
}


// Step 1: Initiate Signup
interface StepOnePayload {
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    referredBy?: string;
  }
  
  export function signupStepOne(data: StepOnePayload) {
    return apiCall("/ambassador/signup/initiate", "POST", data);
  }
  
  // Step 2: Add Account Info
  interface StepTwoPayload {
    accountNumber: string;
    bankName: string;
    bvn: string;
  }
  
  export function signupStepTwo(data: StepTwoPayload) {
    return apiCall("/ambassador/signup/account", "PATCH", data);
  }
  
  // Step 3: Complete Signup
  interface StepThreePayload {
    address: string;
    ippis: string;
    institution: string;
  }
  
  export function signupStepThree(data: StepThreePayload) {
    return apiCall("/ambassador/signup/complete", "PATCH", data);
  }
  
// Login
interface LoginPayload {
  email: string;
  password: string;
}

export function login(data: LoginPayload) {
  return apiCall("/ambassador/login", "POST", data);
}
  