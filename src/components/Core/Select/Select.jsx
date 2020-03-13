import React, { useCallback, useEffect, useState } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import StyledCheckbox from '../Checkbox/Checkbox';

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

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

  return (
    <div>
      {
        itemsArray.map((item, idx) => (item.type && item.type === 'group'
          ? (
            <Dropdown
              key={idx.toString()}
              label={item.label}
              id={item.id}
              checked={item.checked}
              items={item.items}
              onChange={handleCheckboxChange}
            />
          )
          : (
            <StyledCheckbox
              key={idx.toString()}
              label={item.label}
              id={item.id}
              checked={item.checked}
              disabled={item.disabled}
              onChange={handleCheckboxChange}
            />
          )))
      }
    </div>
  );
}
