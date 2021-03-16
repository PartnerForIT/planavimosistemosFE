import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import classes from '../Events.module.scss';
import RemoveRole from '../../../Core/Dialog/RemoveRole';
import CardItemAdd from '../../../Core/CardItemAdd/CardItemAdd';
import CardItem from '../../../Core/CardItem/CardItem';
import EventDetails from '../EventDetails';
import usePermissions from '../../../Core/usePermissions';

const permissionsConfig = [
  {
    name: 'events_create',
    permission: 'events_create',
  },
];
function RolesBlock({
  events = [],
  eventsTypes = [],
  activeEvent = {},
  setActiveRole = () => ({}),
  createNewRole = () => ({}),
  remove = () => ({}),
  loading = false,
  setEditVisible = () => ({}),
  // availableDetails = [],
  employees = [],
  groups = [],
  roleEmployeesEdit = () => ({}),
  rolesPermissionsEdit = () => ({}),
  permissions: allPermissions,
  permissionsIds,
  removeRolesPermissions,
  defaultRoleAccess = {},
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [roleAccess, setRoleAccess] = useState(defaultRoleAccess);
  const [disableReady, setDisableReady] = useState(false);
  const [disable, setDisable] = useState([]);
  const permissions = usePermissions(permissionsConfig);

  useEffect(() => {
    const { moduleAccess } = roleAccess;
    if (moduleAccess && permissionsIds) {
      const disabled = Object.keys(moduleAccess)?.map((key) => {
      // eslint-disable-next-line no-underscore-dangle
        const _inner = moduleAccess[key];
        if (!_inner.enabled) {
          return Object.keys(_inner.options)?.map((opt) => permissionsIds?.[key]?.[opt]);
        }
        return null;
      }).filter((item) => !!item);
      if (disableReady) {
        const dis = _.flatten(disabled);
        setDisable(dis);
        setDisableReady(false);
        removeRolesPermissions(dis);
      }
    }
  }, [disableReady, permissionsIds, removeRolesPermissions, removeVisible, roleAccess]);

  return (
    <div className={classes.roles}>
      <>
        {/* create new */}
        {
          permissions.events_create && (
            <CardItemAdd
              itemName='event'
              onClick={createNewRole}
            />
          )
        }
        {/* events board */}
        {
          events.map((event) => (
            <React.Fragment key={event.id}>
              <CardItem
                id={event.id}
                item={event}
                onClick={setActiveRole}
                onClickEdit={setEditVisible}
                onClickRemove={setRemoveVisible}
                name={event.name}
                userCount={event.assign_employees?.length}
                selected={event.id === activeEvent.id}
                itemName='event'
                ariaLabel='event'
                descriptionCount='users assigned to this event'
              />
              {/* Role details */}
              {
                activeEvent?.id === event.id && (
                  <EventDetails
                    eventsTypes={eventsTypes}
                    activeEvent={activeEvent}
                    loading={loading}
                    roleAccess={roleAccess}
                    employees={employees}
                    groups={groups}
                    setRoleAccess={setRoleAccess}
                    roleEmployeesEdit={roleEmployeesEdit}
                    rolesPermissionsEdit={rolesPermissionsEdit}
                    permissions={allPermissions}
                    permissionsIds={permissionsIds}
                    setDisableReady={setDisableReady}
                    disable={disable}
                    setDisable={setDisable}
                  />
                )
              }
            </React.Fragment>
          ))
        }
        <RemoveRole
          open={!!removeVisible}
          handleClose={() => setRemoveVisible(false)}
          title={t('Delete role')}
          name={removeVisible.name}
          buttonTitle={t('Delete')}
          remove={() => remove(removeVisible.id)}
        />
      </>
    </div>
  );
}

export default RolesBlock;
