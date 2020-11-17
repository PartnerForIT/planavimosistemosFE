import React, { useState, useEffect } from "react";
import * as _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '../index';
import { useTranslation } from 'react-i18next';
import { getModules, patchModules } from '../../../../store/organizationList/actions';
import { modulesSelector } from '../../../../store/organizationList/selectors'
import Checkbox from '../../Checkbox/Checkbox2.jsx'
import Button from '../../Button/Button';
import style from '../Dialog.module.scss';


export default function EditModules({
  open, handleClose, title, checkedItem, companies
}) {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const storeModules = useSelector(modulesSelector);

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
  });

  const [company, setCompany] = useState([])

  useEffect(() => {
    if (open && checkedItem) {
      setCompany(companyById(checkedItem))
    }
  }, [open])

  useEffect(() => {
    if (company[0] && company[0].status === 1) {
      dispatch(getModules(checkedItem))
    };
  }, [company])

  useEffect(() => {
    if (Object.keys(storeModules).length > 0) {
      setModules({
        logbook: storeModules.logbook === 0 ? false : true,
        events: storeModules.events === 0 ? false : true,
        reports: storeModules.reports === 0 ? false : true,
        schedule: storeModules.schedule === 0 ? false : true,
        activity_log: storeModules.activity_log === 0 ? false : true,
        create_places: storeModules.create_places === 0 ? false : true,
        create_jobs: storeModules.create_jobs === 0 ? false : true,
        create_groups: storeModules.create_groups === 0 ? false : true,
        use_manager_mobile: storeModules.use_manager_mobile === 0 ? false : true,
        use_approval_flow: storeModules.use_approval_flow === 0 ? false : true,
      })
    }
  }, [storeModules])

  const companyById = (id) => {
    const company = companies.filter(item => item.id === id);
    return company
  }

  const handleChange = (event) => {
    setModules({ ...modules, [event.target.name]: event.target.checked });
  };

  const saveChangeModules = () => {
    dispatch(patchModules(checkedItem, modules))
    handleClose(false)
  }

  return (
    <Dialog handleClose={handleClose} open={open} title={title}>
      {(company[0] && company[0].status === 1) &&
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
            <div className={style.buttonBlock}></div>
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
              label={t('Can use Approval Flow in Logbook')}
              name='use_approval_flow'
            />
            <div className={style.buttonBlock}>
              <Button cancel size="big" onClick={handleClose}>{t('Cancel')}</Button>
              <Button
                size="big"
                onClick={() => saveChangeModules()}
              >
                {t('Save')}
              </Button>
            </div>
          </div>
        </div>
      }
      {(company[0] && company[0].status !== 1) &&
        <div className={style.addOrg}>
          <div className={style.warningText}>
            {t('In order to edit modules of a company, its status must be active. Change the status of the company to active, then edit the availability of its modules')}
            <div className={style.buttonWarningBlock}>
              <Button cancel size="big" onClick={handleClose}>{t('Cancel')}</Button>
            </div>
          </div>
        </div>
      }
    </Dialog>
  )
};