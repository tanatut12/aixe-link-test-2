import axios, { AxiosError } from "axios";
import type { IMedicalReading } from "../interfaces";

const API_BASE_URL = "http://103.121.12.92:9582";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await axiosInstance.get<T>(endpoint);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("API Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(
        `Failed to fetch data: ${error.response?.status || error.message}`
      );
    }
    throw error;
  }
}

export async function fetchMedicalData(): Promise<IMedicalReading[]> {
  return fetchData<IMedicalReading[]>("/test-data");
}

export { axiosInstance };
