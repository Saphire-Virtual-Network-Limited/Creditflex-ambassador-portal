const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const appKey = process.env.NEXT_PUBLIC_APP_KEY || process.env.APP_KEY;

import { TokenManager } from './tokenManager';

export interface ApiCallOptions {
  cache?: RequestCache;
  revalidate?: number;
}

// Helper function to handle API responses and extract tokens
export function handleAuthResponse(response: any) {
  if (response?.statusCode === 200 && response?.data) {
    // Store the access token from the response
    if (response?.data?.accessToken) {
      TokenManager.setAccessToken(response.data.accessToken);
    }
    if (response?.data?.refreshToken) {
      TokenManager.setRefreshToken(response.data.refreshToken);
    }
    if (response?.data?.user) {
      TokenManager.setUserData(response.data.user);
    }
    return true;
  }
  return false;
}

async function apiCall(
  endpoint: string,
  method: string,
  body?: any,
  requestKey?: string,
  token?: string,
  options?: ApiCallOptions,
  isRetry: boolean = false
) {
  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    };

    if (requestKey) headers["requestApiKey"] = requestKey;
    if (appKey) headers["x-app-key"] = appKey;
    
    // Use provided token or get from TokenManager
    const authToken = token || TokenManager.getAccessToken();
    if (authToken) headers.Authorization = `Bearer ${authToken}`;

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
      // Handle token expiration
      if (response.status === 401 && !isRetry && authToken) {
        try {
          // Try to refresh the token
          const refreshResponse = await refreshToken();
          if (refreshResponse?.statusCode === 200 && refreshResponse?.data?.accessToken) {
            // Retry the original request with the new token
            return apiCall(endpoint, method, body, requestKey, refreshResponse.data.accessToken, options, true);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // Clear auth data if refresh fails
          TokenManager.clearAuth();
        }
      }

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
  
  // Step 2: Add Account Info - Now requires authentication
  interface StepTwoPayload {
    accountNumber: string;
    bankName: string;
    bvn: string;
  }
  
  export function signupStepTwo(data: StepTwoPayload) {
    // This call will automatically include the access token from TokenManager
    return apiCall("/ambassador/signup/account", "PATCH", data);
  }
  
  // Step 3: Complete Signup - Now requires authentication
  interface StepThreePayload {
    address: string;
    ippis: string;
    institution: string;
  }
  
  export function signupStepThree(data: StepThreePayload) {
    // This call will automatically include the access token from TokenManager
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

// Refresh token
export function refreshToken() {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  return apiCall("/ambassador/refresh", "POST", { refreshToken });
}

// Logout function
export function logout() {
  TokenManager.clearAuth();
}

// Check user signup status
export function checkSignupStatus() {
  return apiCall("/ambassador/signup/status", "GET");
}

// Get banks list
export function getBanks() {
  return apiCall("/ambassador/banks", "GET");
}

// Get bank details
export function getBankDetails(accountNumber: string, bankCode: string) {
  return apiCall("/ambassador/bank-details", "POST", {
    accountNumber,
    bankCode
  });
}
  