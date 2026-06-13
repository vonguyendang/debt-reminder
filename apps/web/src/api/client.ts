const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787/api';

export class ApiClient {
  static getToken() {
    return localStorage.getItem('auth_token');
  }

  static setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  static clearToken() {
    localStorage.removeItem('auth_token');
  }

  static async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
      }
      throw new Error(data?.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  static async get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  static async post(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  static async put(endpoint: string, body: any) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  }

  static async delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}
