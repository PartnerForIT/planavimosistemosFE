import React, { useState, useEffect } from "react";
import styles from "./Notifications.module.scss";
import { useTranslation } from "react-i18next";
import classnames from "classnames";

let addNotificationExternal;

export const NotificationContainer = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        addNotificationExternal = (data) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, data }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 10000);
        };
    }, []);

  return (
    <div className={styles.container}>
      {notifications.map((n) => (
        <div key={n.id} className={classnames(styles.toast, styles[n.data.type])}>
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
                default:
                  return 'ℹ️';
              }
            })()}
          </span>
          <span className={styles.text}>{t(n.data.message)}</span>
          <button
            className={styles.close}
            onClick={() =>
              setNotifications((prev) => prev.filter((x) => x.id !== n.id))
            }
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export const addNotification = (data) => {
  if (addNotificationExternal) {
    addNotificationExternal(data);
  }
};