import { LoginRequest, SignUpRequest, LoginResponse, EventRequest, WorkRequest } from '../types/auth';

const API_BASE_URL = 'http://localhost:8088';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async makeRequest(url: string, options: RequestInit) {
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      return response;
    } catch (error) {
      console.error('Network error:', error);
      throw new Error('Network error occurred');
    }
  }

  async signUp(data: SignUpRequest): Promise<any> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/customers/signUp`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Sign up failed');
      }

      return response.text();
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        throw new Error(errorText || 'Login failed');
      }

      const loginResponse = await response.json();
      
      // Store the token in localStorage
      if (loginResponse.token) {
        localStorage.setItem('token', loginResponse.token);
        console.log('Token stored successfully');
      }

      return loginResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logEvent(data: EventRequest): Promise<string> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/event`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to log event');
      }

      console.log(JSON.stringify(data));


      return response.text();
    } catch (error) {
      console.error('Log event error:', error);
      throw error;
    }
  }

  async logWork(data: WorkRequest): Promise<WorkRequest> {
    try {
      const response = await this.makeRequest(`${API_BASE_URL}/api/work`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to log work');
      }

      return response.json();
    } catch (error) {
      console.error('Log work error:', error);
      throw error;
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Helper method to logout
  logout(): void {
    localStorage.removeItem('token');
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/test`, {
        method: 'GET',
        mode: 'cors'
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();