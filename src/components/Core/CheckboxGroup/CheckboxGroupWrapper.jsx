import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import Scrollbar from 'react-scrollbars-custom';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';
import CheckboxGroup from './CheckboxGroup';
import styles from '../Select/Select.module.scss';

const CheckboxGroupWrapper = ({
  items = [], onChange = () => ({}), height, maxHeight, wrapperMarginBottom,
}) => {
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });

  useEffect(() => {
    const checkedItemsArray = [];
    const stat = { checked: 0, unchecked: 0, total: 0 };

    const setCheckedToAll = (array) => {
      const arrayCopy = array.length ? [...array] : items;
      if (!arrayCopy.length) return arrayCopy;

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
        if (item.items) {
          setCheckedToAll(item.items);
        }
        return { ...item, checked: !!item.checked, type: item.type ? item.type : 'item' };
      });
    };

    setItemsArray(setCheckedToAll);
    setCheckedItems(checkedItemsArray);
    setItemsStat({ ...stat });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, setCheckedItems]);

  useEffect(() => {
    setItemsStat({
      ...itemsStat,
      checked: checkedItems.length,
      unchecked: itemsStat.total - checkedItems.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedItems]);

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

    Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
      setItemsArray(resultedItems);
      setCheckedItems(checkedItemsArray);
      onChange(checkedItemsArray);
    });
  }, [itemsArray, itemsStat, onChange]);

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
    Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
      setItemsArray(resultedItems);
      setCheckedItems(checkedItemsArray);
      onChange(checkedItemsArray);
    });
  }, [itemsArray, onChange]);

  return (
    <CheckboxGroup
      selectAll={selectAll}
      itemsStat={itemsStat}
      height={height}
      maxHeight={maxHeight}
      wrapperMarginBottom={wrapperMarginBottom}
    >
      <Scrollbar
        className={styles.scrollableContent}
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
          itemsArray.length
            ? itemsArray.map((data) => (
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
            : <p>There is no data to display</p>
        }
      </Scrollbar>
    </CheckboxGroup>
  );
};
export default CheckboxGroupWrapper;
