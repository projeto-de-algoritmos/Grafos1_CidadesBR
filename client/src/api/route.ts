import { api } from "./api";

export interface GetRouteParams {
  from: number;
  to: number;
}

export interface Stop {
  id: number;
  name: string;
  coordinate: Coordinate;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export async function getRoute({ from, to }: GetRouteParams): Promise<Stop[]> {
  const response = await api.get<Stop[]>(`/route/${from}/${to}`);
  return response.data;
}
