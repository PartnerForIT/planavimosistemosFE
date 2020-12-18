import React, { useMemo } from 'react';
import Content from './Content';

function OrganisationAccess({ availableDetails, categoriesNames, roleAccess }) {
  const available = useMemo(() => availableDetails.map((item) => ({ [item.name]: item.action })), [availableDetails]);

  return (
    <Content tooltip='Tooltip' title='Organisation access'>

      {/* Use Managers Mobile View */}
      {/* ???? */}

      {/* Can edit General Settings */}
      {/* pto ~> edit_settings */}

      {/* Can create Groups */}
      {/* groups ~> create */}

      {/* Can create Roles */}
      {/* roles ~> create */}

      {/* Can delete entry data */}
      {/* data ~> delete */}

      {/* Can create Categories */}
      {/* categories ~> create */}

      {/* Can create New accounts */}
      {/* accounts ~> create */}

      {/* Can see & edit Accounts List */}
      {/* ??? */}

      {/* Can delete Accounts list */}
      {/* ??? */}

      {/* Can edit Logbook settings */}
      {/* ??? */}

      {/* Can create Events */}
      {/* events ~> create */}

      {/* Can see Activity Log */}
      {/* activity_log ~> view */}

      <pre>
        {/* {JSON.stringify(roleAccess, null, 2)} */}
        {JSON.stringify(available, null, 2)}
      </pre>
    </Content>
  );
}

export default OrganisationAccess;
