import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Dialog from '../index';
import { getModules, patchModules } from '../../../../store/organizationList/actions';
import {
  modulesSelector,
  isLoadingModulesSelector,
} from '../../../../store/organizationList/selectors';
import Checkbox from '../../Checkbox/Checkbox2';
import Button from '../../Button/Button';
import Progress from '../../Progress';
import style from '../Dialog.module.scss';

const initialValues = {
  logbook: false,
  events: false,
  reports: false,
  activity_log: false,
  time_sheet: false,
  integrations: false,
  schedule_simple: false,
  schedule_shift: false,
  manual_mode: false,
  create_places: false,
  create_jobs: false,
  create_groups: false,
  use_manager_mobile: false,
  use_approval_flow: false,
  custom_category: false,
  cost_earning: false,
  profitability: false,
  comments_photo: false,
  kiosk: false,
  rates: false,
  night_rates: false,
  holiday_rates: false,
  use_geolocation: false,
};

export default ({
  open,
  handleClose,
  title,
  checkedItemId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const storeModules = useSelector(modulesSelector);
  const isLoading = useSelector(isLoadingModulesSelector);

  const [modules, setModules] = useState(initialValues);

  useEffect(() => {
    if (open && checkedItemId) {
      dispatch(getModules(checkedItemId));
    }
  }, [checkedItemId, open, dispatch]);

  useEffect(() => {
    const storeModulesArr = Object.keys(storeModules);

    if (storeModulesArr.length > 0) {
      const currentModules = storeModulesArr.reduce((acc, item) => {
        acc[item] = !!storeModules[item];
        return acc;
      }, {});
      setModules((prevState) => ({
        ...prevState,
        ...currentModules,
      }));
    }
  }, [isLoading, storeModules]);

  const handleChange = (event) => {
    const { name, checked } = event.target;

    switch (name) {
      case 'schedule_shift': {
        setModules((prevState) => ({
          ...prevState,
          schedule_shift: checked,
          schedule_simple: false,
          manual_mode: false,
          create_places: checked || prevState.create_places,
        }));
        break;
      }
      case 'schedule_simple': {
        setModules((prevState) => ({
          ...prevState,
          schedule_simple: checked,
          schedule_shift: false,
        }));
        break;
      }
      case 'profitability': {
        setModules({
          ...modules,
          cost_earning: checked,
          [name]: checked,
        });
        break;
      }
      default: {
        setModules({ ...modules, [name]: checked });
      }
    }
  };

  const handleExited = () => {
    setModules(initialValues);
  };

  const saveChangeModules = () => {
    dispatch(patchModules(checkedItemId, modules));
    handleClose(false);
  };

  return (
    <Dialog onExited={handleExited} handleClose={handleClose} open={open} title={title}>
      {
        isLoading ? <Progress /> : (
          <div className={style.addOrg}>
            <div className={style.addOrg__inner2}>
              <Checkbox
                onChange={handleChange}
                checked={modules.logbook}
                label={t('Logbook')}
                name='logbook'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.events}
                label={t('Events')}
                name='events'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.reports}
                label={t('Reports')}
                name='reports'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.schedule_simple}
                label={t('Simple Schedule')}
                name='schedule_simple'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.schedule_shift}
                label={t('Schedule with shift')}
                name='schedule_shift'
              />
              <div className={style.marginLeft}>
                <Checkbox
                  onChange={handleChange}
                  checked={modules.manual_mode}
                  disabled={!modules.schedule_shift}
                  label={t('Manual Mode')}
                  name='manual_mode'
                />
              </div>
              <Checkbox
                onChange={handleChange}
                checked={modules.activity_log}
                label={t('Activity Log')}
                name='activity_log'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.time_sheet}
                label={t('Time Sheet')}
                name='time_sheet'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.integrations}
                label={t('Integrations')}
                name='integrations'
              />
              <div className={style.buttonBlock} />
            </div>
            <div className={style.addOrg__inner2}>
              <Checkbox
                onChange={handleChange}
                checked={modules.create_places}
                disabled={modules.schedule_shift}
                label={t('Can create Places')}
                name='create_places'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.create_jobs}
                label={t('Can create Jobs')}
                name='create_jobs'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.custom_category}
                label={t('Can create custom category')}
                name='custom_category'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.create_groups}
                label={t('Can create Groups')}
                name='create_groups'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.use_manager_mobile}
                label={t('Can use Manager Mobile View')}
                name='use_manager_mobile'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.use_approval_flow}
                label={t('Can use Approval Flow in Logbook')}
                name='use_approval_flow'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.cost_earning}
                label={t('Can use Cost and Earnings')}
                name='cost_earning'
                disabled={modules.profitability}
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.profitability}
                label={t('Can use Profitability feature')}
                name='profitability'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.comments_photo}
                label={t('Can use Comments and Take Photo')}
                name='comments_photo'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.kiosk}
                label={t('Can use Kiosk for identification')}
                name='kiosk'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.rates}
                label={t('Can use Additional Rates')}
                name='rates'
              />
              {
                modules.rates && (
                  <div className={style.marginLeft}>
                    <Checkbox
                      onChange={handleChange}
                      checked={modules.night_rates}
                      disabled={!modules.rates}
                      label={t('Night time rates')}
                      name='night_rates'
                    />
                    <Checkbox
                      onChange={handleChange}
                      checked={modules.holiday_rates}
                      disabled={!modules.rates}
                      label={t('Holiday rates')}
                      name='holiday_rates'
                    />
                  </div>
                )
              }

              <Checkbox
                onChange={handleChange}
                checked={modules.use_geolocation}
                label={t('Geolocation checking live')}
                name='use_geolocation'
              />

              <div className={style.buttonBlock}>
                <Button cancel size='big' onClick={handleClose}>{t('Cancel')}</Button>
                <Button
                  size='big'
                  onClick={() => saveChangeModules()}
                >
                  {t('Save')}
                </Button>
              </div>
            </div>
          </div>
        )
      }

    </Dialog>
  );
};
