import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import TimeOffIcon from '../../Icons/TimeOff';
import TitleBackIcon from '../../Icons/TitleBackIcon';
import RequestBehalf from '../../Core/Dialog/RequestBehalf';

import classes from './timeoff.module.scss';
import Button from '../../Core/Button/Button';
import classsnames from 'classnames';
import EditIconFixedFill from '../../Icons/EditIconFixedFill';
import CheckIcon from '../../Icons/CheckIcon';
import RejectIcon from '../../Icons/RejectIcon';

import {Tooltip as ReactTooltip} from 'react-tooltip';
import PoliciesActivityTable from './TimeOffDetails/PoliciesActivityTable';

function EmployeeManagementPolicy({
  goEmployeeActivity,
  onUnassingPolicyEmployees,
  handleClose,
  activeTimeOff,
  activePolicy,
  employee,
  policies,
  requestBehalf,
  onRequestBehalf,
  onChangeRequestStatus = Function.prototype,
}) {
  const { t } = useTranslation();
  const [requestBehalfOpen, setRequestBehalfOpen] = useState(false);
  const [requestBehalfEditOpen, setRequestBehalfEditOpen] = useState(null);
  const requests = Array.isArray(requestBehalf) ? requestBehalf : [];

  return (
    <>
      <TitleBlock
        title={`${activeTimeOff.name} / ${activePolicy.name}`}
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
              <div className={classes.employeeName}>{employee.name} {employee.surname}</div>
              <div className={classes.skillName}>{employee.skills}</div>
            </div>

            <div className={classes.buttonBlock}>
              <Button
                className={classes.button}
                size="large"
                primary
                onClick={() => {
                  setRequestBehalfOpen(true);
                }}
              >
                {t('Request on behalf')}
              </Button>
            </div>
          </div>
        </div>
        {
          requests.length > 0
            ? <div className={classes.container}>
                <div className={classes.containerTitle}>
                  {t('Upcoming requests')} <span style={{color: '#808F94'}}>{requests.length}</span>
                </div>
                {
                  requests.length > 0 ? (
                    <div className={classes.upcomingRequests}>
                      <div className={classes.upcomingRequestsHeader}>
                        <div className={classes.upcomingRequestsHeaderCol}>
                          {t('Request type')}
                        </div>
                        <div className={classes.upcomingRequestsHeaderCol}>
                          {t('When')}
                        </div>
                        <div className={classes.upcomingRequestsHeaderCol}>
                          {t('Requested on')}
                        </div>
                        <div className={classes.upcomingRequestsHeaderCol}>
                          {t('Status')}
                        </div>
                        <div className={classes.upcomingRequestsHeaderCol}></div>
                      </div>
                      {requests.map((request) => (
                        <div key={request.id} className={classes.upcomingRequestsRow}>
                          <div className={classes.upcomingRequestsCol}>
                            {request.time_off_name}
                          </div>
                          <div className={classes.upcomingRequestsCol}>
                            {request.from} - {request.to}
                          </div>
                          <div className={classes.upcomingRequestsCol}>
                            {request.created_at}
                          </div>
                          <div className={classes.upcomingRequestsCol}>
                            <div className={classsnames(classes.upcomingRequestsStatus, {
                              [classes.requestStatusApproved]: request.status === 'approved',
                              [classes.requestStatusPending]: request.status === 'pending',
                              [classes.requestStatusRejected]: request.status === 'rejected',
                              [classes.requestStatusCancelled]: request.status === 'cancelled',
                            })}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </div>
                          </div>
                          <div className={classes.upcomingRequestsCol}>
                            <div className={classes.upcomingRequestsButtons}>
                              <div data-tooltip-html={t("Edit")} data-tooltip-id="tip_request">
                                <Button
                                  className={classes.buttonEdit}
                                  size="little"
                                  onClick={() => {
                                    setRequestBehalfEditOpen(request)
                                  }}
                                >
                                  <EditIconFixedFill />
                                </Button>
                              </div>
                              { request.status !== 'approved' && (
                                <div data-tooltip-html={t("Approve")} data-tooltip-id="tip_request">
                                  <Button
                                    className={classes.buttonApprove}
                                    size="little"
                                    onClick={() => {onChangeRequestStatus(request.id, 'approved')}}
                                  >
                                    <CheckIcon />
                                  </Button>
                                </div>
                              )}
                              { request.status !== 'rejected' && (
                                <div data-tooltip-html={t("Reject")} data-tooltip-id="tip_request">
                                  <Button
                                    className={classes.buttonReject}
                                    size="little"
                                    onClick={() => {onChangeRequestStatus(request.id, 'rejected')}}
                                  >
                                    <RejectIcon />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null
                }   
              </div>
            : null
        }
        <PoliciesActivityTable
          goEmployeeActivity={goEmployeeActivity}
          onUnassingPolicyEmployees={onUnassingPolicyEmployees}
          employee={employee}
        />
      </PageLayout>
      <RequestBehalf
        open={!!(requestBehalfOpen || requestBehalfEditOpen)}
        handleClose={() => {
          setRequestBehalfOpen(false);
          setRequestBehalfEditOpen(null);
        }}
        title={t('Request on behalf')}
        onSubmit={(data) => {
          onRequestBehalf(data, requestBehalfEditOpen?.id);
          setRequestBehalfOpen(false);
          setRequestBehalfEditOpen(null);
        }}
        buttonTitle={t('Submit')}
        employees={[employee]}
        policies={policies}
        initialValue={{policy_id: activePolicy.id, ...requestBehalfEditOpen}}
        activeTimeOff={activeTimeOff}
        singleRequest
      />
      <ReactTooltip
        id='back_button'
        effect='solid'
        className={classes.tooltip_back}
      />
      <ReactTooltip
        id='tip_request'
        effect='solid'
        className={classes.tooltip_back}
      />
    </>
  );
}

export default EmployeeManagementPolicy;
