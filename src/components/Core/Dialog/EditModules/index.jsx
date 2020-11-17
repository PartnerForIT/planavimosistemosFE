import React from "react";
import * as _ from "lodash";
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '../index';
import { useTranslation } from 'react-i18next';
import Checkbox from '../../Checkbox/Checkbox.jsx'

import Button from '../../Button/Button';
import style from '../Dialog.module.scss';


export default function EditModules({
  open, handleClose, title, checkedItem
}) {
  const dispatch = useDispatch();
  const [modules, setModules] = React.useState({
    logbook: true,
    events: false,
    reports: false,
    schedule: true,
    activity_log: true,
    create_places: true,
    create_jobs: true,
    create_groups: true,
    use_manager_mobile: true,
    use_approval_flow: true,
  });

  const { t } = useTranslation();

  const handleChange = (event) => {
    setModules({ ...modules, [event.target.name]: event.target.checked });
  };

  return(
    <Dialog handleClose={handleClose} open={open} title={title}>
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
            checked={modules.reports} 
            label={t('Schedule')}
            name='schedule' 
          />
          <Checkbox 
            onChange={handleChange} 
            checked={modules.reports} 
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
                onClick={()=> {}}
              >
                {t('Save')}
              </Button>
            </div>
        </div>
      </div>  
    </Dialog>
  )
};