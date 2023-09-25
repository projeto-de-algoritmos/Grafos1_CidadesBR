import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { Coordinate } from "../../api/route";
import styles from "./styles.module.scss";

interface MapProps {
  route: Coordinate[];
}

export default function Map({ route }: MapProps) {
  return (
    <MapContainer
      className={styles.mapContainer}
      center={{ lat: route[0].latitude, lng: route[0].longitude }}
      zoom={5}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route.map((coordinate) => (
        <Marker
          key={coordinate.latitude + coordinate.longitude}
          position={{ lat: coordinate.latitude, lng: coordinate.longitude }}
        />
      ))}
      <Polyline
        positions={route.map((coordinate) => ({
          lat: coordinate.latitude,
          lng: coordinate.longitude,
        }))}
      />
    </MapContainer>
  );
}
