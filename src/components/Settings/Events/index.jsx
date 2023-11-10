import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import MaynLayout from '../../Core/MainLayout';
import Dashboard from '../../Core/Dashboard';
import TitleBlock from '../../Core/TitleBlock';
import PageLayout from '../../Core/PageLayout';
import Progress from '../../Core/Progress';
import {
  AccountGroupsSelector, employeesSelector,
  eventsLoadingSelector, isShowSnackbar,
  eventUpdateLoadingSelector, snackbarText, snackbarType,
  eventsSelector, eventsTypesSelector,
} from '../../../store/settings/selectors';
import RolesIcon from '../../Icons/RolesIcon';
import EventsBlock from './EventDetails/EventsBlock';
import {
  getAccountGroups,
  loadEmployeesAll,
  postEvent,
  getEvents,
  patchEvent,
  deleteEvent,
} from '../../../store/settings/actions';
import AddEditItem from '../../Core/Dialog/AddEditItem';

const useStyles = makeStyles(() => ({
  error: {
    background: '#de4343',
    color: '#fff',
  },
  success: {
    background: '#3bc39e',
    color: '#fff',
  },
}));

function Events() {
  const { id: companyId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const isLoading = useSelector(eventsLoadingSelector);
  const isSnackbar = useSelector(isShowSnackbar);
  const typeSnackbar = useSelector(snackbarType);
  const textSnackbar = useSelector(snackbarText);
  const events = useSelector(eventsSelector);
  const eventsTypes = useSelector(eventsTypesSelector);
  const isLoadingEventUpdate = useSelector(eventUpdateLoadingSelector);
  const { users: employees } = useSelector(employeesSelector);
  const groups = useSelector(AccountGroupsSelector);
  const [activeEvent, setActiveEvent] = useState({});
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const handleUpdateEvent = (data) => {
    // const data = values;
    dispatch(patchEvent(companyId, activeEvent.id, data));
  };

  useEffect(() => {
    dispatch(loadEmployeesAll(companyId));
    dispatch(getAccountGroups(companyId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getEvents(companyId));
  }, [companyId]);

  const removeRole = (eventId) => {
    dispatch(deleteEvent(companyId, eventId));
  };

  const changeEventName = (eventName) => {
    if (eventName.trim()) {
      dispatch(patchEvent(companyId, activeEvent.id, { name: eventName.trim() }));
      setEditVisible(false);
    }
  };

  const createNewEvent = (eventName) => {
    if (eventName.trim()) {
      dispatch(postEvent(companyId, { name: eventName.trim() }));
      setNewEventOpen(false);
    }
  };

  return (
    <MaynLayout>
      <Dashboard>
        <TitleBlock
          title={t('Events')}
        >
          <RolesIcon />
        </TitleBlock>
        <PageLayout>
          {
            isLoading ? <Progress />
              : (
                <EventsBlock
                  events={events}
                  eventsTypes={eventsTypes ? eventsTypes.map((item) => { return {...item, name: t(item.name)}}) : eventsTypes}
                  activeEvent={activeEvent}
                  setActiveEvent={setActiveEvent}
                  createNewEvent={() => setNewEventOpen(true)}
                  loading={isLoadingEventUpdate}
                  setEditVisible={setEditVisible}
                  employees={employees}
                  groups={groups}
                  remove={removeRole}
                  onUpdateEvent={handleUpdateEvent}
                />
              )
          }
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            ContentProps={{
              classes: {
                root: typeSnackbar === 'error' ? classes.error : classes.success,
              },
            }}
            severity='error'
            open={isSnackbar}
            message={textSnackbar}
            key='right'
          />
          <AddEditItem
            open={editVisible}
            initialValue={activeEvent?.name}
            handleClose={() => {
              setEditVisible(false);
            }}
            title={t('Edit event name')}
            buttonTitle={t('Change name')}
            label={t('Event name')}
            placeholder={t('Enter event name')}
            onSubmit={changeEventName}
          />
          <AddEditItem
            open={newEventOpen}
            handleClose={() => {
              setNewEventOpen(false);
            }}
            title={t('Create a new event')}
            onSubmit={createNewEvent}
            buttonTitle={t('Create event')}
            label={t('Event name')}
            placeholder={t('Enter event name')}
          />
        </PageLayout>
      </Dashboard>
    </MaynLayout>
  );
}

export default Events;
