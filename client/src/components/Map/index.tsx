import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { Stop } from "../../api/route";
import styles from "./styles.module.scss";
import { Icon, LatLngBoundsExpression } from "leaflet";

interface MapProps {
  route: Stop[];
}

const icon = new Icon.Default({
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
  shadowSize: [0, 0],
});

export default function Map({ route }: MapProps) {
  function getMinMax(): LatLngBoundsExpression {
    let minLat = 0;
    let maxLat = 0;
    let minLng = 0;
    let maxLng = 0;

    if (route.length > 0) {
      minLat = Math.min(...route.map((stop) => stop.coordinate.latitude));
      maxLat = Math.max(...route.map((stop) => stop.coordinate.latitude));
      minLng = Math.min(...route.map((stop) => stop.coordinate.longitude));
      maxLng = Math.max(...route.map((stop) => stop.coordinate.longitude));
    }

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }

  return (
    <MapContainer
      className={styles.mapContainer}
      center={{
        lat: route[0].coordinate.latitude,
        lng: route[0].coordinate.longitude,
      }}
      bounds={getMinMax()}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {route.map((stop) => (
        <Marker
          key={stop.id}
          position={{
            lat: stop.coordinate.latitude,
            lng: stop.coordinate.longitude,
          }}
          icon={icon}
        >
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
      <Polyline
        positions={route.map((stop) => ({
          lat: stop.coordinate.latitude,
          lng: stop.coordinate.longitude,
        }))}
      />
    </MapContainer>
  );
}
