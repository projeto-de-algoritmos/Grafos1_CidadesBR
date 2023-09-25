import { api } from "./api";

export interface GetRouteParams {
  from: number;
  to: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export async function getRoute({
  from,
  to,
}: GetRouteParams): Promise<Coordinate[]> {
  const response = await api.get<Coordinate[]>(`/route/${from}/${to}`);
  return response.data;
}
