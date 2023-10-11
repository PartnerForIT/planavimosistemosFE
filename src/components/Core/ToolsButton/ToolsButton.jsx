import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import styles from './ToolsButton.module.scss';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import Checkbox from '../../Core/Checkbox/Checkbox2';
import Tooltip from '../../Core/Tooltip';
import usePermissions from '../../../components/Core/usePermissions';
import { companyModules } from '../../../store/company/selectors';

const permissionsConfig = [
  {
    name: 'schedule_edit',
    module: 'schedule_shift',
    permission: 'schedule_edit',
  },
];


/**
 * Simple Button encapsulating all design variations
 */
const ToolsButton = ({
  values, handleInputChange,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const modules = useSelector(companyModules);
  const permissions = usePermissions(permissionsConfig);

  const wrapperClasses = classNames(styles.inputWrapper, {
    [styles.inputWrapperOpened]: open,
  });


  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={styles.toolsOuter}>
        <div
          // eslint-disable-next-line jsx-a11y/aria-role
          role='input'
          className={wrapperClasses}
          onClick={() => setOpen(!open)}
        >
          <span className={styles.customSelect}><SettingsIcon />{t('Tools')}</span>
        </div>

        {open ? (
          <div className={classNames(styles.contentBox)}>
            {t('Tools')}
            <CloseIcon onClick={() => setOpen(!open)} />
            <div className={classNames(styles.checkboxesBox)}>
              { modules.manual_mode && permissions.schedule_edit ? (
              <div className={styles.generalBlock}>
                <Checkbox
                  onChange={handleInputChange}
                  checked={values['marking']}
                  label={t('Marking/Highlight')}
                  name='marking'
                />
                <div className={styles.tooltipBlock}>
                  <Tooltip
                    placement='bottom'
                    title="Marking/Highlighting tool can be used in any view.
                          People who don't have permission to add markings,
                          will see them anyways. To place it just enter into 
                          edit state and press on the cell in the employee row. 
                          To remove it, hover again over the cell and you will 
                          see the removable red mark. Click to remove. 
                          To exit from edit state just click tool icon again."
                  />
                </div>
              </div> ) : null}
              <div className={styles.generalBlock}>
                <Checkbox
                  onChange={handleInputChange}
                  checked={values['start_finish']}
                  label={t('Show start/finish in month view')}
                  name='start_finish'
                />
                <div className={styles.tooltipBlock}>
                  <Tooltip
                    placement='bottom'
                    title="Show start/finish in month view"
                  />
                </div>
              </div>
              <div className={styles.generalBlock}>
                <Checkbox
                  onChange={handleInputChange}
                  checked={values['remove_timelines']}
                  label={t('Remove timelines in week view')}
                  name='remove_timelines'
                />
                <div className={styles.tooltipBlock}>
                  <Tooltip
                    placement='bottom'
                    title="Remove timelines in week view"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
};

export default ToolsButton;
