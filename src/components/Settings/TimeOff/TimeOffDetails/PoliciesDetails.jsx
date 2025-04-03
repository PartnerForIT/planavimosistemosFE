import React from 'react';
import classNames from 'classnames';

import classes from '../timeoff.module.scss';
import Users from './Users';
import PolicySettings from './PolicySettings';

function PoliciesDetails({
  activePolicy,
  onEditPolicy,
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
        onEditPolicy={onEditPolicy}
      />
      <PolicySettings
        activePolicy={activePolicy}
        onEditPolicy={onEditPolicy}
      />
    </div>
  );
}

export default PoliciesDetails;
