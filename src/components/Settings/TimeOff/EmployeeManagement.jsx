import React, { useState, useEffect } from 'react';
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
import TimeOffSymbol1 from '../../Icons/TimeOffSymbol1';
import TimeOffSymbol2 from '../../Icons/TimeOffSymbol2';
import TimeOffSymbol3 from '../../Icons/TimeOffSymbol3';
import TimeOffSymbol4 from '../../Icons/TimeOffSymbol4';
import TimeOffSymbol5 from '../../Icons/TimeOffSymbol5';
import TimeOffSymbol6 from '../../Icons/TimeOffSymbol6';
import TimeOffSymbol7 from '../../Icons/TimeOffSymbol7';
import TimeOffSymbol8 from '../../Icons/TimeOffSymbol8';
import TimeOffSymbol9 from '../../Icons/TimeOffSymbol9';

import ReactTooltip from 'react-tooltip';

function EmployeeManagement({
  handleClose,
  activeTimeOff,
  activePolicy,
  employee,
  requestBehalf,
  policies,
  onRequestBehalf,
  onChangeRequestStatus = Function.prototype,
}) {
  const { t } = useTranslation();
  const [requestBehalfOpen, setRequestBehalfOpen] = useState(false);
  const [requestBehalfEditOpen, setRequestBehalfEditOpen] = useState(null);
  const requests = Array.isArray(requestBehalf) ? requestBehalf : [];
  const policiesArray = Array.isArray(policies) ? policies.filter((policy) => policy.employees.find((emp) => emp.id === employee.id)) : [];

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <>
      <TitleBlock
        title={`${activeTimeOff.name} / ${activePolicy.name}`}
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

        <div className={classes.container}>
          <div className={classes.containerTitle}>
            {t('Upcoming requests')}
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
                        <Button
                          className={classes.buttonEdit}
                          size="little"
                          onClick={() => {
                            setRequestBehalfEditOpen(request)
                          }}
                        >
                          <EditIconFixedFill />
                        </Button>
                        { request.status !== 'approved' && (
                          <Button
                            className={classes.buttonApprove}
                            size="little"
                            onClick={() => {onChangeRequestStatus(request.id, 'approved')}}
                          >
                            <CheckIcon />
                          </Button>
                        )}
                        { request.status !== 'rejected' && (
                          <Button
                            className={classes.buttonReject}
                            size="little"
                            onClick={() => {onChangeRequestStatus(request.id, 'rejected')}}
                          >
                            <RejectIcon />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null
          }   
        </div>

        <div className={classes.container}>
          <div className={classes.containerTitle}>
            {t(' Policies')}
          </div>
          {
            policiesArray.length > 0 ? (
              <div className={classes.policiesTable}>
                <div className={classes.policiesTableHeader}>
                  <div className={classes.policiesTableHeaderCol}>
                    {t('Policy')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                    {t('Current cycle')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                    {t('Cycle allowance')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                    {t('Accrued')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                    {t('Taken')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                    {t('Balance')}
                  </div>
                </div>
                {policiesArray.map((policy) => (
                  <div key={policy.id} className={classes.policiesTableRow}>
                    <div className={classes.policiesTableCol}>
                      <div className={classes.tableName}>
                        { (policy.ready && policy.symbol && policy.color) ? (
                          <span className={classes.tableSymbol} style={{ backgroundColor: policy.color }}>
                            {policy.symbol === '1' && <TimeOffSymbol1 />}
                            {policy.symbol === '2' && <TimeOffSymbol2 />}
                            {policy.symbol === '3' && <TimeOffSymbol3 />}
                            {policy.symbol === '4' && <TimeOffSymbol4 />}
                            {policy.symbol === '5' && <TimeOffSymbol5 />}
                            {policy.symbol === '6' && <TimeOffSymbol6 />}
                            {policy.symbol === '7' && <TimeOffSymbol7 />}
                            {policy.symbol === '8' && <TimeOffSymbol8 />}
                            {policy.symbol === '9' && <TimeOffSymbol9 />}
                          </span>
                        ) : null }
                        {policy.name}
                      </div>
                    </div>
                    <div className={classes.policiesTableCol}>
                      
                    </div>
                    <div className={classes.policiesTableCol}>
                      
                    </div>
                    <div className={classes.policiesTableCol}>

                    </div>
                    <div className={classes.policiesTableCol}>
                      
                    </div>
                    <div className={classes.policiesTableCol}>
                      
                    </div>
                  </div>
                ))}
              </div>
            ) : null
          }
        </div>
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
        policies={activeTimeOff.policies}
        initialValue={{policy_id: activePolicy.id, ...requestBehalfEditOpen}}
      />
      <ReactTooltip
        id='back_button'
        effect='solid'
        className={classes.tooltip_back}
      />
    </>
  );
}

export default EmployeeManagement;
