// src/api/client.ts
import { ofetch } from 'ofetch';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface ApiError {
  status: number;
  message: string;
}

export class ApiClient {
  private fetch: typeof ofetch;

  constructor(baseURL: string) {
    this.fetch = ofetch.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Token ${token}`, 
      },

      onRequestError({ error }) {
        const apiError: ApiError = {
          status: 500,
          message: error?.message ?? 'Network or CORS error',
        };
        throw apiError;
      },
    });
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetch<T>(endpoint, { method: 'GET' });
      return {
        data: response,
        status: 200, 
      };
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number }; message?: string };
      const apiError: ApiError = {
        status: errorObj.response?.status ?? 500,
        message: errorObj.message ?? 'Failed to fetch data',
      };
      throw apiError;
    }
  }

  async post<T, D>(endpoint: string, data: D): Promise<ApiResponse<T>> {
    try {
      const response = await this.fetch<T>(endpoint, {
        method: 'POST',
        body: data as BodyInit | Record<string, unknown> | null | undefined,
      });
      return {
        data: response,
        status: 200,
      };
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number }; message?: string };
      const apiError: ApiError = {
        status: errorObj.response?.status ?? 500,
        message: errorObj.message ?? 'Failed to post data',
      };
      throw apiError;
    }
  }
}
