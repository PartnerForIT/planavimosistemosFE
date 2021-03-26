import React, {
  useCallback, useEffect, useState,
} from 'react';
import classNames from 'classnames';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Scrollbar from 'react-scrollbars-custom';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';
import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import Button from '../Button/Button';
import styles from './Select.module.scss';

const initialItems = [];
export default function CustomSelect({
  items = initialItems, placeholder, buttonLabel, onChange = () => ({}), onFilter, width = '100%', type = 'items',
}) {
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });
  const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   console.count('items');
  // }, [items]);
  useEffect(() => {
    const checkedItemsArray = [];
    const stat = { checked: 0, unchecked: 0, total: 0 };

    const setCheckedToAll = (array) => {
      const arrayCopy = array.length ? [...array] : items;

      return arrayCopy.map((item) => {
        if (!item.disabled) {
          if (item.checked) {
            checkedItemsArray.push(item);
            stat.checked += 1;
          } else {
            stat.unchecked += 1;
          }
          stat.total += 1;
        }
        if (item.items?.length) {
          setCheckedToAll(item.items);
        }
        return { ...item, checked: !!item.checked, type: item.type ? item.type : 'item' };
      });
    };
    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
    setItemsStat({ ...stat });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    setItemsStat({
      ...itemsStat,
      checked: checkedItems.length,
      unchecked: itemsStat.total - checkedItems.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
    //   setItemsArray(resultedItems);
    setItemsArray(setCheckedToAll(itemsArray));
    setCheckedItems(checkedItemsArray);
    onChange(checkedItemsArray);
  }, [itemsArray, onChange]);
  // };

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

    // Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
    //   setItemsArray(resultedItems);
    setItemsArray(setCheckedToAll(itemsArray));
    setCheckedItems(checkedItemsArray);
    onChange(checkedItemsArray);
    // });
  }, [itemsArray, itemsStat, onChange]);

  const wrapperClasses = classNames(
    styles.inputWrapper,
    { [styles.inputWrapperOpened]: open },
  );

  const customSelectClasses = classNames(
    styles.customSelect,
    { [styles.customSelectOpened]: open },
  );

  const scrollableContentClasses = classNames(
    styles.scrollableContent,
  );

  const generateLabel = () => (checkedItems.length === 1 ? checkedItems[0].label
    : `${checkedItems.filter((e) => e.type !== 'group').length} ${type} selected`);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div style={{ width }}>
        {/* eslint-disable-next-line jsx-a11y/aria-role */}
        <div role='input' className={wrapperClasses} onClick={() => setOpen(!open)}>
          <input
            type='text'
            value={checkedItems.length > 0 ? generateLabel() : ''}
            placeholder={placeholder}
            className={customSelectClasses}
          />
        </div>

        {open ? (
          <div className={classNames(styles.contentBox)}>
            <CheckboxGroup selectAll={selectAll} itemsStat={itemsStat}>
              <Scrollbar
                className={scrollableContentClasses}
                removeTracksWhenNotUsed
                trackXProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                      <span
                        {...restProps}
                        ref={elementRef}
                        className={classNames(styles.scrollbarTrackX, { trackX: true })}
                      />
                    );
                  },
                }}
                trackYProps={{
                  renderer: (props) => {
                    const { elementRef, ...restProps } = props;
                    return (
                      <span
                        {...restProps}
                        ref={elementRef}
                        className={classNames(styles.scrollbarTrackY, { trackY: true })}
                      />
                    );
                  },
                }}
              >
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
              </Scrollbar>
            </CheckboxGroup>
            <Button fillWidth onClick={() => onFilter()}>{buttonLabel}</Button>
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}
