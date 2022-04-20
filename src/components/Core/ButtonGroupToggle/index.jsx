import React from 'react';

import styles from './ButtonGroupToggle.module.scss';

export default ({
  children,
  onChange,
  value,
  buttons,
}) => (
  <div className={styles.buttonGroupToggle}>
    {buttons.map((item) => (
      <button
        key={item.id}
        className={`${styles.buttonGroupToggle__item}
         ${item.id === value ? styles.buttonGroupToggle__item_selected : ''}`}
        onClick={() => {
          if (item.id !== value) {
            onChange(item.id);
          }
        }}
      >
        {item.label}
      </button>
    ))}
    {children}
  </div>
);
