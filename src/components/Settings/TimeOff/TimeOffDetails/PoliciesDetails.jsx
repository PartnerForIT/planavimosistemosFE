import React from 'react';
import classNames from 'classnames';

import classes from '../timeoff.module.scss';
import Users from './Users';
import PolicySettings from './PolicySettings';

function PoliciesDetails({
  activePolicy,
  handleEditPolicy,
  handleEditPolicyEmployees,
  handleUsersDataManagement,
  employees,
  groups,
}) {

  const detailsClasses = classNames(classes.detailsPolicy, {
  });

  return (
    <div className={detailsClasses}>
      <Users
        employees={employees}
        groups={groups}
        activePolicy={activePolicy}
        handleEditPolicy={handleEditPolicyEmployees}
        handleUsersDataManagement={handleUsersDataManagement}
      />
      <PolicySettings
        activePolicy={activePolicy}
        handleEditPolicy={handleEditPolicy}
      />
    </div>
  );
}

export default PoliciesDetails;
