import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import classes from '../timeoff.module.scss';
import RemoveTimeOff from '../../../Core/Dialog/RemoveTimeOff';
import RemovePolicy from '../../../Core/Dialog/RemovePolicy';
import PoliciesTable from './PoliciesTable';
import PoliciesDetails from './PoliciesDetails';
import CardItem from '../../../Core/CardItem/CardItem';
import CardItemAdd from '../../../Core/CardItemAdd/CardItemAdd';
import {Tooltip as ReactTooltip} from 'react-tooltip';

function TimeOffBlock({
  time_offs = [],
  activeTimeOff = {},
  activePolicy = {},
  setActiveTimeOff = Function.prototype,
  createNewTimeOff = Function.prototype,
  setActivePolicy = Function.prototype,
  createNewPolicy = Function.prototype,
  onEditPolicy = Function.prototype,
  onDeletePolicy = Function.prototype,
  onDuplicatePolicy = Function.prototype,
  handleEditPolicy = Function.prototype,
  handleEditPolicyEmployees = Function.prototype,
  handleUsersDataManagement = Function.prototype,
  remove = Function.prototype,
  loading = false,
  setEditVisible = Function.prototype,
  policies = [],
  employees = [],
  groups = [],
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [removePolicyVisible, setRemovePolicyVisible] = useState(false);
  
  return (
    <div className={classes.timeoff}>
      <>
        {/* create new */}
        <CardItemAdd
          itemName='Policy Type'
          descriptionName={'Create a new time off policy type'}
          onClick={createNewTimeOff}
          tall={true}
        />
        {/* roles board */}
        {
          time_offs.map((time_off) => (
            <React.Fragment key={time_off.id + time_off.name}>
              <CardItem
                id={time_off.id}
                item={time_off}
                onClick={setActiveTimeOff}
                onClickEdit={setEditVisible}
                onClickAddPolicy={createNewPolicy}
                onClickRemove={setRemoveVisible}
                name={time_off.name}
                userCount={time_off.count_users}
                policiesCount={time_off.count_policies}
                selected={time_off.id === activeTimeOff.id}
                canDelete={true}
                itemName='Policy Type'
                ariaLabel='user policy type'
                descriptionCount='users have this policy type'
                descriptionPolicies='active policies'
                additionalDescription={'Measured in ' + (time_off.unit === 'days' ? t('days') : t('hours'))}
                description={time_off.description || ''}
              />
              {/* Time off details */}
              {
                activeTimeOff?.id === time_off.id && (
                  <div className={classes.details}>
                    <PoliciesTable
                      createNewPolicy={createNewPolicy}
                      activeTimeOff={activeTimeOff}
                      activePolicy={activePolicy}
                      loading={loading}
                      policies={policies}
                      onEditPolicy={onEditPolicy}
                      onDeletePolicy={setRemovePolicyVisible}
                      onDuplicatePolicy={onDuplicatePolicy}
                      onClickPolicy={setActivePolicy}
                    />
                    { activePolicy?.id && (
                      <PoliciesDetails
                        activePolicy={activePolicy}
                        handleEditPolicy={handleEditPolicy}
                        handleEditPolicyEmployees={handleEditPolicyEmployees}
                        handleUsersDataManagement={handleUsersDataManagement}
                        employees={employees}
                        groups={groups}
                      />
                    )}
                  </div>
                )
              }
            </React.Fragment>
          ))
        }
        <RemoveTimeOff
          open={!!removeVisible}
          handleClose={() => setRemoveVisible(false)}
          title={t('Delete Policy Type')}
          name={removeVisible.name}
          buttonTitle={t('Delete')}
          remove={() => remove(removeVisible.id)}
        />
        <RemovePolicy
          open={!!removePolicyVisible}
          handleClose={() => setRemovePolicyVisible(false)}
          title={t('Delete Policy')}
          name={policies?.find((policy) => policy.id === removePolicyVisible)?.name}
          buttonTitle={t('Delete')}
          remove={() => onDeletePolicy(removePolicyVisible)}
        />
        <ReactTooltip
          id='timeoff_description'
          className={classes.tooltip}
          effect='solid'
        />
      </>
    </div>
  );
}

export default TimeOffBlock;
