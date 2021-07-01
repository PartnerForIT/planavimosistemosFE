import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Input from '../../../Core/Input/Input';
import InputSelect from '../../../Core/InputSelect';
import Button from '../../../Core/Button/Button';
import classes from './PopupSave.module.scss';

export default ({
  places,
  shiftName,
  selectedPlace,
  onClose,
}) => {
  const { t } = useTranslation();

  const [isCreatePlace, setIsCreatePlace] = useState(false);
  const [values, setValues] = useState({});

  const type = useMemo(() => {
    if (!places.length) {
      return 'createPlace';
    }

    if (!selectedPlace && !shiftName) {
      return 'enterShiftNameAndPlace';
    }

    if (!selectedPlace) {
      return 'selectPlace';
    }

    if (!shiftName) {
      return 'enterShiftName';
    }
  }, [shiftName, selectedPlace, places]);

  const handleChangePlace = (event) => {
    setValues((prevState) => ({
      ...prevState,
      placeId: event.target.value,
    }));
  };
  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleClickCreatePlace = () => {
    setIsCreatePlace(true);
  };
  const handleClickAssign = () => {
    console.log('Create Place name and assign');
  };

  return (
    <div
      className={classes.popupSave}
      onClick={onClose}
      role='presentation'
    >
      <div
        className={classes.popupSave__content}
        onClick={(e) => e.stopPropagation()}
        role='presentation'
      >
        {
          type === 'createPlace' && (
            isCreatePlace ? (
              <>
                <div className={classes.popupSave__content__title}>
                  {t('Create Place name')}
                </div>
                <Input
                  placeholder={t('Enter Place name')}
                  value={values.placeName}
                  name='placeName'
                  fullWidth
                  onChange={handleChangeInput}
                />
                <Button fillWidth onClick={handleClickAssign}>
                  {t('Create Place name and assign')}
                </Button>
              </>
            ) : (
              <>
                <div className={classes.popupSave__content__title}>
                  {t('Please create a place')}
                </div>
                <div className={classes.popupSave__content__description}>
                  {t('Please create at least one place in order to create and assign your new planned shift to it')}
                </div>
                <Button fillWidth onClick={handleClickCreatePlace}>
                  {t('Create place')}
                </Button>
                <Button
                  cancel
                  fillWidth
                  onClick={onClose}
                >
                  {t('Cancel')}
                </Button>
              </>
            )
          )
        }
        {
          type !== 'createPlace' && (
            <>
              <div className={classes.popupSave__content__title}>
                {
                  type === 'enterShiftNameAndPlace'
                    && t('Please enter the shift name and select a place')
                }
                {
                  type === 'enterShiftName'
                    && t('Enter the shift name')
                }
                {
                  type === 'selectPlace'
                    && t('Select place')
                }
              </div>
              {
                !shiftName && (
                  <Input
                    placeholder={t('Enter shift name')}
                    value={values.shiftName}
                    name='shiftName'
                    fullWidth
                    onChange={handleChangeInput}
                  />
                )
              }
              {
                !selectedPlace && (
                  <InputSelect
                    name='place-select'
                    placeholder={t('Select place')}
                    value={values.placeId}
                    onChange={handleChangePlace}
                    options={places}
                    valueKey='id'
                    labelKey='name'
                  />
                )
              }
              <Button fillWidth onClick={Function.prototype}>
                {t('Save Shift')}
              </Button>
            </>
          )
        }
      </div>
    </div>
  );
};
