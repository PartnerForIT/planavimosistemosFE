import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
function EventsBlock({
  events = [],
  eventsTypes = [],
  activeEvent = {},
  setActiveEvent = Function.prototype,
  createNewEvent = Function.prototype,
  changeDefaultEvent = Function.prototype,
  remove = Function.prototype,
  loading = false,
  setEditVisible = Function.prototype,
  employees = [],
  groups = [],
  onUpdateEvent = Function.prototype,
}) {
  const { t } = useTranslation();
  const [removeVisible, setRemoveVisible] = useState(false);
  const [disable, setDisable] = useState([]);
  const permissions = usePermissions(permissionsConfig);

  return (
    <div className={classes.roles}>
      <>
        {/* create new */}
        {
          permissions.events_create && (
            <CardItemAdd
              itemName='event'
              onClick={createNewEvent}
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
                onClick={setActiveEvent}
                onClickEdit={setEditVisible}
                onClickRemove={setRemoveVisible}
                onChangeDefault={changeDefaultEvent}
                isDefault={event.default}
                name={event.name}
                userCount={event.assign_employees?.length}
                selected={event.id === activeEvent.id}
                itemName='event'
                ariaLabel='event'
                descriptionCount='users in this event'
              />
              {/* Role details */}
              {
                activeEvent?.id === event.id && (
                  <EventDetails
                    eventsTypes={eventsTypes}
                    activeEvent={activeEvent}
                    loading={loading}
                    employees={employees}
                    groups={groups}
                    disable={disable}
                    setDisable={setDisable}
                    onUpdateEvent={onUpdateEvent}
                  />
                )
              }
            </React.Fragment>
          ))
        }
        <RemoveRole
          open={!!removeVisible}
          handleClose={() => setRemoveVisible(false)}
          title={t('Delete event')}
          name={removeVisible.name}
          buttonTitle={t('Delete')}
          remove={() => remove(removeVisible.id)}
        />
      </>
    </div>
  );
}

export default EventsBlock;
