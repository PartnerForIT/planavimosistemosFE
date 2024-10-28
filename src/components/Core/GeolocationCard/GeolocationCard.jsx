import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import config from 'config';

import markerSrc from '../../../assets/marker.png';
import markerBlueSrc from '../../../assets/markerblue.png';
import styles from './GeolocationCard.module.scss';

import { withGoogleMap, GoogleMap, withScriptjs, Marker, Circle } from "react-google-maps";

const defaultProps = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${config.google.key}&v=3.exp&libraries=geometry,drawing,places`,
};

export default ({ coordinates, place }) => {
  const { t } = useTranslation();
  const [initData, setInitData] = useState({ lat: 0, lng: 0, zoom: 3 });
  const mapRef = useRef(null);

  const currentPlaceCoordinates = () => {
    if (!place.coordinates) return null;
    const coords = place.coordinates.split(',');
    return { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
  };

  const currentCoordinates = () => {
    if (!coordinates) return null;
    const coords = coordinates.split(',');
    return { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
  };

  const calculateMidpoint = (coord1, coord2) => {
    return {
      lat: (coord1.lat + coord2.lat) / 2,
      lng: (coord1.lng + coord2.lng) / 2,
    };
  };

  const calculateZoomLevel = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLng = (coord2.lng - coord1.lng) * (Math.PI / 180);
    const lat1 = coord1.lat * (Math.PI / 180);
    const lat2 = coord2.lat * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) return 16;
    if (distance < 5) return 14;
    if (distance < 10) return 12;
    if (distance < 20) return 10;
    if (distance < 50) return 8;
    if (distance < 100) return 7;
    return 6; // Default to a broader zoom for large distances
  };

  useEffect(() => {
    const placeCoords = currentPlaceCoordinates();
    const userCoords = currentCoordinates();
    if (userCoords && placeCoords) {
      const center = calculateMidpoint(userCoords, placeCoords);
      const zoom = calculateZoomLevel(userCoords, placeCoords);
      setInitData({ lat: center.lat, lng: center.lng, zoom });
    }
    // eslint-disable-next-line
  }, [coordinates, place]);

  const MyMap = withScriptjs(withGoogleMap(props => (
    <GoogleMap
      ref={mapRef}
      defaultZoom={initData.zoom}
      zoom={initData.zoom}
      defaultCenter={{ lat: initData.lat, lng: initData.lng }}
      center={{ lat: initData.lat, lng: initData.lng }}
      options={{
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        gestureHandling: "cooperative"
      }}
    >
      {props.children}
    </GoogleMap>
  )));

  return (
    <div className={styles.GeolocationCard}>
      <span className={styles.GeolocationCard__text}>
        {t('Last known location')}
      </span>
      <span className={styles.GeolocationCard__map}>
        <MyMap
          googleMapURL={defaultProps.googleMapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `250px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        >
          {currentPlaceCoordinates() && (
            <Marker
              icon={markerSrc}
              draggable={false}
              position={currentPlaceCoordinates()}
            >
              {place.radius && (
                <Circle
                  defaultCenter={currentPlaceCoordinates()}
                  radius={place.radius * 1}
                  options={{ strokeColor: "#996AFF", strokeWeight: 1, fillColor: "#996AFF33" }}
                />
              )}
            </Marker>
          )}
          {currentCoordinates() && (
            <Marker
              icon={markerBlueSrc}
              draggable={false}
              position={currentCoordinates()}
            />
          )}
        </MyMap>
      </span>
    </div>
  );
};