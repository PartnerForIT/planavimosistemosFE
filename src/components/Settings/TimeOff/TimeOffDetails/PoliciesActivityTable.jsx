import React, { useState } from 'react';

import classes from '../timeoff.module.scss';
import { useTranslation } from 'react-i18next';
import TimeOffSymbol1 from '../../../Icons/TimeOffSymbol1';
import TimeOffSymbol2 from '../../../Icons/TimeOffSymbol2';
import TimeOffSymbol3 from '../../../Icons/TimeOffSymbol3';
import TimeOffSymbol4 from '../../../Icons/TimeOffSymbol4';
import TimeOffSymbol5 from '../../../Icons/TimeOffSymbol5';
import TimeOffSymbol6 from '../../../Icons/TimeOffSymbol6';
import TimeOffSymbol7 from '../../../Icons/TimeOffSymbol7';
import TimeOffSymbol8 from '../../../Icons/TimeOffSymbol8';
import TimeOffSymbol9 from '../../../Icons/TimeOffSymbol9';
import ArrowRightButton from '../../../Icons/ArrowRightButton';
import AlertCircle from '../../../Icons/AlertCircle';
import Button from '../../../Core/Button/Button';
import UnassignEmployee from '../../../Core/Dialog/UnassignEmployee';
import useCompanyInfo from '../../../../hooks/useCompanyInfo';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import {
   policiesSelector,
} from '../../../../store/settings/selectors';

function PoliciesActivityTable({
    goEmployeeActivity,
    onUnassingPolicyEmployees,
    employee,
}) {
    const { getDateFormat } = useCompanyInfo();
    const formatDate = getDateFormat({
      'YY.MM.DD': 'yyyy.MM.DD',
      'DD.MM.YY': 'DD.MM.yyyy',
      'MM.DD.YY': 'MM.DD.yyyy',
    });

    const { t } = useTranslation();
    const policies = useSelector(policiesSelector);
    const [expandedPolicyIds, setExpandedPolicyIds] = useState([]);
    const [unasignVisible, setUnasignVisible] = useState(false);
    const employeePolicies = Array.isArray(policies) ? policies.filter((policy) => policy.employees.find((emp) => emp.id === employee.id)) : [];
    
    const expandPolicy = (policyId) => {
        setExpandedPolicyIds((prev) =>
            prev.includes(policyId)
            ? prev.filter((id) => id !== policyId)
            : [...prev, policyId]
        );
    };

    const handleUnassign = () => {
      onUnassingPolicyEmployees(employee.id, unasignVisible);
      setUnasignVisible(false);
    };

    return (
      <div className={classes.container}>
          <div className={classes.containerTitle}>
          {t(' Policies')}
          </div>
          {
          employeePolicies.length > 0 ? (
              <div className={classes.policiesTable}>
              <div className={classes.policiesTableHeader}>
                  <div className={classes.policiesTableHeaderCol}>
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                  {t('Policy')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                      {!expandedPolicyIds.length && (
                          t('Current cycle')
                      )}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                      {!expandedPolicyIds.length && (
                          t('Cycle allowance')
                      )}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                      {!expandedPolicyIds.length && (
                          t('Accrued')
                      )}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                  {t('Taken')}
                  </div>
                  <div className={classes.policiesTableHeaderCol}>
                  {t('Balance')}
                  </div>
              </div>
              {employeePolicies.map((policy) => {
                  const policyEmployeeDetails = policy.employees.find((emp) => emp.id === employee.id);
                  const isExpanded = expandedPolicyIds.includes(policy.id);

                  return (
                      <React.Fragment key={policy.id}>
                      <div className={classes.policiesTableRow}>
                          <div className={classnames(classes.policiesTableCol, classes.policiesTableColExpand)}>
                          <button
                              type="button"
                              className={classnames(classes.policiesTableExpand, { [classes.active]: isExpanded })}
                              onClick={() => expandPolicy(policy.id)}
                          >
                              <ArrowRightButton />
                          </button>
                          </div>
                          <div className={classes.policiesTableCol}>
                          <div className={classes.tableName}>
                              {(policy.ready && policy.symbol && policy.color) ? (
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
                              ) : null}
                              {policy.name}
                          </div>
                          </div>
                          <div className={classnames(classes.policiesTableCol, classes.policiesTableColGray, classes.nowrap)}>
                              {!expandedPolicyIds.length && (
                                  `${policyEmployeeDetails?.current_cycle_start} - ${policyEmployeeDetails?.current_cycle_end}`
                              )}
                          </div>
                          <div className={classnames(classes.policiesTableCol, classes.policiesTableColGray)}>
                              {!expandedPolicyIds.length && (
                                  policyEmployeeDetails?.cycle_allowance
                              )}
                          </div>
                          <div className={classnames(classes.policiesTableCol, classes.policiesTableColGray)}>
                              {!expandedPolicyIds.length && (
                                  policyEmployeeDetails?.accrued_amount_this_cycle
                              )}
                          </div>
                          <div className={classnames(classes.policiesTableCol, classes.policiesTableColGray)}>
                          {policyEmployeeDetails?.taken_this_cycle}
                          </div>
                          <div className={classnames(classes.policiesTableCol, classes.policiesTableColGray)}>
                          {policyEmployeeDetails?.balance}
                          </div>
                      </div>

                      {isExpanded && (
                          <div className={classes.expandedRow}>
                              <div className={classes.expandedContent}>
                                  <div className={classes.expandedInfo}>
                                      <div>
                                          <strong>{t('Cycle period')}:</strong>
                                          <div>{policyEmployeeDetails?.current_cycle_start} — {policyEmployeeDetails?.current_cycle_end}</div>
                                      </div>
                                      <div>
                                          <strong>{t('Allowance type')}:</strong>
                                          <div>{policyEmployeeDetails.cycle_type_text}</div>
                                      </div>
                                      <div></div>
                                      <div></div>
                                  </div>
                                  <div className={classes.expandedInfo}>
                                      <div>
                                          <strong>{t('Cycle allowance')}:</strong>
                                          <div>{policyEmployeeDetails.cycle_allowance}</div>
                                      </div>
                                      <div>
                                          <strong>{t('Accrued')}:</strong>
                                          <div>{policyEmployeeDetails?.accrued_amount_this_cycle}</div>
                                      </div>
                                      <div>
                                          <strong>{t('Adjusted by admin')}:</strong>
                                          <div>todo</div>
                                      </div>
                                      <div>
                                          <strong>{t('Days booked')}:</strong>
                                          <div>{policyEmployeeDetails.total_booked}</div>
                                      </div>
                                  </div>
                                  <div className={classes.carryoverInfo}>
                                    {
                                      policyEmployeeDetails.carryovers && policyEmployeeDetails.carryovers.length > 0 && (
                                        <div className={classes.carryoverList}>
                                          {policyEmployeeDetails.carryovers.map((carryover) => (
                                            <div key={carryover.id} className={classes.carryoverItem}>
                                              <AlertCircle /> {t("{{days}} days carryover on {{when}} have an expiration date of {{expire}}", { days: carryover.amount, when: carryover.carryover_date, expire: carryover.expire_at })}
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    }
                                  </div>
                                  <div className={classes.actionsRow}>
                                      <div></div>
                                      <div className={classes.actionsRowButtons}>
                                          <Button
                                              onClick={() => { goEmployeeActivity(policy.time_off_id, policy.id, employee.id); }}
                                              primary
                                          >
                                              {t('Activity')}
                                          </Button>
                                          <Button
                                              onClick={() => { setUnasignVisible(policy.id); }}
                                              black
                                          >
                                              {t('Unassign')}
                                          </Button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                      </React.Fragment>
                  );
                  })}
              </div>
          ) : null
          }

          <UnassignEmployee
            title={t('Are you sure?')}
            open={!!unasignVisible}
            handleClose={() => setUnasignVisible(false)}
            buttonTitle={t('Unassign')}
            name={employee.name}
            remove={handleUnassign}
          />
      </div>
    );
}

export default PoliciesActivityTable;
