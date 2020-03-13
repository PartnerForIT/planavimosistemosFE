import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import Button from '../Button/Button';
import styles from './Select.module.scss';

export default function CustomSelect({ items }) {
  const [itemsArray, setItemsArray] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });

  useEffect(() => {
    const result = items.map((item) => {
      if (!item.disabled) {
        if (item.checked) {
          itemsStat.checked += 1;
        } else {
          itemsStat.unchecked += 1;
        }
        itemsStat.total += 1;
      }
      return { ...item, checked: !!item.checked, type: item.type ? item.type : 'item' };
    });

    Promise.all(result).then((resultedItems) => {
      setItemsArray(resultedItems);
      setItemsStat({ ...itemsStat });
    });
  }, [items]);

  const handleCheckboxChange = useCallback((itemId) => {
    const setCheckedToAll = (array, value) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };
        if (o.id === itemId) {
          if (!newObj.disabled) newObj.checked = value || !o.checked;
          if (newObj.items) {
            newObj.items = setCheckedToAll(o.items, !o.checked);
          }
        } else if (o.items) {
          if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
          newObj.items = setCheckedToAll(o.items, value);
        } else if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
        return newObj;
      });
    };
    setItemsArray(setCheckedToAll);
  }, []);

  const CustomOption = ({ data }) => (data.type && data.type === 'group'
    ? (
      <Dropdown
        key={data.id.toString()}
        label={data.label}
        id={data.id}
        checked={data.checked}
        items={data.items}
        onChange={handleCheckboxChange}
      />
    )
    : (
      <StyledCheckbox
        key={data.id.toString()}
        label={data.label}
        id={data.id}
        checked={data.checked}
        disabled={data.disabled}
        onChange={handleCheckboxChange}
      />
    ));

  const CustomMenu = ({ children }) => (
    <div className={classNames(styles.contentBox)}>
      <CheckboxGroup>
        {children}
      </CheckboxGroup>
      <Button fillWidth>Filter</Button>
    </div>
  );

  return (
    <Select
      isMulti
      placeholder='All employees'
      onBlur={(e) => e.stopPropogation()}
      components={{ Option: CustomOption, Menu: CustomMenu }}
      options={itemsArray}
      maxMenuHeight={420}
      blurInputOnSelect={false}
      closeMenuOnSelect={false}
      className={classNames(styles.select)}
      classNamePrefix='select'
    />
  );
}
