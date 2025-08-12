import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import TimeOffIcon from '../../Icons/TimeOff';
import TitleBackIcon from '../../Icons/TitleBackIcon';
import ArrowRightButton from '../../Icons/ArrowRightButton';
import GrownuAdminAvatar from '../../Icons/GrownuAdminAvatar';
import GrownuSystemAvatar from '../../Icons/GrownuSystemAvatar';
import avatar from '../../Icons/avatar.png';
import useCompanyInfo from '../../../hooks/useCompanyInfo';
import EditIconFixedFill from '../../Icons/EditIconFixedFill';
import DeleteIcon from '../../Icons/DeleteIcon';
import RemoveActivity from '../../Core/Dialog/RemoveActivity';
import EditActivity from '../../Core/Dialog/EditActivity';

import classes from './timeoff.module.scss';
import Label from '../../Core/InputLabel';
import Switch from 'react-switch';
import classnames from 'classnames';
import {Tooltip as ReactTooltip} from 'react-tooltip';
import moment from 'moment';


function EmployeeActivity({
  handleClose,
  activeTimeOff,
  activePolicy,
  employee,
  activities,
  onRemoveActivity,
  onEditActivity,
}) {
  const { getDateFormat } = useCompanyInfo();
  const formatDate = getDateFormat({
    'YY.MM.DD': 'yyyy.MM.DD',
    'DD.MM.YY': 'DD.MM.yyyy',
    'MM.DD.YY': 'MM.DD.yyyy',
  });
  
  const { t } = useTranslation();
  const [exclRejectedRequests, setExclRejectedRequests] = useState(true);
  const currentYear = new Date().getFullYear();
  const [expandedCycles, setExpandedCycles] = useState([currentYear]);
  const [removeActivityVisible, setRemoveActivityVisible] = useState(false);
  const [editActivityVisible, setEditActivityVisible] = useState(false);
  
  const cycleYears = [];
  const startYear = new Date(activePolicy.created_at).getFullYear();
  for (let year = startYear; year <= currentYear; year++) {
    cycleYears.push(year);
  }

  const expandCycle = (year) => {
    setExpandedCycles((prev) => {
      if (prev.includes(year)) {
        return prev.filter((item) => item !== year);
      } else {
        return [...prev, year];
      }
    });
  };  

  const renderWho = (activity) => {
    switch (activity.who) {
      case 'employee':
        return <div>
            <div className={classes.avatarBlock} data-tooltip-html={`${activity?.creator?.name} ${activity?.creator?.surname}`} data-tooltip-id='emp_name'>
              <img
                src={activity?.creator?.photo || avatar}
                alt='avatar'
                className={classes.avatar}
              />
            </div>
          </div>;
      case 'admin':
        return <div className={classes.inlineBlock} data-tooltip-html={t('Grownu system')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>;
      case 'system':
        return <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuSystemAvatar /></div>;
      default:
        return null;
    }
  };

  const renderActivityType = (activity) => {
    switch (activity.type) {
      case 'init':
        return <div><div>{t('Assigned to Policy')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      case 'manual':
        return <div>{t('Balance Adjustment')}</div>
      case 'request_behalf_pending':
      case 'request_behalf_approved':
      case 'request_behalf_rejected':
        return <div><div>{t('Request')}</div><div className={classes.dateGray}>{activity.requested_from} - {activity.requested_to}</div></div>;
      case 'accrue':
        return <div><div>{t('Accrue')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      case 'child_care':
        return <div><div>{t('Child Care')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      case 'child_care_expired':
        return <div><div>{t('Child Care Expired')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      case 'carryover_move':
      case 'carryover_expired':
        return <div><div>{t('Carryover')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      case 'carryover':
        return <div><div>{t('Carryover')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      case 'imported':
        return <div><div>{t('Imported')}</div><div className={classes.dateGray}>{activity.created_at}</div></div>;
      default:
        return null;
    }
  };

  const renderAction = (activity) => {
    if (activity.type === 'manual') {
      return <div><div>{t('Adjusted')}</div><div className={classes.dateGray}>{activity.created_at} {activity.created_at_time}</div></div>;
    }

    if (activity.type === 'imported') {
      return <div><div>{t('Imported')}</div><div className={classes.dateGray}>{activity.created_at} {activity.created_at_time}</div></div>;
    }

    if (activity.type === 'request_behalf_pending' || activity.type === 'request_behalf_approved' || activity.type === 'request_behalf_rejected') {
      return <div><div>{t('Requested')}</div><div className={classes.dateGray}>{activity.created_at} {activity.created_at_time}</div></div>;
    }

    if (activity.type === 'carryover') {
      return <div><div>{t('Carryover')}</div><div className={classes.dateGray}>{activity.created_at} / {activity.created_at_time}</div></div>;
    }

    if (activity.type === 'carryover_expired') {
      return <div><div>{t('Expired')}</div><div className={classes.dateGray}>{activity.created_at} / {activity.created_at_time}</div></div>;
    }

    return null;
  };

  const renderApprover = (activity) => {
    if (activity.type === 'request_behalf_pending' || activity.type === 'request_behalf_approved' || activity.type === 'request_behalf_rejected') {
      switch (activity.type) {
        case 'request_behalf_approved':
          return <div className={classes.approverBlock}>
            {!activity.approved_1 && !activity.approved_2 ? (
                <>
                  <div className={classes.inlineBlock} data-tooltip-html={t('Grownu system')} data-tooltip-id='emp_name'><GrownuSystemAvatar /></div>
                  <span className={classnames(classes.approverStatus, classes.approverStatusApproved)}>{t('Auto Approved')}</span>
                </>
              ) : (
                <>
                  {activity.approved_1 ? (
                    activity.approved_1.id === 'admin' ? (
                      <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
                    ) : (
                      <div className={classes.approverAvatar} data-tooltip-html={`${activity?.approved_1?.name} ${activity?.approved_1?.surname}`} data-tooltip-id='emp_name'>
                        <img
                          src={activity.approved_1.photo || avatar}
                          alt='approver'
                          className={classes.avatar}
                        />
                      </div>
                    )
                  ) : null}
                  {activity.approved_2 ? (
                    activity.approved_2.id === 'admin' ? (
                      <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
                    ) : (
                      <div className={classes.approverAvatar} data-tooltip-html={`${activity?.approved_2?.name} ${activity?.approved_2?.surname}`} data-tooltip-id='emp_name'>
                        <img
                          src={activity.approved_2.photo || avatar}
                          alt='approver'
                          className={classes.avatar}
                        />
                      </div>
                    )
                  ) : null}
                  <span className={classnames(classes.approverStatus, classes.approverStatusApproved)}>{t('Approved')}</span>
                </>
              )}
          </div>;
        case 'request_behalf_rejected':
          return <div>
              <div className={classes.approverBlock}>
              {activity.rejected_by ? (
                activity.rejected_by.id === 'admin' ? (
                  <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
                ) : (
                  <div className={classes.approverAvatar} data-tooltip-html={`${activity?.rejected_by?.name} ${activity?.rejected_by?.surname}`} data-tooltip-id='emp_name'>
                    <img
                      src={activity.rejected_by.photo || avatar}
                      alt='approver'
                      className={classes.avatar}
                    />
                  </div>
                )
              ) : null}
              <span className={classnames(classes.approverStatus, classes.approverStatusRejected)}>{t('Rejected')}</span>
            </div>
            <div className={classes.dateGray}>
              {activity.rejected_at} / {activity.rejected_at_time}
            </div>
          </div>;
        case 'request_behalf_pending':
          return <div className={classes.approverBlock}>
            {activity.approved_1 ? (
              activity.approved_1.id === 'admin' ? (
                <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
              ) : (
                <div className={classes.approverAvatar} data-tooltip-html={`${activity?.approved_1?.name} ${activity?.approved_1?.surname}`} data-tooltip-id='emp_name'>
                  <img
                    src={activity.approved_1.photo || avatar}
                    alt='approver'
                    className={classes.avatar}
                  />
                </div>
              )
            ) : 
              (activity.approver_1 ? (
                activity.approver_1.id === 'admin' ? (
                  <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
                ) : (
                  <div className={classnames(classes.approverAvatar, classes.approverAvatarPending)} data-tooltip-html={`${activity?.approver_1?.name} ${activity?.approver_1?.surname}`} data-tooltip-id='emp_name'>
                    <img
                      src={activity.approver_1.photo || avatar}
                      alt='approver'
                      className={classes.avatar}
                    />
                  </div>
                )
              ) : null)
            }
            {activity.approved_2 ? (
              activity.approved_2.id === 'admin' ? (
                <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
              ) : (
                <div className={classes.approverAvatar} data-tooltip-html={`${activity?.approved_2?.name} ${activity?.approved_2?.surname}`} data-tooltip-id='emp_name'>
                  <img
                    src={activity.approved_2.photo || avatar}
                    alt='approver'
                    className={classes.avatar}
                  />
                </div>
              )
            ) : 
              (activity.approver_2 ? (
                activity.approver_2.id === 'admin' ? (
                  <div className={classes.inlineBlock} data-tooltip-html={t('Grownu support')} data-tooltip-id='emp_name'><GrownuAdminAvatar /></div>
                ) : (
                  <div className={classnames(classes.approverAvatar, classes.approverAvatarPending)} data-tooltip-html={`${activity?.approver_2?.name} ${activity?.approver_2?.surname}`} data-tooltip-id='emp_name'>
                    <img
                      src={activity.approver_2.photo || avatar}
                      alt='approver'
                      className={classes.avatar}
                    />
                  </div>
                )
              ) : null)
            }
            <span className={classnames(classes.approverStatus, classes.approverStatusPending)}>{t('Pending')}</span>
          </div>;
        default:
          return null;
      }
            
    }

    return null;
  };

  const renderChanged = (activity) => {
    if (activity.type === 'manual'
      || activity.type === 'imported'
      || activity.type === 'request_behalf_pending'
      || activity.type === 'request_behalf_approved'
      || activity.type === 'request_behalf_rejected'
      || activity.type === 'accrue'
      || activity.type === 'child_care'
      || activity.type === 'child_care_expired'
      || activity.type === 'carryover'
      || activity.type === 'carryover_expired') {
      return (
        <div>
          {activity.changed ? (
            <span className={classnames(classes.changeValue, {
              [classes.increase]: activity.adjustment_type === 'increase',
              [classes.decrease]: activity.adjustment_type === 'decrease',
              [classes.grayValue]: activity.type === 'request_behalf_pending' || activity.type === 'request_behalf_rejected',
            })}>
              {activity.adjustment_type === 'increase' ? '+' : '-'}{activity.changed}
            </span>
          ) : null}
        </div>
      );
    }
  }

  const calculateTotalBooked = (year) => {
    return activities.reduce((total, activity) => {
      //past approved
      if (activity.type === 'request_behalf_approved' && new Date(activity.created_at).getFullYear() === year && moment(activity.requested_to, formatDate).isBefore(moment())) {
        return total + (activity.changed || 0);
      }
      return total;
    }, 0);
  };

  const calculateTotalTaken = (year) => {
    return activities.reduce((total, activity) => {
      //featture approved
      if (activity.type === 'request_behalf_approved' && new Date(activity.created_at).getFullYear() === year && moment(activity.requested_to, formatDate).isAfter(moment())) {
        return total + (activity.changed || 0);
      }
      return total;
    }, 0);
  };

  const calculateTotalAccrued = (year) => {
    if (activePolicy.allowance_type === 'unlimited') {
      return '∞';
    }
    
    return activities.reduce((total, activity) => {
      if (activity.type === 'accrue' && new Date(activity.created_at).getFullYear() === year) {
        return total + (activity.changed || 0);
      }
      return total;
    }, 0);
  };

  const removeActivityTitle = (activity) => {
    switch (activity.type) {
      case 'manual':
        return t('Delete Balance Adjustment');
      case 'request_behalf_pending':
      case 'request_behalf_approved':
      case 'request_behalf_rejected':
        return t('Delete Request');
      default:
        return t('Delete Activity');
    }
  }

  const editActivityTitle = (activity) => {
    switch (activity.type) {
      case 'manual':
        return t('Adjust Balance');
      case 'request_behalf_pending':
      case 'request_behalf_approved':
      case 'request_behalf_rejected':
        return t('Adjust Request');
      default:
        return t('Adjust Activity');
    }
  }

  const editRow = (activity) => {
    setEditActivityVisible(activity);
  }

  const removeRow = (activity) => {
    setRemoveActivityVisible(activity);
  }
  
  return (
    <>
      <TitleBlock
        title={`${activeTimeOff.name} / ${activePolicy.name} / ${t('balance activity')}`}
        >
        <TimeOffIcon viewBox='0 0 26 26' fill='rgba(226,235,244,0.85)' />
        <div
          className={classes.titleBackButton}
          onClick={handleClose}
          data-tooltip-html={t('Back')} data-tooltip-id='back_button'
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
                  onChange={(checked) => setExclRejectedRequests(checked)}
                  offColor='#808F94'
                  onColor='#0085FF'
                  uncheckedIcon={false}
                  checkedIcon={false}
                  checked={exclRejectedRequests}
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
                  { isExpanded && <div className={classes.cycleTitleInfo}><b>{t('Total')}:</b> {t('Booked')}: <b>{calculateTotalBooked(year)}</b>, {t('Taken')}: <b>{calculateTotalTaken(year)}</b>, {t('Accrued')}: <b>{calculateTotalAccrued(year)}</b></div> }
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
                        ((!exclRejectedRequests || activity.type !== 'request_behalf_rejected') &&
                          (moment(activity.created_at, formatDate).format('YYYY') === String(year))) &&
                          <React.Fragment key={activity.id}>
                            <div key={activity.id} className={classnames(classes.cyclesTableRow, { [classes.haveActions]: activity.type === 'manual' || activity.type === 'request_behalf_pending' || activity.type === 'request_behalf_approved' || activity.type === 'request_behalf_rejected' })}>
                              <div className={classes.cyclesTableCol}>
                                {renderWho(activity)}
                              </div>
                              <div className={classes.cyclesTableCol}>
                                {renderActivityType(activity)}
                              </div>
                              <div className={classes.cyclesTableCol}>
                                {renderAction(activity)}
                              </div>
                              <div className={classes.cyclesTableCol}>
                                {renderApprover(activity)}
                              </div>
                              <div className={classes.cyclesTableCol}>
                                {renderChanged(activity)}
                              </div>
                              <div className={classes.cyclesTableCol}>
                                {activity.balance_after}
                              </div>

                              { (activity.type === 'manual' || activity.type === 'request_behalf_pending' || activity.type === 'request_behalf_approved' || activity.type === 'request_behalf_rejected') && (
                                <div className={classes.cyclesTableHover}>
                                  <div className={classes.cyclesTableHoverActions}>
                                    <div className={classes.cyclesTableHoverAction}>
                                      <button onClick={() => editRow(activity)} data-tooltip-html={t('Edit')} data-tooltip-id="back_button">
                                        <EditIconFixedFill className={classes.iconButtonRow} />
                                      </button>
      
          
                                    </div>
                                      <div className={classes.cyclesTableHoverAction}>
                                        <div data-tooltip-html={t('Delete')} data-tooltip-id="back_button">
                                          <button onClick={() => removeRow(activity)} >
                                            <DeleteIcon fill='#fd0d1b' className={classes.iconButtonRow} />
                                          </button>
                                        </div>
                                      </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
            })
          ) : null
        }
        <ReactTooltip
          id='emp_name'
          effect='solid'
          className={classes.tooltip_emp}
        />
        <ReactTooltip
          id='back_button'
          effect='solid'
          className={classes.tooltip_back}
        />
        <RemoveActivity
          open={!!removeActivityVisible}
          handleClose={() => setRemoveActivityVisible(false)}
          title={removeActivityTitle(removeActivityVisible)}
          buttonTitle={t('Delete')}
          remove={() => onRemoveActivity(removeActivityVisible)}
        />
        <EditActivity
          open={!!editActivityVisible}
          handleClose={() => setEditActivityVisible(false)}
          title={editActivityTitle(editActivityVisible)}
          buttonTitle={t('Adjust')}
          submit={(data) => onEditActivity(editActivityVisible, data)}
          currentBalance={editActivityVisible.changed * (editActivityVisible.adjustment_type === 'increase' ? 1 : -1)}
        />
      </PageLayout>
    </>
  );
}

export default EmployeeActivity;
