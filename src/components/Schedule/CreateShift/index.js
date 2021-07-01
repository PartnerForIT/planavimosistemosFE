import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';
import moment from 'moment';

import MainLayout from '../../Core/MainLayout';
import Tooltip from '../../Core/Tooltip';
import Button from '../../Core/Button/Button';
import InputSelect from '../../Core/InputSelect';
import Progress from '../../Core/Progress';
import Input from '../../Core/Input/Input';
import PopupSave from './PopupSave';
import { getPlaces } from '../../../store/places/actions';
import { getSettingWorkTime } from '../../../store/settings/actions';
import { getJobTypes } from '../../../store/jobTypes/actions';
import { getEmployees } from '../../../store/employees/actions';
import { placesSelector } from '../../../store/places/selectors';
import { settingWorkTime, isLoadingSelector } from '../../../store/settings/selectors';
import { jobTypesSelector } from '../../../store/jobTypes/selectors';
import { employeesSelector } from '../../../store/employees/selectors';

import ShiftColor from './ShiftColor';
import DatePicker from './DatePicker';
import ButtonsField from './ButtonsField';
import Table from './Table';
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
const makeShiftForOptions = [
  {
    label: 'One week',
    value: 1,
  },
  {
    label: 'Two weeks',
    value: 2,
  },
  {
    label: 'Three weeks',
    value: 3,
  },
  {
    label: 'Four weeks',
    value: 4,
  },
];

export default () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  const [colorShift, setColorShift] = useState('#663D4A');
  const [selectedPlace, setSelectedPlace] = useState('');
  const [shiftName, setShiftName] = useState('');
  const [makeShiftFor, setMakeShiftFor] = useState(1);
  const [startShiftFrom, setStartShiftFrom] = useState(moment());
  const [customWorkingTime, setCustomWorkingTime] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);
  const places = useSelector(placesSelector);
  const workTime = useSelector(settingWorkTime);
  const allJobTypes = useSelector(jobTypesSelector);
  const employees = useSelector(employeesSelector);
  const isLoading = useSelector(isLoadingSelector);

  const handleChangePlace = (event) => {
    setSelectedPlace(event.target.value);
  };
  const handleSaveChanges = () => {
    setSaveChanges(true);
  };
  const handleClose = () => {
    setSaveChanges(false);
  };
  const handleChangeShiftColor = (color) => {
    setColorShift(color);
  };
  const handleChangeShiftName = (event) => {
    setShiftName(event.target.value);
  };

  useEffect(() => {
    dispatch(getPlaces(companyId));
    dispatch(getJobTypes(companyId));
    dispatch(getEmployees(companyId));
    dispatch(getSettingWorkTime(companyId));
  }, [dispatch, companyId]);

  return (
    <MainLayout>
      <div className={classes.header}>
        <span className={classes.header__title}>
          {t('Create New Shift')}
        </span>
        <ShiftColor
          label={`${t('Shift Color')}:`}
          modalLabel={t('Shift')}
          value={colorShift}
          onChange={handleChangeShiftColor}
          colors={colors}
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
      <div className={classes.options}>
        <ButtonsField
          onChange={setMakeShiftFor}
          value={makeShiftFor}
          label={`${t('Make shift for')}:`}
          options={makeShiftForOptions}
        />
        <DatePicker
          label={`${t('Start Shift From')}:`}
          value={startShiftFrom}
          onChange={setStartShiftFrom}
        />
        <div className={classes.options__switch}>
          {t('Use custom working time')}
          <Tooltip title={t('Use custom working time')} />
          <Switch
            onChange={setCustomWorkingTime}
            offColor='#808F94'
            onColor='#0085FF'
            uncheckedIcon={false}
            checkedIcon={false}
            checked={customWorkingTime}
            height={21}
            width={40}
          />
        </div>
      </div>
      {
        (isLoading || !workTime.work_time.work_days) ? (
          <Progress />
        ) : (
          <Table
            makeShiftFor={makeShiftFor}
            customWorkingTime={customWorkingTime}
            workTime={workTime}
            allJobTypes={allJobTypes}
            employees={employees}
            startShiftFrom={startShiftFrom}
          />
        )
      }
      {
        saveChanges && (
          <PopupSave
            places={places}
            shiftName={shiftName}
            selectedPlace={selectedPlace}
            onClose={handleClose}
          />
        )
      }
    </MainLayout>
  );
};
