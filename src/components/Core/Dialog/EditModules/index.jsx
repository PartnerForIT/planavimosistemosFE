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
  const [state, setState] = React.useState({
    logbook: true,
    events: true,
    reports: true,
    schedule: true,
    activity_log: true,

    create_places: true,
    create_jobs: true,
    create_groups: true,
    use_manager_mobile: true,
    use_approval_flow: true,
  });

  const { t } = useTranslation();

  const onChange = () => {

  }
  return(
    <Dialog handleClose={handleClose} open={open} title={title}>
      <div className={style.addOrg}>
        <div className={style.addOrg__inner}>
          <Checkbox onChange={onChange} />
        </div>
        <div className={style.addOrg__inner}>
          {checkedItem}
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