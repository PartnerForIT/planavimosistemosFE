import React from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';

import StyledCheckbox from '../../../Core/Checkbox/Checkbox';
import { validateEmail } from '../../../Helpers/emailValidation';
import Content from './Content';
import classes from '../Events.module.scss';

export default React.memo(({
  handleChangeCheckbox,
  handleChangeValue,
  values,
}) => {
  const { t } = useTranslation();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (validateEmail(e.target.value)) {
        handleChangeValue({
          manager_email: [
            ...(values.manager_email || []),
            e.target.value,
          ],
        });
        e.target.value = '';
      }
    }
  };
  const handleDeleteEmail = (email) => {
    handleChangeValue({
      manager_email: values.manager_email.filter((item) => item !== email),
    });
  };
  
  return (
    <Content tooltip='Tooltip' title={t('Event Action')}>
      { values.event_type_id == 9 || values.event_type_id == 10 ? (
        <StyledCheckbox
          label={t('Push notification in APP')}
          id='notification_push'
          onChange={handleChangeCheckbox}
          checked={!!values.notification_push}
          paddingRoot='5px 5px 5px 0px'
        />
        ) : null }

      <StyledCheckbox
        label={t('Notify in Application')}
        id='notification_app'
        onChange={handleChangeCheckbox}
        checked={!!values.notification_app}
        paddingRoot='5px 5px 5px 0px'
      />

      <StyledCheckbox
        label={t('Notify by e-mail')}
        id='notification_email'
        onChange={handleChangeCheckbox}
        checked={!!values.notification_email}
        paddingRoot='5px 5px 5px 0px'
      />
      {
        !!values.notification_email && (
          <div className={classes.recipients}>
            <div className={classes.recipients__title}>
              {t('Recipients')}
            </div>
            <div className={classes.recipients__block}>
              {
                values.manager_email?.map((item) => (
                  <Tooltip
                    classes={{
                      tooltip: classes.recipients__block__popper,
                      arrow: classes.recipients__block__arrow,
                    }}
                    title={item}
                    placement='left'
                    arrow
                    key={item}
                    // leaveDelay={50000}
                  >
                    <div className={classes.recipients__block__email}>
                      <button
                        className={classes.recipients__block__email__delete}
                        onClick={() => {
                          handleDeleteEmail(item);
                        }}
                      >
                        <CloseIcon />
                      </button>
                      <span className={classes.recipients__block__email__text}>
                        {item}
                      </span>
                    </div>
                  </Tooltip>
                ))
              }
              <input className={classes.recipients__block__input} onKeyDown={handleKeyDown} />
            </div>
          </div>
        )
      }
    </Content>
  );
});
