import React, { useEffect, useState, useCallback } from 'react';
import Button from '../../Button/Button';
import FlatButton from '../../FlatButton/FlatButton';
import GoogleMarkerIcon from '../../../../components/Icons/GoogleMarkerIcon';
import InputAddress from '../../InputAddress/InputAddress';
import Input from '../../Input/Input';
import { useTranslation } from 'react-i18next';

import classes from './createAddress.module.scss';

const initialFormValues = {
  address: '',
  coordinates: '',
  radius: '',
};

export default function Inputs({
  open,
  initialValues,
  onFit,
  onPoint,
  onSelectAddress,
  onClear,
  searchAddress,
  setDragMarker,
  placePredictions,
  getPlacePredictions,
  dragMarker,
  handleCreateAddress,
  buttonTitle,
  setRadius,
}) {
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState(initialFormValues);
  
  useEffect(() => {

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

  }, [initialValues, open]);

  return (
    <div className={classes.createAddress__head}>
      <div className={classes.createAddress__head_inputs}>
        <InputAddress
          placeholder={t('Enter address')}
          value={formValues.address}
          onSearch={searchAddress}
          onCancel={() => getPlacePredictions({ input: '' })}
          onSelect={onSelectAddress}
          onChange={useCallback((e) => setFormValues({ ...formValues, address: e.target.value }))}
          onClear={onClear}
          onClickItem={(name) => { setFormValues({ ...formValues, address: name }) }}
          onFit={onFit}
          onPoint={onPoint}
          places={placePredictions}
          width={'480px'}
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
            width='120px'
            onChange={(e) => { setFormValues({ ...formValues, radius: e.target.value }); setRadius(e.target.value); }}
          />
          { formValues.radius && <span>m</span> }
        </div>
        { formValues.radius &&
          <div className={classes.createAddress__head_inputs_area}>
            {`${t('Area:')}`} <b>{`${Math.round(formValues.radius * formValues.radius * Math.PI)}`} m<sup>2</sup></b>
          </div>
        }
      </div>
      <Button onClick={() => { handleCreateAddress(formValues) }} size='likeinp'>
        {buttonTitle}
      </Button>
    </div>
  );
}