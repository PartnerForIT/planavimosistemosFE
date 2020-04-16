import React, { useEffect, useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';
import CheckboxGroup from './CheckboxGroup';

const CheckboxGroupWrapper = ({ items, onChange }) => {
  const [itemsArray, setItemsArray] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [itemsStat, setItemsStat] = useState({ checked: 0, unchecked: 0, total: 0 });

  useEffect(() => {
    const checkedItemsArray = [];
    const stat = { checked: 0, unchecked: 0, total: 0 };

    const setCheckedToAll = () => {
      const arrayCopy = [...items];
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
    Promise.all(setCheckedToAll(itemsArray)).then((resultedItems) => {
      setItemsArray(resultedItems);
      setItemsStat(stat);
      setCheckedItems(checkedItemsArray);
    });
  }, [items]);

  useEffect(() => {
    setItemsStat({
      ...itemsStat,
      checked: checkedItems.length,
      unchecked: itemsStat.total - checkedItems.length,
    });
  }, [checkedItems]);

  const selectAll = (check) => {
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
  };

  const handleCheckboxChange = (item) => {
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
  };

  return (
    <CheckboxGroup selectAll={selectAll} itemsStat={itemsStat}>
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
    </CheckboxGroup>
  );
};
export default CheckboxGroupWrapper;
