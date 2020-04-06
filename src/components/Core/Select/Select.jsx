import React, {
  useCallback, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import Button from '../Button/Button';
import styles from './Select.module.scss';

export default function CustomSelect({
  items, placeholder, buttonLabel, onChange,
}) {
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkedItemsArray = [];

    const setCheckedToAll = (array) => {
      const arrayCopy = array.length ? [...array] : items;

      return arrayCopy.map((item) => {
        if (!item.disabled) {
          if (item.checked) {
            checkedItemsArray.push(item);
            itemsStat.checked += 1;
          } else {
            itemsStat.unchecked += 1;
          }
          itemsStat.total += 1;
        }
        if (item.items) {
          setCheckedToAll(item.items);
        }
        return { ...item, checked: !!item.checked, type: item.type ? item.type : 'item' };
      });
    };
    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
    setItemsStat({ ...itemsStat });
  }, [items, setCheckedItems]);

  useEffect(() => {
    setItemsStat({
      ...itemsStat,
      checked: checkedItems.length,
      unchecked: itemsStat.total - checkedItems.length,
    });
  }, [checkedItems]);

  const handleCheckboxChange = useCallback((item) => {
    const checkedItemsArray = [];
    const setCheckedToAll = (array, value) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };
        if (o.id === item.id) {
          if (!newObj.disabled) newObj.checked = value || !o.checked;
          if (newObj.items) {
            newObj.items = setCheckedToAll(o.items, !o.checked);
          }
        } else if (o.items) {
          if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;
          newObj.items = setCheckedToAll(o.items, value);
        } else if (!newObj.disabled && typeof value !== 'undefined') newObj.checked = value;

        if (!newObj.disabled && newObj.checked) checkedItemsArray.push(newObj);

        return newObj;
      });
    };
    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
  }, [setItemsArray]);

  const selectAll = useCallback((check) => {
    const checkedItemsArray = [];
    const setCheckedToAll = (array) => {
      const arrayCopy = [...array];
      return arrayCopy.map((o) => {
        const newObj = { ...o };

        if (!newObj.disabled) newObj.checked = check;
        if (newObj.items) {
          newObj.items = setCheckedToAll(o.items);
        }

        if (!newObj.disabled && newObj.checked) checkedItemsArray.push(newObj);
        if (check) {
          setItemsStat({ ...itemsStat, checked: itemsStat.total, unchecked: 0 });
        } else {
          setItemsStat({ ...itemsStat, checked: 0, unchecked: itemsStat.total });
        }

        return newObj;
      });
    };

    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
  }, [itemsStat]);

  const wrapperClasses = classNames(
    styles.inputWrapper,
    { [styles.inputWrapperOpened]: open },
  );

  const customSelectClasses = classNames(
    styles.customSelect,
    { [styles.customSelectOpened]: open },
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <div role='input' className={wrapperClasses} onClick={() => setOpen(!open)}>
          <input
            type='text'
            value={checkedItems && checkedItems.filter((e) => e.type !== 'group').map((e) => e.label).join(', ')}
            disabled
            placeholder={placeholder}
            className={customSelectClasses}
          />
        </div>

        {open ? (
          <div className={classNames(styles.contentBox)}>
            <CheckboxGroup selectAll={selectAll} itemsStat={itemsStat}>
              {
                itemsArray.map((data) => (
                  data.type && data.type === 'group'
                    ? (
                      <Dropdown
                        key={data.id.toString()}
                        label={data.label}
                        currentItem={data}
                        checked={data.checked}
                        items={data.items}
                        onChange={handleCheckboxChange}
                      />
                    )
                    : (
                      <StyledCheckbox
                        key={data.id.toString()}
                        label={data.label}
                        item={data}
                        id={data.id}
                        checked={data.checked}
                        disabled={data.disabled}
                        onChange={handleCheckboxChange}
                      />
                    )
                ))
              }
            </CheckboxGroup>
            <Button fillWidth onClick={() => onChange(itemsArray, checkedItems)}>{buttonLabel}</Button>
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}
