import React from 'react';
import classes from './Roles.module.scss';
// import Progress from '../../../Core/Progress';
import Users from './RoleDetails/Users';
import AccessModule from './RoleDetails/AccessModule';
import OrganisationAccess from './RoleDetails/OrganisationAccess';

function RoleDetails({
  activeRole,
  loading,
  availableDetails,
  roleAccess,
}) {
  return (
    <div className={classes.details}>
      {
        // loading && <Progress />
      }
      <Users />
      <AccessModule availableDetails={availableDetails} roleAccess={roleAccess} />
      <OrganisationAccess availableDetails={availableDetails} roleAccess={roleAccess} />
      <pre>
        {
          // TODO: details
          JSON.stringify(activeRole, null, 2)
        }
      </pre>
      <div />
    </div>
  );
}

export default RoleDetails;
