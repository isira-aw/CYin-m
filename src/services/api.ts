import {
  LoginRequest,
  SignUpRequest,
  LoginResponse,
  EventRequest,
  WorkRequest,
} from "../types/auth";

// const API_BASE_URL = "https://cyin-production.up.railway.app";
const API_BASE_URL = "http://localhost:8080";

class ApiService {
  // Helper method to get authentication headers
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Helper method to make API requests
  private async makeRequest(url: string, options: RequestInit) {
    try {
      const response = await fetch(url, {
        ...options,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options.headers,
        },
      });

      return response;
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Network error occurred");
    }
  }

  // Sign-up method
  async signUp(data: SignUpRequest): Promise<unknown> {
    try {
      const response = await this.makeRequest(
        `${API_BASE_URL}/customers/signUp`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorText = errorResponse.message || null;
        throw new Error(errorText || "Sign up failed");
      }

      const responseData = await response.json();
      if (!responseData.status) {
        throw new Error(responseData.message || "Sign up failed");
      }

      return responseData.data;
    } catch (error) {
      console.error("SignUp error:", error);
      throw error;
    }
  }

  // Login method
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest(
        `${API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorText = errorResponse.message || "An error occurred";
        console.error("Login failed:", errorText);
        throw new Error(errorText || "Login failed");
      }

      const loginResponse = await response.json();

      // Check for success
      if (!loginResponse.status) {
        throw new Error(loginResponse.message || "Login failed");
      }

      // Store the token in localStorage
      if (loginResponse.data && loginResponse.data.token) {
        localStorage.setItem("token", loginResponse.data.token);
        console.log("Token stored successfully");
      }

      return loginResponse.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Log event method
  async logEvent(data: EventRequest): Promise<string> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/event`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorText = errorResponse.message || null;
        throw new Error(errorText || "Failed to log event");
      }

      const eventResponse = await response.json();

      // Check for success
      if (!eventResponse.status) {
        throw new Error(eventResponse.message || "Failed to log event");
      }

      console.log(JSON.stringify(data));
      return eventResponse.data.status;
    } catch (error) {
      console.error("Log event error:", error);
      throw error;
    }
  }

  // Log work method
  async logWork(data: WorkRequest): Promise<WorkRequest> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/work`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorText = errorResponse.message || null;

        throw new Error(errorText || "Failed to log work");
      }

      const workResponse = await response.json();

      // Check for success
      if (!workResponse.status) {
        throw new Error(workResponse.message || "Failed to log work");
      }

      return workResponse.data;
    } catch (error) {
      console.error("Log work error:", error);
      throw error;
    }
  }

  // Forgot password method
  async forgotPassword(data: { email: string }): Promise<unknown> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Forgot password failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  }

  // Reset password method
  async resetPassword(data: { token: string; newPassword: string }): Promise<unknown> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Reset password failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
  }

  // Helper method to logout
  logout(): void {
    localStorage.removeItem("token");
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/test`, {
        method: "GET",
        mode: "cors",
      });
      return response.ok;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  }
}

export const apiService = new ApiService();
