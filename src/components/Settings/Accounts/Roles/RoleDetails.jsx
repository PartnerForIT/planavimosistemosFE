import React, { useEffect } from 'react';
import classes from './Roles.module.scss';
import Progress from '../../../Core/Progress';

function RoleDetails({
  activeRole,
  loading,
  loadRoleDetails
}) {
  useEffect(() => {
    loadRoleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={classes.details}>
      {
        // loading && <Progress />
      }
      <pre>
        {
          // TODO: details
          JSON.stringify(activeRole, null, 2)
        }
      </pre>
      <div/>
    </div>
  );
}

export default RoleDetails;
