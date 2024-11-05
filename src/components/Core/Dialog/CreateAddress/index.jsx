import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../Button/Button';
import FlatButton from '../../FlatButton/FlatButton';
import Tooltip from 'react-tooltip';
import GoogleMarkerIcon from '../../../../components/Icons/GoogleMarkerIcon';
import InputAddress from '../../InputAddress/InputAddress';
import Input from '../../Input/Input';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';
import markerSrc from '../../../../assets/marker.png';
import { getCountries } from '../../../../store/organizationList/actions';
import config from 'config';

import classes from './createAddress.module.scss';

import {
  settingCompanySelector
} from '../../../../store/settings/selectors';
import { countriesSelector } from '../../../../store/organizationList/selectors';

import {
  setKey,
  fromAddress,
  fromLatLng,
} from "react-geocode";
import { withGoogleMap, GoogleMap, withScriptjs, Marker, Circle } from "react-google-maps";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const initialFormValues = {
  address: '',
  coordinates: '',
  radius: '',
};

const defaultProps = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${config.google.key}&v=3.exp&libraries=geometry,drawing,places`,
}

export default function CreateAddress({
  handleClose, title, open,
  buttonTitle, createAddress, initialValues
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [dragMarker, setDragMarker] = useState(false);
  //const [currentZoom, setCurrentZoom] = useState(false);
  const [initData, setInitData] = useState({lat: 0, lng: 0, center_lat: 0, center_lng: 0, zoom: 3});
  const countries = useSelector(countriesSelector);
  const company = useSelector(settingCompanySelector);
  const mapRef = useRef(null);
  const currentDataRef = useRef({
    zoom: 3,
    lat: 0,
    lng: 0,
  });

  const {
    placePredictions,
    getPlacePredictions,
    //isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: config.google.key,
  });
  
  setKey(config.google.key);


  useEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);
  
  const handleCreateAddress = () => {
    createAddress(formValues)
    onClose();
  };
  const onClose = () => {
    setFormValues({...initialFormValues});
    handleClose();

  };
  const setCurrentZoom = (zoom) => {
    currentDataRef.current.zoom = zoom;
    if (mapRef?.current?.setZoom) {
      mapRef.current.setZoom(zoom);
    }
  };

  const currentCoordinates = () => {
    if (!formValues.coordinates) return false;
    const coords = formValues.coordinates.split(',');
    return { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
  }

  const onMapClick = (event) => {
    if (!dragMarker) return;
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    
    setDragMarker(false);
    getAddressFromMarker(lat, lng);
  };

  const onMarkerDragEnd = (event) => {
    let lat = event.latLng.lat(),
        lng = event.latLng.lng();

    setDragMarker(false);
    getAddressFromMarker(lat, lng);
  };

  const getAddressFromMarker = (lat, lng) => {
    fromLatLng(lat, lng).then(
        response => {
            const address = response.results[0].formatted_address;
            setFormValues({ ...formValues, address: address, coordinates: `${lat},${lng}` });
        },
        error => {
          console.error(error);
        }
    );
  };

  const onFit = () => {
    fetchCoordinates(true);
  };

  const onPoint = () => {
    fetchCoordinates();
    setCurrentZoom(17);
  };

  const onSelectAddress = (address) => {
    getPlacePredictions({ input: '' });
    setFormValues({ ...formValues, address });
  };

  const onClear = () => {
    getPlacePredictions({ input: '' });
    setFormValues({ ...formValues, address: '', coordinates: '', radius: ''});
    setCurrentZoom(7);
  };

  // eslint-disable-next-line
  const fetchCoordinates = useCallback(async (setZoom) => {
    try {
      const response = await fromAddress(formValues.address);
      const { lat, lng } = response.results[0].geometry.location;
      const coordinates = `${lat},${lng}`;
      if (setZoom) {
        const zoom = getBoundsZoomLevel(response.results[0].geometry.bounds, { height: 520, width: 1040 });
        setCurrentZoom(zoom);
      }

      setFormValues({ ...formValues, coordinates });
      setInitData({...initData, center_lat: lat, center_lng: lng });
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  });

  const getBoundsZoomLevel = (bounds, mapDim) => {
    const WORLD_DIM = { height: 520, width: 1000 };
    const ZOOM_MAX = 21;

    const latRad = (lat) => {
        const sin = Math.sin(lat * Math.PI / 180);
        const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    };

    const zoom = (mapPx, worldPx, fraction) => {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    };

    if (!bounds?.northeast || !bounds?.southwest) return 17;

    const ne = bounds.northeast;
    const sw = bounds.southwest;

    const latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

    const lngDiff = ne.lng - sw.lng;
    const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    const latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
};


  const searchAddress = () => {
    getPlacePredictions({ input: formValues.address });
  };


  const initCoords = async (address, setZoom) => {
    try {
      currentDataRef.current.lat = 0;
      currentDataRef.current.lng = 0;
      const response = await fromAddress(address);
      const {lat, lng} = response.results[0].geometry.location;
      if (initialValues.coordinates) {
        setInitData({ ...initData, lat: parseFloat(initialValues.coordinates.split(',')[0]), lng: parseFloat(initialValues.coordinates.split(',')[1]), center_lat: parseFloat(initialValues.coordinates.split(',')[0]), center_lng: parseFloat(initialValues.coordinates.split(',')[1]) });
      } else {
        setInitData({ lat, lng, center_lat: lat, center_lng: lng, zoom: 7 });
      }

      if (setZoom && !initialValues.coordinates) {
        const zoom = getBoundsZoomLevel(response.results[0].geometry.bounds, { height: 520, width: 1040 });
        setCurrentZoom(zoom);  
      } else if (initialValues.coordinates) {
        setCurrentZoom(17);
      } else {
        setCurrentZoom(7);
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };
  
  useEffect(() => {
    
    if (company && countries.length && open && !initialValues.address && initialValues?.id !== formValues?.id) {
      const foundCountry = countries.find(({ code }) => code === company.country);
      if (foundCountry) {
        initCoords(foundCountry?.name);
      }
    } else if (initialValues.address) {
      initCoords(initialValues.address, true);
      
    }

    if (initialValues) {
      setFormValues({
        address: initialValues.address,
        coordinates: initialValues.coordinates,
        radius: initialValues.radius,
      });
    } else {
      setFormValues({
        ...initialFormValues,
      });
    }
// eslint-disable-next-line
  }, [initialValues, open]);
  
  const MyMap = withScriptjs(withGoogleMap(props => {
    return (
    <GoogleMap
      ref={mapRef}
      defaultZoom={initData.zoom}
      zoom={currentDataRef.current.zoom ? currentDataRef.current.zoom : initData.zoom}
      defaultCenter={{lat: currentDataRef.current.lat*1 !== 0 ? currentDataRef.current.lat : initData.center_lat, lng: currentDataRef.current.lng*1 !== 0 ? currentDataRef.current.lng : initData.center_lng}}
      onClick={onMapClick}
      onZoomChanged={() => { currentDataRef.current.zoom = mapRef.current.getZoom(); }}
      //onDragEnd={() => { setInitData({...initData, center_lat: mapRef.current.getCenter().lat(), center_lng: mapRef.current.getCenter().lng()}); }}
      onDragEnd={() => { currentDataRef.current.lat = mapRef.current.getCenter().lat(); currentDataRef.current.lng = mapRef.current.getCenter().lng(); }}
    >
        {props.children}
    </GoogleMap>
    );
  }));

  return (
    <Dialog onClose={onClose} open={open} PaperProps={{
      style: {
        overflow: 'visible',
        width: '1040px',
        maxWidth: '1040vw',
      },
    }}>
      <div className={classes.createAddress}>
        <div className={classes.createAddress__title}>
          {title}
          <CloseIcon onClick={onClose} />
        </div>
        <div className={classes.createAddress__form}>
          <div className={classes.createAddress__head}>
            <div className={classes.createAddress__head_inputs}>
              <InputAddress
                placeholder={t('Enter address')}
                value={formValues.address}
                onSearch={searchAddress}
                onCancel={() => getPlacePredictions({ input: '' })}
                onSelect={onSelectAddress}
                // eslint-disable-next-line
                onChange={useCallback((e) => setFormValues({ ...formValues, address: e.target.value }))}
                onClear={onClear}
                onClickItem={(name) => { setFormValues({ ...formValues, address: name }) }}
                onFit={onFit}
                onPoint={onPoint}
                places={placePredictions}
                width={'450px'}
              />
              <div data-tip={t('Pick location')} data-for='google_marker' className={classes.createAddress__btnMarkerWrap}>
                <FlatButton  onClick={() => setDragMarker(!dragMarker)} className={classes.createAddress__btnMarker}>
                  <GoogleMarkerIcon active={dragMarker} />
                </FlatButton>
              </div>
              <div className={classes.createAddress__radiusrWrap}>
                <Input
                  placeholder={t('Enter radius')}
                  value={formValues.radius}
                  width='130px'
                  onChange={(e) => setFormValues({ ...formValues, radius: e.target.value })}
                  onBlur={(e) => setFormValues({ ...formValues, radius: e.target.value < 100 ? 100 : e.target.value })}
                />
                { formValues.radius && <span>m</span> }
              </div>
              <div className={classes.tooltipBlock} data-tip={t('100 meters diameter is the minimum acceptable value by the system because of possible GPS discrepancy')} data-for='google_marker'>
                ?
              </div>
              { formValues.radius &&
                <div className={classes.createAddress__head_inputs_area}>
                  {`${t('Area:')}`} <b>{`${Math.round(formValues.radius * formValues.radius * Math.PI)}`} m<sup>2</sup></b>
                </div>
              }
            </div>
            <Button onClick={handleCreateAddress} size='likeinp'>
              {buttonTitle}
            </Button>
          </div>
          <div className={classes.createAddress__map}>
            <MyMap
                googleMapURL={defaultProps.googleMapURL}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `520px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                center={{lat: initData.center_lat, lng: initData.center_lng}}
            >
              {
                formValues.coordinates && currentCoordinates() &&
                <Marker
                    icon={markerSrc}
                    draggable={dragMarker}
                    onDragEnd={onMarkerDragEnd}
                    position={currentCoordinates()}
                >
                  {formValues.radius &&
                    <Circle
                      defaultCenter={currentCoordinates()}
                      radius={formValues.radius*1}
                      options={{strokeColor: "#996AFF", strokeWeight: 1, fillColor: "#996AFF33"}}
                    />
                  }
                </Marker>
              }
            </MyMap>
            
          </div>
        </div>
        <Tooltip
          id='google_marker'
          className='schedule-screen__tooltip__black'
          effect='solid'
          placement='bottom'
        />
        <Tooltip
          id='google_marker_button'
          className='schedule-screen__tooltip__black'
          effect='solid'
          placement='bottom'
        />
      </div>
    </Dialog>
  );
}