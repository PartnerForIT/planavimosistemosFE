import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getWorkTime } from '../store/worktime/actions';
import { getSchedule } from '../store/schedule/actions';

/**
 * Hook to handle notification actions for refreshing data
 * Components can use this hook to automatically refresh their data
 * when notifications without messages are received
 */
export const useNotificationActions = () => {
  const dispatch = useDispatch();
  const { id: companyId } = useParams();

  useEffect(() => {
    const handleNotificationAction = (event) => {
      const { type, data, action } = event.detail;
      
      switch (action) {
        case 'refresh-worktime':
          // Refresh worktime/logbook data
          if (companyId) {
            // Get current date range for worktime query
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            
            const queryObj = {
              from_date: startOfWeek.toISOString().split('T')[0],
              to_date: endOfWeek.toISOString().split('T')[0],
              employees: [],
              places: [],
              job_types: [],
              skills: [],
              custom_categories: []
            };
            
            dispatch(getWorkTime(companyId, queryObj));
          }
          break;
          
        case 'refresh-events':
          // Refresh schedule/events data
          if (companyId) {
            const today = new Date();
            const fromDate = today.toISOString().split('T')[0];
            
            dispatch(getSchedule({
              companyId,
              timeline: 'week',
              fromDate,
              firstLoading: false
            }));
          }
          break;
          
        case 'refresh-data':
          // Generic data refresh - could be customized based on notification type
          console.log('Generic data refresh triggered for notification type:', type);
          break;
          
        default:
          console.log('Unknown notification action:', action);
          break;
      }
    };

    // Listen for notification action events
    window.addEventListener('notification-action', handleNotificationAction);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('notification-action', handleNotificationAction);
    };
  }, [dispatch, companyId]);
};

export default useNotificationActions;
