import { api } from "./api";

export interface City {
  id: number;
  name: string;
}

export async function getCities(): Promise<City[]> {
  const response = await api.get<City[]>("/city");
  return response.data;
}
