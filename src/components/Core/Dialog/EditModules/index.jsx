import React, { useState, useEffect, useCallback } from 'react';
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

export default function EditModules({
  open, handleClose, title, checkedItem, companies,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const storeModules = useSelector(modulesSelector);
  const isLoading = useSelector(isLoadingModulesSelector);

  const [costDisabled, setCostDisabled] = useState(false);

  const [modules, setModules] = useState({
    logbook: false,
    events: false,
    reports: false,
    schedule: false,
    activity_log: false,
    create_places: false,
    create_jobs: false,
    create_groups: false,
    use_manager_mobile: false,
    use_approval_flow: false,
    cost_earning: false,
    profitability: false,
    comments_photo: false,
    kiosk: false,
  });

  const [company, setCompany] = useState([]);

  useEffect(() => {
    if (company[0]) {
      dispatch(getModules(checkedItem));
    }
  }, [checkedItem, company, dispatch]);

  useEffect(() => {
    if (Object.keys(storeModules).length > 0) {
      setModules({
        logbook: storeModules.logbook !== 0,
        events: storeModules.events !== 0,
        reports: storeModules.reports !== 0,
        schedule: storeModules.schedule !== 0,
        activity_log: storeModules.activity_log !== 0,
        create_places: storeModules.create_places !== 0,
        create_jobs: storeModules.create_jobs !== 0,
        create_groups: storeModules.create_groups !== 0,
        use_manager_mobile: storeModules.use_manager_mobile !== 0,
        use_approval_flow: storeModules.use_approval_flow !== 0,
        cost_earning: storeModules.cost_earning !== 0,
        profitability: storeModules.profitability !== 0,
        comments_photo: storeModules.comments_photo !== 0,
        kiosk: storeModules.kiosk !== 0,
      });
    }
  }, [isLoading, storeModules]);
  const companyById = useCallback((id) => companies.filter((item) => item.id === id), [companies]);

  useEffect(() => {
    if (open && checkedItem) {
      setCompany(companyById(checkedItem));
    }
  }, [checkedItem, companyById, open]);

  const handleChange = (event) => {
    if (event.target.name === 'profitability') {
      if (event.target.checked) {
        setCostDisabled(true);
        setModules({
          ...modules,
          cost_earning: true,
          [event.target.name]: event.target.checked,
        });
      } else {
        setCostDisabled(false);
        setModules({
          ...modules,
          cost_earning: false,
          [event.target.name]: event.target.checked,
        });
      }
    } else {
      setModules({ ...modules, [event.target.name]: event.target.checked });
    }
  };

  const handleExited = () => {
    setModules({
      gbook: false,
      events: false,
      reports: false,
      schedule: false,
      activity_log: false,
      create_places: false,
      create_jobs: false,
      create_groups: false,
      use_manager_mobile: false,
      use_approval_flow: false,
      cost_earning: false,
      profitability: false,
      comments_photo: false,
      kiosk: false,
    });
  };

  const saveChangeModules = () => {
    dispatch(patchModules(checkedItem, modules));
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
                checked={modules.schedule}
                label={t('Schedule')}
                name='schedule'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.activity_log}
                label={t('Activity Log')}
                name='activity_log'
              />
              <div className={style.buttonBlock} />
            </div>
            <div className={style.addOrg__inner2}>
              <Checkbox
                onChange={handleChange}
                checked={modules.create_places}
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
                label={t('Can use Approval Flow in Events')}
                name='use_approval_flow'
              />
              <Checkbox
                onChange={handleChange}
                checked={modules.cost_earning}
                label={t('Can use Cost and Earnings')}
                name='cost_earning'
                disabled={costDisabled || modules.profitability}
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
}
