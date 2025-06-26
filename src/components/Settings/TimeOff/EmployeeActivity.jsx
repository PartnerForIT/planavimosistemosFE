import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import TimeOffIcon from '../../Icons/TimeOff';
import TitleBackIcon from '../../Icons/TitleBackIcon';
import ArrowRightButton from '../../Icons/ArrowRightButton';

import classes from './timeoff.module.scss';
import Label from '../../Core/InputLabel';
import Switch from 'react-switch';
import classnames from 'classnames';


function EmployeeActivity({
  handleClose,
  activeTimeOff,
  activePolicy,
  employee,
}) {
  const { t } = useTranslation();
  const [rejectedRequests, setRejectedRequests] = useState(true);
  const currentYear = new Date().getFullYear();
  const [expandedCycles, setExpandedCycles] = useState([currentYear]);
  
  const cycleYears = [];
  const startYear = new Date(activePolicy.created_at).getFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    cycleYears.push(year);
  }

  const activities = activePolicy.employees.find(emp => emp.id === employee.id)?.activities || [];

  const expandCycle = (year) => {
    setExpandedCycles((prev) => {
      if (prev.includes(year)) {
        return prev.filter((item) => item !== year);
      } else {
        return [...prev, year];
      }
    });
  };  
  
  return (
    <>
      <TitleBlock
        title={`${activeTimeOff.name} / ${activePolicy.name} / ${t('balance activity')}`}
        >
        <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        <div
          className={classes.titleBackButton}
          onClick={handleClose}
          data-tip={t('Back')} data-for='back_button'
        >
          <div>
            <TitleBackIcon />
          </div>
        </div>
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
              <div className={classes.formControlSwhitchLine}>
                <Switch
                  onChange={(checked) => setRejectedRequests(checked)}
                  offColor='#808F94'
                  onColor='#0085FF'
                  uncheckedIcon={false}
                  checkedIcon={false}
                  checked={rejectedRequests}
                  height={21}
                  width={40}
                />
                <div className={classes.tooltipBlock}>
                  <Label text={t('Exclude Rejected requests')} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          cycleYears.length > 0 ? (
            cycleYears.map((year) => {
            const isExpanded = expandedCycles.includes(year);

            return (
              <div key={year} className={classes.cycleContainer}>
                <div className={classes.cycleTitle}>
                  <div className={classes.cycleTitleDates}>
                    <button
                        type="button"
                        className={classnames(classes.policiesTableExpand, { [classes.active]: isExpanded })}
                        onClick={() => expandCycle(year)}
                    >
                        <ArrowRightButton />
                    </button>
                    {t(year === currentYear ? 'Current cycle' : 'Previous Cycle')} <span>{year}.01.01 — {year}.12.31</span>
                  </div>
                  { isExpanded && <div className={classes.cycleTitleInfo}><b>{t('Total')}:</b> {t('Booked')}: <b>todo</b>, {t('Taken')}: <b>todo</b>, {t('Accrued')}: <b>todo</b></div> }
                </div>
                { isExpanded && (
                  <div className={classes.cycleContent}>
                    <div className={classes.cyclesTable}>
                      <div className={classes.cyclesTableHeader}>
                          <div className={classes.cyclesTableHeaderCol}>
                            {t('Who?')}
                          </div>
                          <div className={classes.cyclesTableHeaderCol}>
                            {t('Activity type')}
                          </div>
                          <div className={classes.cyclesTableHeaderCol}>
                            {t('Action')}
                          </div>
                          <div className={classes.cyclesTableHeaderCol}>
                            {t('Approver')}
                          </div>
                          <div className={classes.cyclesTableHeaderCol}>
                            {t('Change')}
                          </div>
                          <div className={classes.cyclesTableHeaderCol}>
                            {t('Balance')}
                          </div>
                      </div>
                      
                      {activities.map((activity) => (
                        <div key={activity.id} className={classes.cyclesTableRow}>
                          <div className={classes.cyclesTableCol}>
                            todo
                          </div>
                          <div className={classes.cyclesTableCol}>
                            todo
                          </div>
                          <div className={classes.cyclesTableCol}>
                            todo
                          </div>
                          <div className={classes.cyclesTableCol}>
                            todo
                          </div>
                          <div className={classes.cyclesTableCol}>
                            {activity.change_type === 'increase' ? '+' : '-'}{(activity.balance_after - activity.balance_before).toFixed(2)}
                          </div>
                          <div className={classes.cyclesTableCol}>
                            {activity.balance_after}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
            })
          ) : null
        }
        
      </PageLayout>
    </>
  );
}

export default EmployeeActivity;
