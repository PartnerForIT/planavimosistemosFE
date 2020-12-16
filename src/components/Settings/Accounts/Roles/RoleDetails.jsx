import React, { useEffect } from 'react';
import classes from './Roles.module.scss';
import Progress from '../../../Core/Progress';

function RoleDetails({ activeRole, loading, loadRoleDetails }) {
  useEffect(() => {
    loadRoleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={classes.details}>
      {
        loading && <Progress />
      }
      {
        // TODO: details
        JSON.stringify(activeRole, null, 2)
      }
      <div />
    </div>
  );
}

export default RoleDetails;
