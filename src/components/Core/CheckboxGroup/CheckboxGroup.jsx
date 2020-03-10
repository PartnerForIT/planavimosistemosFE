import React, { useState } from 'react';
import classNames from 'classnames';
import StyledCheckbox from '../Checkbox/Checkbox';
import styles from './CheckboxGroup.module.scss';

export default function CheckboxGroup(props) {
  const { items } = props;
  const [itemsArray, setItemsArray] = useState([...items]);

  const selectAll = () => {
    const filteredItems = itemsArray;
    filteredItems.forEach((item, idx) => {
      filteredItems[idx].checked = true;
    });
    setItemsArray(filteredItems);
  };

  return (
    <div className={classNames(styles.checkboxGroup)}>
      <div className={classNames(styles.headerRow)}>
        <button className={classNames(styles.button)} onClick={() => selectAll()}>Select All</button>
        <button className={classNames(styles.button)}>Select None</button>
      </div>
      <div className={classNames(styles.contentBox)}>
        {
          itemsArray.map((item, idx) => (
            <StyledCheckbox
              key={idx.toString()}
              label={item.label}
              defaultChecked={item.checked}
              disabled={item.disabled}
            />
          ))
        }
      </div>
    </div>
  );
}
