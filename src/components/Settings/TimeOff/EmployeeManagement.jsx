import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import TimeOffIcon from '../../Icons/TimeOff';
import TitleBackIcon from '../../Icons/TitleBackIcon';
import ReactTooltip from 'react-tooltip';
import RequestBehalf from '../../Core/Dialog/RequestBehalf';

import classes from './timeoff.module.scss';
import Button from '../../Core/Button/Button';

function EmployeeManagement({
  handleClose,
  activeTimeOff,
  activePolicy,
  employee,
  onRequestBehalf,
}) {
  const { t } = useTranslation();
  const [requestBehalfOpen, setRequestBehalfOpen] = useState(false);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <>
      <TitleBlock
        title={`${activeTimeOff.name} / ${activePolicy.name}`}
      >
        <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        <Button
          className={classes.titleBackButton}
          onClick={handleClose}
          inline 
        >
          <div data-tip={t('Back')} data-for='back_button'>
            <TitleBackIcon />
          </div>
        </Button>
      </TitleBlock>
      <PageLayout>
        <div className={classes.container}>
          <div className={classes.containerTitle}>
            {t('Employee')}
          </div>
          <div className={classes.employeeBlock}>
            {
              employee.photo && (
                <div className={classes.avatarBlock}>
                  <img
                    src={employee.photo}
                    alt='avatar'
                    className={classes.avatar}
                  />
                </div>
              )
            }
            <div>
              <div className={classes.employeeName}>{employee.name}</div>
              <div className={classes.skillName}>{employee.skills}</div>
            </div>

            <div className={classes.buttonBlock}>
              <Button
                className={classes.button}
                size="large"
                onClick={() => {
                  setRequestBehalfOpen(true);
                }}
              >
                {t('Request on behalf')}
              </Button>
            </div>
          </div>
        </div>

        <div className={classes.container}>
          <div className={classes.containerTitle}>
            {t('Upcoming requests')}
          </div>
        </div>

        <div className={classes.container}>
          <div className={classes.containerTitle}>
            {t(' Policies')}
          </div>
        </div>
      </PageLayout>
      <ReactTooltip
        id='back_button'
        className={classes.selectdisabled__tooltip}
        effect='solid'
        placement='bottom'
      />
      <RequestBehalf
        open={requestBehalfOpen}
        handleClose={() => {
          setRequestBehalfOpen(false);
        }}
        title={t('Request on behalf')}
        onSubmit={(data) => {
          setRequestBehalfOpen(false);
          onRequestBehalf(data);
        }}
        buttonTitle={t('Submit')}
        employees={[employee]}
        policies={activeTimeOff.policies}
        initialValue={{policy_id: activePolicy.id}}
      />
    </>
  );
}

export default EmployeeManagement;
