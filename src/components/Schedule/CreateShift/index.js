import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from '../../Core/MainLayout';
import Checkbox from "../../Core/Checkbox/Checkbox2";
import Button from '../../Core/Button/Button';
import InputSelect from '../../Core/InputSelect';
import Input from '../../Core/Input/Input';
import { placesSelector } from '../../../store/places/selectors';
import { getPlaces } from '../../../store/places/actions';

import ShiftColor from './ShiftColor';
import classes from './CreateShift.module.scss';

const colors = {
  bright: [
    '#663D4A',
    '#663D58',
    '#663D66',
    '#583D66',
    '#4B3D66',
    '#3D3D66',
    '#3D4B66',
    '#3D5866',
    '#3D6666',
    '#3D6658',
    '#3D664B',
    '#4B663D',
    '#58663D',
    '#66663D',
    '#66663D',
    '#66583D',
    '#664B3D',
    '#663D3D',
  ],
  calm: [
    '#805965',
    '#805973',
    '#805980',
    '#735980',
    '#665980',
    '#595980',
    '#596680',
    '#597380',
    '#598080',
    '#598073',
    '#598066',
    '#598059',
    '#668059',
    '#738059',
    '#808059',
    '#807359',
    '#806659',
    '#805959',
  ],
};

export default () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const [colorShift, setColorShift] = useState('#663D4A');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [shiftName, setShiftName] = useState('');
  const places = useSelector(placesSelector);

  const handleChangePlace = (event) => {
    setSelectedPlace(event.target.value);
  };
  const handleSaveChanges = () => {
    console.log('handleSaveChanges');
  };
  const handleChangeShiftColor = () => {
    console.log('handleSaveChanges');
  };
  const handleChangeShiftName = (event) => {
    setShiftName(event.target.value);
  };

  useEffect(() => {
    dispatch(getPlaces(companyId));
  }, [dispatch, companyId]);

  return (
    <MainLayout>
      <div className={classes.createShift}>
        <div className={classes.createShift__header}>
          <span className={classes.createShift__header__title}>
            {t('Create New Shift')}
          </span>
          <ShiftColor
            label={`${t('Shift Color')}:`}
            modalLabel={t('Shift')}
            value={colorShift}
            onChange={handleChangeShiftColor}
          />
          <Input
            placeholder={t('Enter Shift Name')}
            value={shiftName}
            name='place'
            onChange={handleChangeShiftName}
          />
          <InputSelect
            id='place-select'
            labelId='country'
            name='country'
            placeholder={t('Select place')}
            value={selectedPlace}
            onChange={handleChangePlace}
            options={places}
            valueKey='id'
            labelKey='name'
          />
          <Button onClick={handleSaveChanges}>
            {t('Save Changes')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};
