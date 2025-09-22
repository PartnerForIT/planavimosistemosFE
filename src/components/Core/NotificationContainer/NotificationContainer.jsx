import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Notifications.module.scss";
import { useTranslation } from "react-i18next";
import classnames from "classnames";
import EventsIcon from '../../Icons/Events';

let addNotificationExternal;

export const NotificationContainer = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [queue, setQueue] = useState([]);
    const timersRef = useRef(new Map());
    const nextDismissTimeRef = useRef(Date.now());

    const MAX_VISIBLE_NOTIFICATIONS = 3;
    const AUTO_DISMISS_INTERVAL = 5000; // 5 seconds between dismissals

    const addNotificationToVisible = useCallback((notification) => {
        setNotifications(prev => {
            if (prev.length >= MAX_VISIBLE_NOTIFICATIONS) {
                // Add to queue if already at max
                setQueue(currentQueue => [...currentQueue, notification]);
                return prev;
            }
            
            // Calculate dismiss time based on current position and next dismiss time
            const currentTime = Date.now();
            const dismissTime = Math.max(nextDismissTimeRef.current, currentTime + AUTO_DISMISS_INTERVAL);
            
            // Update next dismiss time for the next notification
            nextDismissTimeRef.current = dismissTime + AUTO_DISMISS_INTERVAL;
            
            // Set auto-dismiss timer
            const timer = setTimeout(() => {
                removeNotification(notification.id);
            }, dismissTime - currentTime);
            
            timersRef.current.set(notification.id, timer);
            
            return [...prev, notification];
        });
    }, []);

    const removeNotification = useCallback((id) => {
        // Add fade-out class first
        setNotifications(prev => 
            prev.map(n => 
                n.id === id ? { ...n, fading: true } : n
            )
        );
        
        // Clear timer
        const timer = timersRef.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(id);
        }
        
        // Remove after animation completes
        setTimeout(() => {
            setNotifications(prev => {
                const filtered = prev.filter(n => n.id !== id);
                
                // Check if we can add from queue
                setQueue(currentQueue => {
                    if (currentQueue.length > 0 && filtered.length < MAX_VISIBLE_NOTIFICATIONS) {
                        const nextNotification = currentQueue[0];
                        
                        // Add the next notification after a small delay to prevent jumping
                        setTimeout(() => {
                            addNotificationToVisible(nextNotification);
                        }, 100);
                        
                        return currentQueue.slice(1);
                    }
                    return currentQueue;
                });
                
                return filtered;
            });
        }, 300); // Match CSS animation duration
    }, [addNotificationToVisible]);

    useEffect(() => {
        addNotificationExternal = (data) => {
            const id = Date.now();
            const newNotification = { id, data };
            addNotificationToVisible(newNotification);
        };
    }, [addNotificationToVisible]);

    // Handle bulk notifications with proper staggering
    const addBulkNotificationsInternal = useCallback((notificationsData) => {
        notificationsData.forEach((data, index) => {
            // Add a small delay between each notification to ensure proper staggering
            setTimeout(() => {
                const id = Date.now() + index; // Ensure unique IDs
                const newNotification = { id, data };
                addNotificationToVisible(newNotification);
            }, index * 50); // 50ms delay between each notification
        });
    }, [addNotificationToVisible]);

    useEffect(() => {
        addBulkNotificationsExternal = addBulkNotificationsInternal;
    }, [addBulkNotificationsInternal]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            timersRef.current.forEach(timer => clearTimeout(timer));
        };
    }, []);

  return (
    <div className={styles.container}>
      {notifications.map((n) => (
        <div key={n.id} className={classnames(styles.toast, styles[n.data.type], n.fading && styles.fadeOut)}>
          <span className={styles.icon}>
            {(() => {
              switch(n.data.type) {   
                case 'success':
                  return '✅';
                case 'error':
                  return '❌';
                case 'info':
                  return 'ℹ️';
                case 'warning':
                  return '⚠️';
                case 'clock_in':
                  return '🕒';
                case 'clock_out':
                  return '🕒';
                case 'break_start':
                  return '🕒';
                case 'break_end':
                  return '🕒';
                case 'new_event':
                  return <EventsIcon fill="#e8a43f" />;
                default:
                  return 'ℹ️';
              }
            })()}
          </span>
          <span className={styles.text}>{t(n.data.message)}</span>
          <button
            className={styles.close}
            onClick={() => removeNotification(n.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

// Action handlers for notifications without messages
const handleNotificationAction = (notificationType, data) => {
  // Get the current path to determine which data to refresh
  const currentPath = window.location.pathname;
  
  switch (notificationType) {
    case 'clock_in':
    case 'clock_out':
    case 'break_start':
    case 'break_end':
      console.log('clock_in, clock_out, break_start, break_end');
      break;
    case 'events_counter':
      if (document.getElementById(notificationType)) {
        document.getElementById(notificationType).innerHTML = data.count;
      }
      break;
    case 'new_event':
      // For event notifications, refresh schedule or events data
      if (currentPath.includes('/events')) {
        window.dispatchEvent(new CustomEvent('notification-action', {
          detail: { type: notificationType, data, action: 'refresh-events' }
        }));
      }
      break;
    default:
      // For other notification types, dispatch a generic refresh event
      window.dispatchEvent(new CustomEvent('notification-action', {
        detail: { type: notificationType, data, action: 'refresh-data' }
      }));
      break;
  }
};

export const addNotification = (data) => {
  if (window.location.hostname !== 'app.grownu.com') {
    console.log(data);
  }
  
  // Check if notification has a message
  if (!data.message || data.message.trim() === '') {
    // If no message, execute action immediately based on notification type
    handleNotificationAction(data.type, data);
    return;
  }
  
  // If notification has message, show it normally
  if (addNotificationExternal) {
    addNotificationExternal(data);
  }
};

// Export bulk notification function for external use
let addBulkNotificationsExternal;
export const addBulkNotifications = (notificationsData) => {
  if (addBulkNotificationsExternal) {
    addBulkNotificationsExternal(notificationsData);
  }
};