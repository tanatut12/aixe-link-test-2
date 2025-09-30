import axios from "axios";
import type { IMedicalReading } from "../interfaces/index.js";

const API_BASE_URL = "http://103.121.12.92:9582";

export async function fetchMedicalData(): Promise<IMedicalReading[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/test-data`, {
      responseType: "text",
    });

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, "text/xml");

    const dataElement = xmlDoc.querySelector("data");
    if (!dataElement || !dataElement.textContent) {
      throw new Error("No data found in XML response");
    }

    const base64Data = dataElement.textContent.trim();
    const decodedData = atob(base64Data);

    const medicalReadings: IMedicalReading[] = JSON.parse(decodedData);
    return medicalReadings;
  } catch (error) {
    console.error("Error fetching medical data:", error);
    throw error;
  }
}
